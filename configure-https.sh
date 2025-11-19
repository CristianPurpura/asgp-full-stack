#!/bin/bash
set -e

echo "=== 1. Instalando NGINX ==="
sudo apt update
sudo DEBIAN_FRONTEND=noninteractive apt install -y nginx

echo "=== 2. Creando directorio SSL ==="
sudo mkdir -p /etc/nginx/ssl

echo "=== 3. Generando certificado SSL autofirmado ==="
sudo openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout /etc/nginx/ssl/nginx.key \
  -out /etc/nginx/ssl/nginx.crt \
  -subj "/C=AR/ST=BuenosAires/L=BuenosAires/O=ASGP/CN=98.95.235.51"

echo "=== 4. Creando configuración NGINX ==="
sudo tee /etc/nginx/sites-available/asgp-backend > /dev/null <<'NGINX_CONFIG'
server {
    listen 80;
    listen 443 ssl http2;
    server_name 98.95.235.51;

    ssl_certificate /etc/nginx/ssl/nginx.crt;
    ssl_certificate_key /etc/nginx/ssl/nginx.key;
    
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_prefer_server_ciphers on;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
NGINX_CONFIG

echo "=== 5. Habilitando sitio ==="
sudo ln -sf /etc/nginx/sites-available/asgp-backend /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default

echo "=== 6. Verificando configuración ==="
sudo nginx -t

echo "=== 7. Reiniciando NGINX ==="
sudo systemctl restart nginx
sudo systemctl enable nginx

echo "=== 8. Verificando estado ==="
sudo systemctl status nginx --no-pager
curl -k https://localhost/ || echo "Curl falló"

echo "=== CONFIGURACIÓN COMPLETADA ==="
