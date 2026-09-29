@echo off
setlocal
echo ========================================================
echo   Janith Income - JJ Online Business Deployer
echo ========================================================
echo.

cd /d "%~dp0"

echo [1/3] Building latest production package...
call npm.cmd run build
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Build failed! Please check your code.
    pause
    exit /b %ERRORLEVEL%
)

echo.
echo [2/3] Deploying to Netlify (janith-income-jj)...
call npx.cmd netlify-cli deploy --prod --dir dist --no-build --auth nfp_47b69nTZ1zjVtMLXsEnxx1bbnSYUJQGA78e9

echo.
echo [3/3] Deployment complete!
echo Live URL: https://janith-income-jj.netlify.app
echo ========================================================
pause
