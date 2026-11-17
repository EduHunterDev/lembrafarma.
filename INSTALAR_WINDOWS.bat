@echo off
chcp 65001 >nul
setlocal
cd /d "%~dp0"
echo ====================================================
echo  INSTALACAO LEMBRAFARMA - FRONTEND + BACKEND
 echo ====================================================
where node >nul 2>&1
if errorlevel 1 (
  echo ERRO: Instale Node.js 20 ou superior e abra este arquivo novamente.
  pause
  exit /b 1
)
if not exist "lembrafarma_api\.env" (
  copy "lembrafarma_api\.env.example" "lembrafarma_api\.env" >nul
  echo Foi criado um .env de exemplo. Configure o MySQL antes de executar as migrations.
)
echo.
echo [1/3] Instalando dependencias do backend...
call npm --prefix "lembrafarma_api" ci
if errorlevel 1 goto :erro
echo.
echo [2/3] Instalando dependencias do frontend...
call npm --prefix "LembraFarma" ci
if errorlevel 1 goto :erro
echo.
echo [3/3] Aplicando migrations no schema configurado no .env...
call npm --prefix "lembrafarma_api" run db:migrate
if errorlevel 1 (
  echo.
  echo FALHA nas migrations. Verifique se o MySQL esta ligado,
  echo se o banco DB_NAME ja existe e se usuario/senha estao corretos.
  echo Nao execute ddl.sql alem das migrations no mesmo banco.
  pause
  exit /b 1
)
echo.
echo Instalacao concluida. Execute INICIAR_WINDOWS.bat.
pause
exit /b 0
:erro
echo ERRO ao instalar dependencias. Consulte o terminal.
pause
exit /b 1
