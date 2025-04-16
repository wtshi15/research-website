$projectRoot = $PSScriptRoot
Set-Location $projectRoot
$uvicornPath = "$env:USERPROFILE\AppData\Roaming\Python\Python313\Scripts\uvicorn.exe"
$pidFile = "$projectRoot\.pids"

# First, check default path for ngrok
$ngrokPath = "$env:USERPROFILE\ngrok\ngrok.exe"

# If not found, try PATH
if (-not (Test-Path $ngrokPath)) {
    $ngrokCommand = Get-Command ngrok.exe -ErrorAction SilentlyContinue
    if ($ngrokCommand) {
        $ngrokPath = $ngrokCommand.Source
    } else {
        $ngrokPath = $null
    }
}

# Clear old PID file
if (Test-Path $pidFile) {
    Remove-Item $pidFile
}

# Start frontend ngrok with static domain only
$frontendDomain = "hopefully-ultimate-raven.ngrok-free.app"

if ($ngrokPath -and (Test-Path $ngrokPath)) {
    $ngrokFrontend = Start-Process powershell -ArgumentList "`"$ngrokPath`" http --domain=$frontendDomain 3000; pause" -WindowStyle Normal -PassThru
    "ngrok-frontend $($ngrokFrontend.Id)" | Out-File -Append -FilePath $pidFile
    Write-Host "`nFrontend ngrok domain started at: https://$frontendDomain"
} else {
    Write-Host "ngrok.exe not found in default location or system PATH."
}

# Start Ollama
$ollama = Start-Process powershell -ArgumentList "cd `"$projectRoot`"; ollama run qwen:0.5b; pause" -WindowStyle Normal -PassThru
"ollama $($ollama.Id)" | Out-File -Append -FilePath $pidFile

# Start Backend (on localhost)
if (Test-Path $uvicornPath) {
    $backend = Start-Process powershell -ArgumentList "cd `"$projectRoot`"; & `"$uvicornPath`" backend.main:app --reload; pause" -WindowStyle Normal -PassThru
    "backend $($backend.Id)" | Out-File -Append -FilePath $pidFile
} else {
    Write-Host "Uvicorn not found. Backend not started."
}

# Start Frontend (on localhost:3000)
$frontend = Start-Process powershell -ArgumentList "cd `"$projectRoot`"; npm run dev; pause" -WindowStyle Normal -PassThru
"frontend $($frontend.Id)" | Out-File -Append -FilePath $pidFile

Write-Host "`nAll services started. Visit: https://$frontendDomain"
