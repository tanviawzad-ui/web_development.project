# Requires Run as Administrator
$ErrorActionPreference = "Stop"

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host " Configuring Microsoft SQL Server Express " -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan

# 1. Detect SQLEXPRESS registry path
$regBase = "HKLM:\SOFTWARE\Microsoft\Microsoft SQL Server"
$instanceReg = Get-ChildItem $regBase | Where-Object { $_.PSChildName -like "*SQLEXPRESS*" } | Select-Object -First 1

if (-not $instanceReg) {
    Write-Host "ERROR: Could not locate SQLEXPRESS in registry." -ForegroundColor Red
    pause
    exit 1
}

$instanceKey = $instanceReg.Name
Write-Host "Found SQL Server instance: $instanceKey" -ForegroundColor Green

# 2. Enable Mixed Mode Authentication (LoginMode = 2)
$serverRegPath = Join-Path $instanceReg.PSPath "MSSQLServer"
Set-ItemProperty -Path $serverRegPath -Name "LoginMode" -Value 2
Write-Host "[OK] Enabled Mixed Authentication Mode (Windows + SQL Server Auth)" -ForegroundColor Green

# 3. Enable TCP/IP protocol
$tcpRegPath = Join-Path $instanceReg.PSPath "MSSQLServer\SuperSocketNetLib\Tcp"
Set-ItemProperty -Path $tcpRegPath -Name "Enabled" -Value 1
Write-Host "[OK] Enabled TCP/IP Protocol" -ForegroundColor Green

# 4. Set static Port 1433 on IPAll
$ipAllRegPath = Join-Path $tcpRegPath "IPAll"
Set-ItemProperty -Path $ipAllRegPath -Name "TcpPort" -Value "1433"
Set-ItemProperty -Path $ipAllRegPath -Name "TcpDynamicPorts" -Value ""
Write-Host "[OK] Set TCP Port to 1433" -ForegroundColor Green

# 5. Restart SQL Server service
Write-Host "Restarting SQL Server (SQLEXPRESS) service..." -ForegroundColor Yellow
Restart-Service "MSSQL`$SQLEXPRESS" -Force
Write-Host "[OK] SQL Server (SQLEXPRESS) restarted successfully!" -ForegroundColor Green

# 6. Ensure sa login is enabled with password
Write-Host "Configuring sa login..." -ForegroundColor Yellow
sqlcmd -S ".\SQLEXPRESS" -E -C -Q "ALTER LOGIN sa WITH PASSWORD = 'YourStrong@Passw0rd', CHECK_POLICY = OFF; ALTER LOGIN sa ENABLE;"
Write-Host "[OK] sa login enabled with password: YourStrong@Passw0rd" -ForegroundColor Green

Write-Host "`n========================================================" -ForegroundColor Cyan
Write-Host " SQL Server Express is now ready for Spring Boot!       " -ForegroundColor Cyan
Write-Host " Listening on port 1433 with Mixed Authentication Mode. " -ForegroundColor Cyan
Write-Host "========================================================" -ForegroundColor Cyan
