@echo off
chcp 65001 >nul
cd /d "%~dp0"
if not exist "LembraFarma\node_modules" (
  echo Instale antes usando INSTALAR_WINDOWS.bat.
  pause
  exit /b 1
)
if not exist "lembrafarma_api\node_modules" (
  echo Instale antes usando INSTALAR_WINDOWS.bat.
  pause
  exit /b 1
)
echo.
echo Iniciando API MySQL (http://localhost:3000/api/health)
echo e frontend React (http://localhost:5173)
echo.
echo Abra http://localhost:5173 no navegador.
echo Mantenha esta janela aberta enquanto utilizar o sistema.
echo.
call npm --prefix "LembraFarma" run dev
pause
