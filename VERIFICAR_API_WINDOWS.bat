@echo off
chcp 65001 >nul
curl --silent --show-error "http://localhost:3000/api/health"
echo.
echo.
echo O resultado esperado quando o MySQL esta conectado e status: ok.
pause
