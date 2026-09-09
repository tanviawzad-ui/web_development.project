@echo off
powershell -Command "Start-Process cmd -ArgumentList '/c net stop MSSQL$SQLEXPRESS && net start MSSQL$SQLEXPRESS' -Verb RunAs"
