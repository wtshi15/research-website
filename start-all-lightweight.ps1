$projectRoot = $PSScriptRoot
Set-Location $projectRoot
$envFile = "$projectRoot\.env.local"

$envLine = "NEXT_PUBLIC_API_BASE_URL=http://localhost:8000"
Set-Content -Path $envFile -Value $envLine
Write-Host "Set .env.local to use localhost backend."

# Start Ollama
Start-Process powershell -ArgumentList "cd `"$projectRoot`"; ollama run qwen:0.5b; pause" -WindowStyle Normal

# Start Backend using python -m uvicorn
Start-Process powershell -ArgumentList "cd `"$projectRoot`"; python -m uvicorn backend.main:app --reload; pause" -WindowStyle Normal

# Start Frontend
Start-Process powershell -ArgumentList "cd `"$projectRoot`"; npm run dev; pause" -WindowStyle Normal

Write-Host "`nAll services started."