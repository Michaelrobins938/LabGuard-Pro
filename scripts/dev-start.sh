#!/usr/bin/env bash
# One-click local dev runner for LabGuard Pro
# -------------------------------------------------
# 1. installs root dependencies if node_modules missing
# 2. ensures backend .env exists (creates from example)
# 3. runs prisma generate & migrate (sqlite default)
# 4. starts backend (:4000) and frontend (:3000) concurrently
# 5. opens browser to http://localhost:3000
# -------------------------------------------------
set -e

# detect repo root
ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

if [ ! -d "node_modules" ]; then
  echo "Installing root dependencies..."
  npm install --silent
fi

# ensure backend env
if [ ! -f "backend/.env" ]; then
  echo "Creating backend/.env from example (edit as needed)..."
  cp backend/.env.local.example backend/.env || touch backend/.env
fi
# ensure web env
if [ ! -f "apps/web/.env.local" ]; then
  echo 'NEXT_PUBLIC_API_URL="http://localhost:4000"' > apps/web/.env.local
fi

# prisma generate
( cd backend && npx prisma generate )

# start services concurrently
npx concurrently \
  "npm --workspace backend run dev" \
  "npm --workspace apps/web run dev" \
  --names "BACKEND,WEB" --prefix-colors "magenta,cyan" &

sleep 5
# open browser
if command -v xdg-open >/dev/null; then
  xdg-open http://localhost:3000
elif command -v open >/dev/null; then
  open http://localhost:3000
fi

wait