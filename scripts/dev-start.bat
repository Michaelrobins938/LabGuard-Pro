@echo off
REM One-click dev runner for LabGuard Pro (Windows)
cd /d %~dp0\..

IF NOT EXIST node_modules ( echo Installing dependencies & npm install --silent )

REM install concurrently if not present
npm ls concurrently >nul 2>&1
IF %ERRORLEVEL% NEQ 0 (
  echo Installing dev dependency: concurrently & npm install -D concurrently --silent
)

IF NOT EXIST backend\.env (
  echo Copying backend env... & copy backend\.env.local.example backend\.env >nul 2>&1
)
IF NOT EXIST apps\web\.env.local (
  echo NEXT_PUBLIC_API_URL=http://localhost:4000>apps\web\.env.local
)

pushd backend
npx prisma generate
popd

npx concurrently "npm --workspace backend run dev" "npm --workspace apps/web run dev" --names "BACKEND,WEB" --prefix-colors "magenta,cyan"

pause 