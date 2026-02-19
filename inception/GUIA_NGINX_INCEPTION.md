# GUIA_NGINX_INCEPTION.md

Guia completo para colocar o serviço **Nginx** no ar no projeto Inception.

Objetivo: Nginx ser o único ponto de entrada da infraestrutura na porta `443`, usando `TLSv1.2` e `TLSv1.3`, e encaminhar PHP para o serviço `wordpress:9000`.

## 1) Pré-requisitos

Antes de configurar Nginx, confirme:
- Docker e Docker Compose funcionando.
- Serviço `wordpress` escutando em `9000` dentro da rede Docker.
- Domínio local configurado no hosts:

```text
127.0.0.1 <login>.42.fr
```

## 2) Estrutura necessária

Arquivos do Nginx:

```text
srcs/requirements/nginx/
├── Dockerfile
├── conf/
│   └── nginx.conf.template
└── tools/
    └── run.sh
```

## 3) Dockerfile do Nginx

Arquivo: `srcs/requirements/nginx/Dockerfile`

```dockerfile
FROM debian:bookworm

RUN apt-get update && apt-get install -y nginx openssl gettext-base \
    && rm -rf /var/lib/apt/lists/*

COPY conf/nginx.conf.template /etc/nginx/templates/nginx.conf.template
COPY tools/run.sh /usr/local/bin/run.sh
RUN chmod +x /usr/local/bin/run.sh

EXPOSE 443

ENTRYPOINT ["/usr/local/bin/run.sh"]
```

O que cada parte faz:
- `FROM debian:bookworm`: base estável sem usar `latest`.
- `nginx`: servidor web.
- `openssl`: gera certificado local self-signed.
- `gettext-base`: fornece `envsubst` para trocar `${DOMAIN_NAME}` no template.
- `COPY ... template`: usa config dinâmica por variável de ambiente.
- `COPY ... run.sh`: script de inicialização do Nginx.
- `chmod +x`: permite executar script.
- `EXPOSE 443`: documenta porta HTTPS do container.
- `ENTRYPOINT`: sempre inicia via script.

## 4) Configuração Nginx (template)

Arquivo: `srcs/requirements/nginx/conf/nginx.conf.template`

```nginx
server {
    listen 443 ssl;
    listen [::]:443 ssl;

    server_name ${DOMAIN_NAME};

    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_certificate /etc/nginx/ssl/${DOMAIN_NAME}.crt;
    ssl_certificate_key /etc/nginx/ssl/${DOMAIN_NAME}.key;

    root /var/www/html;
    index index.php index.html;

    location / {
        try_files $uri $uri/ /index.php?$args;
    }

    location ~ \.php$ {
        include fastcgi_params;
        fastcgi_pass wordpress:9000;
        fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
    }
}
```

Explicação rápida:
- `listen 443 ssl`: Nginx só em HTTPS.
- `server_name ${DOMAIN_NAME}`: usa domínio do `.env`.
- `ssl_protocols TLSv1.2 TLSv1.3`: atende requisito do projeto.
- `ssl_certificate/...key`: paths do certificado gerado no startup.
- `root /var/www/html`: arquivos do WordPress.
- `location /`: roteamento padrão do WP.
- `location ~ \.php$`: envia PHP para `wordpress:9000` (php-fpm).

## 5) Script de inicialização

Arquivo: `srcs/requirements/nginx/tools/run.sh`

```bash
#!/bin/bash
set -e

mkdir -p /etc/nginx/ssl

if [ ! -f "/etc/nginx/ssl/${DOMAIN_NAME}.crt" ]; then
    openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
        -keyout "/etc/nginx/ssl/${DOMAIN_NAME}.key" \
        -out "/etc/nginx/ssl/${DOMAIN_NAME}.crt" \
        -subj "/C=BR/ST=SP/L=SP/O=42/CN=${DOMAIN_NAME}"
fi

envsubst '${DOMAIN_NAME}' < /etc/nginx/templates/nginx.conf.template > /etc/nginx/conf.d/default.conf

exec nginx -g 'daemon off;'
```

O que acontece aqui:
- cria pasta de certificados;
- gera cert/key self-signed se ainda não existir;
- renderiza template com `DOMAIN_NAME`;
- inicia Nginx em foreground (sem `tail -f`, sem loop infinito fake).

Permissão do script:

```bash
chmod +x srcs/requirements/nginx/tools/run.sh
```

## 6) Trecho do docker-compose para Nginx

Arquivo: `srcs/docker-compose.yml` (trecho)

```yaml
nginx:
  build: ./requirements/nginx
  image: nginx
  container_name: nginx
  restart: unless-stopped
  depends_on:
    - wordpress
  ports:
    - "443:443"
  volumes:
    - wordpress_data:/var/www/html:ro
  networks:
    - inception
  env_file: .env
```

Pontos importantes:
- só porta `443` publicada;
- depende do `wordpress`;
- monta arquivos WP em leitura no Nginx;
- usa `.env` para `DOMAIN_NAME`.

## 7) Comandos para subir Nginx

Build e subir stack:

```bash
docker compose -f srcs/docker-compose.yml up -d --build
```

Ver status:

```bash
docker ps
```

Ver logs do Nginx:

```bash
docker logs nginx --tail 100
```

Testar HTTPS:

```bash
curl -k https://<login>.42.fr
```

Validar TLS 1.2 e 1.3:

```bash
openssl s_client -connect <login>.42.fr:443 -tls1_2 </dev/null
openssl s_client -connect <login>.42.fr:443 -tls1_3 </dev/null
```

## 8) Checklist de pronto (Nginx)

- Nginx sobe sem restart loop.
- `docker ps` mostra só `443` publicado para o serviço Nginx.
- `https://<login>.42.fr` responde.
- `ssl_protocols` está limitado a `TLSv1.2 TLSv1.3`.
- `fastcgi_pass wordpress:9000` funciona (sem 502).

## 9) Erros comuns e correções

## 9.1 502 Bad Gateway
- Causa comum: WordPress/php-fpm não está acessível em `9000`.
- Verificar:
```bash
docker logs wordpress --tail 100
docker exec -it wordpress ss -lntp | grep 9000
```
- Correção: ajustar `www.conf` para `listen = 0.0.0.0:9000`.

## 9.2 Certificado não encontrado
- Causa: `run.sh` não executou ou path errado.
- Verificar:
```bash
docker exec -it nginx ls -la /etc/nginx/ssl
```
- Correção: revisar geração via `openssl` no script.

## 9.3 Domínio não resolve
- Causa: `/etc/hosts` sem entrada.
- Correção: adicionar `127.0.0.1 <login>.42.fr`.

## 9.4 Porta 80 aberta (reprova requisito)
- Causa: publish extra no compose.
- Correção: manter apenas `443:443`.

## 10) Fluxo rápido (resumo)

1. Criar `Dockerfile`, `nginx.conf.template` e `run.sh`.
2. Dar `chmod +x` no script.
3. Garantir `DOMAIN_NAME` no `.env`.
4. Declarar Nginx no compose com porta `443`.
5. Subir com `docker compose up -d --build`.
6. Testar com `curl -k` e `openssl s_client`.

Com isso, o Nginx fica no ar de forma compatível com o mandatory do Inception.
