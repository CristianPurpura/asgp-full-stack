# Instrucciones para configurar HTTPS en el backend EC2

## Conectarse a EC2
ssh -i ~/.ssh/vockey.pem ubuntu@98.95.235.51

## 1. Instalar NGINX
sudo apt update
sudo apt install -y nginx

## 2. Crear configuración de NGINX
sudo nano /etc/nginx/sites-available/asgp-backend

## Pegar este contenido:
```
server {
    listen 80;
    listen 443 ssl http2;
    server_name 98.95.235.51;

    # Certificado autofirmado temporal
    ssl_certificate /etc/nginx/ssl/nginx.crt;
    ssl_certificate_key /etc/nginx/ssl/nginx.key;
    
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_prefer_server_ciphers on;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512;

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
        
        # CORS headers
        add_header 'Access-Control-Allow-Origin' 'https://main.d2dxwi2afljxg5.amplifyapp.com' always;
        add_header 'Access-Control-Allow-Credentials' 'true' always;
        add_header 'Access-Control-Allow-Methods' 'GET, POST, PUT, DELETE, OPTIONS' always;
        add_header 'Access-Control-Allow-Headers' 'Authorization,Content-Type,Accept,Origin,User-Agent,DNT,Cache-Control,X-Mx-ReqToken,Keep-Alive,X-Requested-With,If-Modified-Since' always;
        
        if ($request_method = 'OPTIONS') {
            return 204;
        }
    }
}
```

## 3. Crear certificado SSL autofirmado
sudo mkdir -p /etc/nginx/ssl
sudo openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout /etc/nginx/ssl/nginx.key \
  -out /etc/nginx/ssl/nginx.crt \
  -subj "/C=AR/ST=BuenosAires/L=BuenosAires/O=ASGP/CN=98.95.235.51"

## 4. Habilitar sitio y reiniciar NGINX
sudo ln -sf /etc/nginx/sites-available/asgp-backend /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl restart nginx
sudo systemctl enable nginx

## 5. Verificar que funciona
curl -k https://localhost
pm2 list

## 6. Abrir puerto 443 en Security Group de AWS
# Ir a EC2 Console > Security Groups > Agregar regla:
# Type: HTTPS, Protocol: TCP, Port: 443, Source: 0.0.0.0/0
