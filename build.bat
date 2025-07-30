cd /d %~dp0

cd backend
call npm run build
if %ERRORLEVEL% NEQ 0 (
    echo Backend compilation failed.
    goto error
) else (
    echo Backend successfully compiled.
)
cd ..
cd frontend
call npm run build
if %ERRORLEVEL% NEQ 0 (
    echo Frontend compilation failed.
    goto error
) else (
    echo Frontend successfully compiled.
)
cd ..
goto end

:error
cd /d %~dp0
rem Set ERRORLEVEL to 1
EXIT /B 1

:end