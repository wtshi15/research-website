$projectRoot = $PSScriptRoot
Set-Location $projectRoot
# $uvicornPath = "$env:USERPROFILE\AppData\Roaming\Python\Python313\Scripts\uvicorn.exe"
$uvicornPath = "$env:USERPROFILE\appdata\local\programs\python\python312\scripts\uvicorn.exe"
$pidFile = "$projectRoot\.pids"
$envFile = "$projectRoot\.env.local"

# Clear old PID file
if (Test-Path $pidFile) {
    Remove-Item $pidFile
}

# Always overwrite .env.local with localhost API base
$envLine = "NEXT_PUBLIC_API_BASE_URL=http://localhost:8000"
Set-Content -Path $envFile -Value $envLine
Write-Host "Set .env.local to use localhost backend."

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

Write-Host "`nAll services started."
