#!/usr/bin/env bash
# Run ON THE SERVER as root or with sudo:
#   cd /path/to/poker-mavens-first-register
#   sudo bash nginx/setup-nginx.sh register.iqpoker88.com
#
# Or for main domain:
#   sudo bash nginx/setup-nginx.sh iqpoker88.com

set -euo pipefail

DOMAIN="${1:-register.iqpoker88.com}"
APP_PORT="${APP_PORT:-3010}"
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
SITE_NAME="iqpoker88-register"
AVAILABLE="/etc/nginx/sites-available/${SITE_NAME}"
ENABLED="/etc/nginx/sites-enabled/${SITE_NAME}"

if [[ $EUID -ne 0 ]]; then
  echo "Run with sudo: sudo bash nginx/setup-nginx.sh ${DOMAIN}"
  exit 1
fi

echo "==> Domain: ${DOMAIN}"
echo "==> App port: ${APP_PORT}"

if ! command -v nginx >/dev/null 2>&1; then
  echo "==> Installing nginx..."
  apt-get update
  apt-get install -y nginx
fi

cat > "${AVAILABLE}" <<EOF
upstream iqpoker88_register {
    server 127.0.0.1:${APP_PORT};
    keepalive 64;
}

server {
    listen 80;
    listen [::]:80;
    server_name ${DOMAIN};

    client_max_body_size 10m;

    location / {
        proxy_pass http://iqpoker88_register;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
        proxy_read_timeout 60s;
    }
}
EOF

ln -sf "${AVAILABLE}" "${ENABLED}"

# Remove default site if it conflicts
if [[ -f /etc/nginx/sites-enabled/default ]]; then
  rm -f /etc/nginx/sites-enabled/default
fi

nginx -t
systemctl enable nginx
systemctl reload nginx

echo ""
echo "==> Nginx configured for http://${DOMAIN}"
echo "==> Make sure the app is running:"
echo "    cd ${PROJECT_DIR} && pm2 start ecosystem.config.cjs"
echo ""
echo "==> Test on server:"
echo "    curl -I http://127.0.0.1:${APP_PORT}/register"
echo "    curl -I http://${DOMAIN}/register"
echo ""
echo "==> SSL (optional, DNS must point to this server):"
echo "    apt install -y certbot python3-certbot-nginx"
echo "    certbot --nginx -d ${DOMAIN}"
