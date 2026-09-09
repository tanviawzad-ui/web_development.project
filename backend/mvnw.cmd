@echo off
setlocal

set "MAVEN_DIR=%USERPROFILE%\.m2\wrapper\apache-maven-3.9.8"
set "MVN_EXEC=%MAVEN_DIR%\bin\mvn.cmd"

if exist "%MVN_EXEC%" goto runMaven

echo [mvnw] Apache Maven not found. Installing Maven 3.9.8...
if not exist "%USERPROFILE%\.m2\wrapper" mkdir "%USERPROFILE%\.m2\wrapper"

powershell -NoProfile -ExecutionPolicy Bypass -Command "[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12; Write-Host '[mvnw] Downloading Maven 3.9.8 distribution...'; Invoke-WebRequest -Uri 'https://repo.maven.apache.org/maven2/org/apache/maven/apache-maven/3.9.8/apache-maven-3.9.8-bin.zip' -OutFile '%TEMP%\apache-maven-3.9.8-bin.zip'; Write-Host '[mvnw] Extracting Maven...'; Expand-Archive -Path '%TEMP%\apache-maven-3.9.8-bin.zip' -DestinationPath '%USERPROFILE%\.m2\wrapper' -Force; Remove-Item '%TEMP%\apache-maven-3.9.8-bin.zip' -Force;"

if not exist "%MVN_EXEC%" (
  echo [mvnw] ERROR: Failed to install Maven.
  exit /b 1
)

:runMaven
"%MVN_EXEC%" %*
exit /b %ERRORLEVEL%
