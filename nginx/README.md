# Nginx на сервере — пошагово

Приложение слушает порт **3010**.

## Шаг 1. DNS

В Cloudflare добавьте запись:

| Type | Name | Content | Proxy |
|------|------|---------|-------|
| A | register | IP вашего VPS | DNS only (серое облако) |

## Шаг 2. На сервере — приложение

```bash
cd /var/www/poker-mavens-first-register   # ваш путь
git pull
npm ci
npm run build
pm2 start ecosystem.config.cjs
pm2 save
```

Проверка:

```bash
curl -I http://127.0.0.1:3010/register
```

Должен быть ответ `HTTP/1.1 200` или `307`.

## Шаг 3. Nginx — автоматически

```bash
cd /var/www/poker-mavens-first-register
sudo bash nginx/setup-nginx.sh register.iqpoker88.com
```

Или вручную:

```bash
sudo cp nginx/iqpoker88-register.conf /etc/nginx/sites-available/iqpoker88-register
sudo ln -sf /etc/nginx/sites-available/iqpoker88-register /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl reload nginx
```

## Шаг 4. Проверка снаружи

Откройте в браузере:

- http://register.iqpoker88.com/register
- http://register.iqpoker88.com/admin/login

## Шаг 5. HTTPS (SSL)

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d register.iqpoker88.com
```

В Cloudflare после SSL: режим **Full**.

## Если не работает

```bash
# приложение запущено?
pm2 status
pm2 logs iqpoker88-register

# nginx ошибки
sudo nginx -t
sudo tail -f /var/log/nginx/error.log

# порт занят?
ss -tlnp | grep 3010
```

## Основной домен iqpoker88.com

Только если Poker Mavens на другом адресе:

```bash
sudo bash nginx/setup-nginx.sh iqpoker88.com
```

Файл конфига: `nginx/iqpoker88-register.conf`
