# runsql.ps1

# Control whether to clear data before entering the shell
$clear_data = $false

# PostgreSQL password for the session
$env:PGPASSWORD = "0401"

# Paths
$sqlFile = "$PSScriptRoot\clear_data.sql"
$tempSelectFile = "$PSScriptRoot\temp_select.sql"

# Run clear_data.sql if flag is enabled
if ($clear_data -eq $true) {
    Write-Host "Running clear_data.sql..."
    psql -U postgres -d survey_db -h localhost -f $sqlFile
} else {
    Write-Host "Skipping data clearing step. Displaying current table contents..."

    # Write SELECT queries to a temporary file
    @"
SELECT * FROM survey_responses;
SELECT * FROM chat_messages;
"@ | Set-Content $tempSelectFile

    # Run the SELECT queries
    psql -U postgres -d survey_db -h localhost -f $tempSelectFile

    # Remove the temporary file
    Remove-Item $tempSelectFile
}

# Enter interactive PostgreSQL shell
psql -U postgres -d survey_db -h localhost
