@echo off
chcp 65001 >nul
cd /d "%~dp0"
echo Testes do backend com SQLite temporario:
call npm --prefix "lembrafarma_api" test
if errorlevel 1 goto :erro
echo.
echo Testes do frontend:
call npm --prefix "LembraFarma" test
if errorlevel 1 goto :erro
echo.
echo Testes concluídos sem falhas.
pause
exit /b 0
:erro
echo Pelo menos um teste falhou.
pause
exit /b 1
