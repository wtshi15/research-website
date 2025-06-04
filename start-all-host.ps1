$backendEnabled = $true  # Set to $false to only start the frontend

$projectRoot = $PSScriptRoot
Set-Location $projectRoot
$envFile = "$projectRoot\.env.local"
$frontendDomain = "hopefully-ultimate-raven.ngrok-free.app"

# Check for ngrok
$ngrokPath = "$env:USERPROFILE\ngrok\ngrok.exe"
if (-not (Test-Path $ngrokPath)) {
    $ngrokCommand = Get-Command ngrok.exe -ErrorAction SilentlyContinue
    if ($ngrokCommand) {
        $ngrokPath = $ngrokCommand.Source
    } else {
        $ngrokPath = $null
    }
}

if ($backendEnabled) {
    # Default fallback
    $envLine = "NEXT_PUBLIC_API_BASE_URL=http://localhost:8000"
    Set-Content -Path $envFile -Value $envLine
    Write-Host "Set .env.local to use localhost backend."

    # Start backend ngrok (ephemeral)
    if ($ngrokPath -and (Test-Path $ngrokPath)) {
        Start-Process -FilePath $ngrokPath -ArgumentList "http 8000" -WindowStyle Normal
        Start-Sleep -Seconds 6

        try {
            $response = Invoke-RestMethod -Uri "http://127.0.0.1:4040/api/tunnels"
            $backendTunnel = $response.tunnels | Where-Object { $_.config.addr -match "8000" }
            $backendUrl = $backendTunnel.public_url
            Write-Host "`nBackend ngrok URL: $backendUrl"

            $envLine = "NEXT_PUBLIC_API_BASE_URL=$backendUrl"
            Set-Content -Path $envFile -Value $envLine
            Write-Host "Updated .env.local with backend ngrok URL."
        } catch {
            Write-Host "Failed to retrieve backend ngrok URL. Using localhost."
        }
    } else {
        Write-Host "ngrok.exe not found in default location or system PATH. Using localhost."
    }

    # Start Ollama
    Start-Process powershell -ArgumentList "cd `"$projectRoot`"; ollama run qwen:0.5b; pause" -WindowStyle Normal

    # Start Backend
    Start-Process powershell -ArgumentList "cd `"$projectRoot`"; python -m uvicorn backend.main:app --reload; pause" -WindowStyle Normal
}

# Start frontend ngrok with static domain
if ($ngrokPath) {
    Start-Process powershell -ArgumentList "`"$ngrokPath`" http --domain=$frontendDomain 3000; pause" -WindowStyle Normal
    Write-Host "`nFrontend ngrok domain started at: https://$frontendDomain"
}

# Start Frontend
Start-Process powershell -ArgumentList "cd `"$projectRoot`"; npm run dev; pause" -WindowStyle Normal

Write-Host "`nAll services started. Frontend: https://$frontendDomain"
