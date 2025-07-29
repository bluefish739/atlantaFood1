cd /d %~dp0

cd backend
call npm run build
if %ERRORLEVEL% NEQ 0 (
    echo Backend compilation failed.
    goto end
) else (
    echo Backend successfully compiled.
)
cd ..
cd frontend
call npm run build
if %ERRORLEVEL% NEQ 0 (
    echo Frontend compilation failed.
    goto end
) else (
    echo Frontend successfully compiled.
)
cd ..

:end
cd /d %~dp0