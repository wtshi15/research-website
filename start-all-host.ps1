$projectRoot = $PSScriptRoot
Set-Location $projectRoot
$uvicornPath = "$env:USERPROFILE\AppData\Roaming\Python\Python313\Scripts\uvicorn.exe"
$pidFile = "$projectRoot\.pids"
$envFile = "$projectRoot\.env.local"

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

# Start backend ngrok (ephemeral, port 8000)
if ($ngrokPath -and (Test-Path $ngrokPath)) {
    $ngrokBackend = Start-Process -FilePath $ngrokPath -ArgumentList "http 8000" -WindowStyle Normal -PassThru
    "ngrok-backend $($ngrokBackend.Id)" | Out-File -Append -FilePath $pidFile

    # Wait for ngrok to start and provide URL
    Start-Sleep -Seconds 6

    try {
        $response = Invoke-RestMethod -Uri "http://127.0.0.1:4040/api/tunnels"
        $backendTunnel = $response.tunnels | Where-Object { $_.config.addr -match "8000" }
        $backendUrl = $backendTunnel.public_url

        Write-Host "`nBackend ngrok URL: $backendUrl"

        # Ensure .env.local exists and overwrite it with latest backend URL
        $envLine = "NEXT_PUBLIC_API_BASE_URL=$backendUrl"
        Set-Content -Path $envFile -Value $envLine
        Write-Host "Created or updated .env.local with backend URL."
    } catch {
        Write-Host "Failed to retrieve backend ngrok URL."
    }
} else {
    Write-Host "ngrok.exe not found in default location or system PATH."
}

# Start frontend ngrok with static domain
$frontendDomain = "hopefully-ultimate-raven.ngrok-free.app"
$ngrokFrontend = Start-Process powershell -ArgumentList "`"$ngrokPath`" http --domain=$frontendDomain 3000; pause" -WindowStyle Normal -PassThru
"ngrok-frontend $($ngrokFrontend.Id)" | Out-File -Append -FilePath $pidFile

# Start Ollama
$ollama = Start-Process powershell -ArgumentList "cd `"$projectRoot`"; ollama run qwen:0.5b; pause" -WindowStyle Normal -PassThru
"ollama $($ollama.Id)" | Out-File -Append -FilePath $pidFile

# Start Backend
if (Test-Path $uvicornPath) {
    $backend = Start-Process powershell -ArgumentList "cd `"$projectRoot`"; & `"$uvicornPath`" backend.main:app --reload; pause" -WindowStyle Normal -PassThru
    "backend $($backend.Id)" | Out-File -Append -FilePath $pidFile
} else {
    Write-Host "Uvicorn not found. Backend not started."
}

# Start Frontend
$frontend = Start-Process powershell -ArgumentList "cd `"$projectRoot`"; npm run dev; pause" -WindowStyle Normal -PassThru
"frontend $($frontend.Id)" | Out-File -Append -FilePath $pidFile

Write-Host "`nAll services started. Frontend: https://$frontendDomain"
