#!/usr/bin/env bash
set -euo pipefail

APP_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$APP_DIR"

# Load nvm if installed (Linux server)
export NVM_DIR="${NVM_DIR:-$HOME/.nvm}"
if [[ -s "$NVM_DIR/nvm.sh" ]]; then
  # shellcheck source=/dev/null
  source "$NVM_DIR/nvm.sh"
  if [[ -f .nvmrc ]]; then
    echo "==> nvm install (from .nvmrc)"
    nvm install
    nvm use
  fi
fi

echo "==> Node $(node -v), npm $(npm -v)"

echo "==> Pull latest code"
git pull origin main

echo "==> Install dependencies"
npm ci

echo "==> Build"
npm run build

echo "==> Ensure data directory exists"
mkdir -p data

echo "==> Restart app"
if command -v pm2 >/dev/null 2>&1; then
  pm2 startOrReload ecosystem.config.cjs --update-env
  pm2 save
else
  echo "PM2 not found. Run manually: npm start"
fi

echo "==> Done. App should be on port 3010"
