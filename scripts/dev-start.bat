@echo off
REM One-click dev runner for LabGuard Pro (Windows)
cd /d %~dp0\..

IF NOT EXIST node_modules (
  echo Installing dependencies...
  npm install --silent
)

IF NOT EXIST backend\.env (
  echo Copying backend env...
  copy backend\.env.local.example backend\.env >nul 2>&1
)

IF NOT EXIST apps\web\.env.local (
  echo NEXT_PUBLIC_API_URL=http://localhost:4000>apps\web\.env.local
)

REM generate prisma client
pushd backend
npx prisma generate
popd

REM start concurrently
npx concurrently "npm --workspace backend run dev" "npm --workspace apps/web run dev" --names "BACKEND,WEB" --prefix-colors "magenta,cyan" 