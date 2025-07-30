cd /d %~dp0

call build.bat
if %ERRORLEVEL% NEQ 0 (
    echo Complilation failed.
    goto end
) else (
    call firebase serve
)

:end
cd /d %~dp0