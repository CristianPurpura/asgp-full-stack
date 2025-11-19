#!/bin/bash

echo "=== Instalando NGINX y Certbot ==="
sudo apt update
sudo apt install -y nginx certbot python3-certbot-nginx

echo "=== Configurando NGINX como proxy inverso ==="
sudo tee /etc/nginx/sites-available/asgp-backend > /dev/null <<'EOF'
server {
    listen 80;
    server_name 98.95.235.51;

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
EOF

echo "=== Habilitando sitio NGINX ==="
sudo ln -sf /etc/nginx/sites-available/asgp-backend /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default

echo "=== Verificando configuración NGINX ==="
sudo nginx -t

echo "=== Reiniciando NGINX ==="
sudo systemctl restart nginx
sudo systemctl enable nginx

echo "=== Estado de servicios ==="
echo "PM2:"
pm2 list
echo ""
echo "NGINX:"
sudo systemctl status nginx --no-pager -l
