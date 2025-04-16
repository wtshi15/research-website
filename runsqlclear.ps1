# runsqlclear.ps1


# PostgreSQL password for the session
$env:PGPASSWORD = "0401"

# Paths
$sqlFile = "$PSScriptRoot\clear_data.sql"
$tempSelectFile = "$PSScriptRoot\temp_select.sql"

# Run clear_data.sql if flag is enabled

Write-Host "Running clear_data.sql..."
psql -U postgres -d survey_db -h localhost -f $sqlFile
