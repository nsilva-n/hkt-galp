FROM nginx:latest

RUN apt-get update && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

RUN mkdir -p /etc/nginx/certs

RUN openssl req -x509 -nodes -days 365 \
    -newkey rsa:2048 \
    -keyout /etc/nginx/certs/dev.key \
    -out /etc/nginx/certs/dev.crt \
    -subj "/C=US/ST=Dev/L=Dev/O=Dev/CN=localhost"

COPY dev-https.conf /etc/nginx/conf.d/default.conf
