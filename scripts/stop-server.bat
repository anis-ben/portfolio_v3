@echo off
rem -------------------------------------------------
rem   Stop Next.js development server (npm run dev)
rem   Attempts to find and kill the node process started by Next.js
rem -------------------------------------------------

echo Stopping Next.js development server...

for /f "tokens=2 delims=," %I in ("'powershell -NoProfile -Command "Get-Process -Name node ^| Where-Object { $_.Path -like '*next*dev*' } ^| Select-Object -First 1 -ExpandProperty Id"'") do set NODEPID=%I

if defined NODEPID (
    echo Found Node process with PID %NODEPID%
    taskkill /PID %NODEPID% /F
    echo Server stopped.
) else (
    echo No running Next.js dev process found.
)

rem If the above fails, you can force‑kill all node processes (use with care):
rem taskkill /IM node.exe /F
