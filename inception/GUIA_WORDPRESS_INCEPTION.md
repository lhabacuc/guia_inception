# GUIA_WORDPRESS_INCEPTION.md

Guia completo para colocar o serviço **WordPress** no ar no projeto Inception.

Objetivo: subir um container `wordpress` com `php-fpm` (sem nginx dentro dele), conectar ao MariaDB, instalar o WordPress automaticamente e criar os usuários iniciais.

## 1) Pré-requisitos

Antes de subir WordPress:
- Docker e Docker Compose funcionando.
- Serviço `mariadb` criado no `docker-compose`.
- Arquivo `srcs/.env` configurado.
- Secret de senha do banco criado em `secrets/db_password.txt`.

## 2) Variáveis necessárias no `.env`

Arquivo: `srcs/.env`

```env
MYSQL_DATABASE=wordpress
MYSQL_USER=wpuser
DB_HOST=mariadb
DOMAIN_NAME=<login>.42.fr

WP_TITLE=Inception
WP_ADMIN_USER=supervisor42
WP_ADMIN_EMAIL=you@example.com
WP_ADMIN_PASSWORD=StrongAdminPass123!
WP_EDITOR_USER=editor42
WP_EDITOR_EMAIL=editor@example.com
WP_EDITOR_PASSWORD=StrongEditorPass123!
```

O que cada bloco faz:
- `MYSQL_*` e `DB_HOST`: dados de conexão com MariaDB.
- `DOMAIN_NAME`: URL do site.
- `WP_*`: dados de instalação inicial do WordPress.

Observação importante:
- Evite usar `admin` ou `administrator` no nome do admin.

## 3) Secret necessário

Criar senha do usuário do banco:

```bash
printf 'StrongDbUserPass123!\n' > secrets/db_password.txt
chmod 600 secrets/db_password.txt
```

## 4) Estrutura do serviço WordPress

```text
srcs/requirements/wordpress/
├── Dockerfile
├── conf/
│   └── www.conf
└── tools/
    └── run.sh
```

## 5) Dockerfile do WordPress

Arquivo: `srcs/requirements/wordpress/Dockerfile`

```dockerfile
FROM debian:bookworm

RUN apt-get update && apt-get install -y \
    php8.2-fpm php8.2-mysql php8.2-curl php8.2-gd php8.2-mbstring php8.2-xml php8.2-zip \
    mariadb-client curl ca-certificates \
    && rm -rf /var/lib/apt/lists/*

RUN curl -fsSL https://raw.githubusercontent.com/wp-cli/builds/gh-pages/phar/wp-cli.phar -o /usr/local/bin/wp \
    && chmod +x /usr/local/bin/wp

COPY conf/www.conf /etc/php/8.2/fpm/pool.d/www.conf
COPY tools/run.sh /usr/local/bin/run.sh
RUN chmod +x /usr/local/bin/run.sh

WORKDIR /var/www/html

EXPOSE 9000

CMD ["/usr/local/bin/run.sh"]
```

Explicação resumida:
- instala `php-fpm` + extensões necessárias do WP;
- instala `mariadb-client` para teste de conexão;
- instala `wp-cli` para automação;
- configura pool do php-fpm;
- inicia pelo script `run.sh`.

## 6) Configuração do php-fpm

Arquivo: `srcs/requirements/wordpress/conf/www.conf`

```ini
[www]
user = www-data
group = www-data
listen = 0.0.0.0:9000
pm = dynamic
pm.max_children = 5
pm.start_servers = 2
pm.min_spare_servers = 1
pm.max_spare_servers = 3
clear_env = no
```

Ponto crítico:
- `listen = 0.0.0.0:9000` permite o Nginx (outro container) acessar o php-fpm.

## 7) Script de inicialização do WordPress

Arquivo: `srcs/requirements/wordpress/tools/run.sh`

```bash
#!/bin/bash
set -e

DB_PASSWORD="$(cat /run/secrets/db_password)"

for i in $(seq 1 60); do
    if mariadb-admin ping -h"${DB_HOST}" -u"${MYSQL_USER}" -p"${DB_PASSWORD}" --silent; then
        break
    fi
    sleep 1
done

cd /var/www/html

if [ ! -f wp-config.php ]; then
    wp core download --allow-root

    wp config create \
        --dbname="${MYSQL_DATABASE}" \
        --dbuser="${MYSQL_USER}" \
        --dbpass="${DB_PASSWORD}" \
        --dbhost="${DB_HOST}" \
        --allow-root

    wp core install \
        --url="https://${DOMAIN_NAME}" \
        --title="${WP_TITLE}" \
        --admin_user="${WP_ADMIN_USER}" \
        --admin_password="${WP_ADMIN_PASSWORD}" \
        --admin_email="${WP_ADMIN_EMAIL}" \
        --allow-root

    wp user create "${WP_EDITOR_USER}" "${WP_EDITOR_EMAIL}" \
        --role=editor \
        --user_pass="${WP_EDITOR_PASSWORD}" \
        --allow-root
fi

exec php-fpm8.2 -F
```

O que esse script faz:
- lê senha via Docker secret;
- espera o MariaDB ficar pronto;
- baixa WordPress se for primeira execução;
- cria `wp-config.php` com variáveis do ambiente;
- instala o site;
- cria segundo usuário (editor);
- sobe `php-fpm` em foreground.

Permissão:

```bash
chmod +x srcs/requirements/wordpress/tools/run.sh
```

## 8) Trecho do docker-compose para WordPress

Arquivo: `srcs/docker-compose.yml` (trecho)

```yaml
wordpress:
  build: ./requirements/wordpress
  image: wordpress
  container_name: wordpress
  restart: unless-stopped
  env_file: .env
  depends_on:
    - mariadb
  volumes:
    - wordpress_data:/var/www/html
  networks:
    - inception
  secrets:
    - db_password
```

O que é essencial aqui:
- `depends_on`: sobe depois do serviço de DB (ainda assim mantém wait loop no script);
- `volumes`: persiste arquivos do site;
- `secrets`: injeta senha do DB no container;
- não expor porta para o host (Nginx será o único entrypoint).

## 9) Subir e testar

Build + subida:

```bash
docker compose -f srcs/docker-compose.yml up -d --build
```

Ver status:

```bash
docker ps
```

Logs do WordPress:

```bash
docker logs wordpress --tail 100
```

Teste interno do php-fpm:

```bash
docker exec -it wordpress ss -lntp | grep 9000
```

Teste de acesso final (via Nginx):

```bash
curl -k https://<login>.42.fr
```

## 10) Checklist de pronto (WordPress)

- Container `wordpress` está `Up` sem loop de restart.
- `php-fpm` escutando em `0.0.0.0:9000`.
- `wp-config.php` criado no volume.
- Instalação inicial do WP concluída.
- Usuário admin + usuário editor criados.
- Sem Nginx dentro do container WordPress.

## 11) Erros comuns e correções

## 11.1 `Error establishing a database connection`
- Causa provável: `DB_HOST`, user ou senha incorretos.
- Verificar:
```bash
docker logs wordpress --tail 100
docker exec -it wordpress env | grep -E 'DB_HOST|MYSQL_DATABASE|MYSQL_USER'
```
- Correção: alinhar `.env` + secret com usuário criado no MariaDB.

## 11.2 `wp: command not found`
- Causa: WP-CLI não instalado corretamente.
- Verificar:
```bash
docker exec -it wordpress which wp
```
- Correção: revisar etapa de instalação no Dockerfile.

## 11.3 `php-fpm` não escuta na porta 9000
- Causa: `www.conf` com `listen` errado (ex.: `127.0.0.1`).
- Correção: usar `listen = 0.0.0.0:9000`.

## 11.4 WordPress reinstala a cada restart
- Causa: volume do `/var/www/html` não persistindo.
- Verificar:
```bash
docker volume ls
ls -la /home/<login>/data/wordpress
```
- Correção: ajustar volume no compose para caminho persistente correto.

## 11.5 Permissão negada em `/var/www/html`
- Causa: owner/permissão incorreta no volume.
- Correção: ajustar permissões da pasta no host e ownership no container, se necessário.

## 12) Fluxo rápido (resumo)

1. Preparar `.env` e secret `db_password`.
2. Criar `Dockerfile`, `www.conf` e `run.sh` do WordPress.
3. Dar `chmod +x` no `run.sh`.
4. Declarar serviço no Compose com volume + network + secret.
5. Subir com `docker compose up -d --build`.
6. Validar logs e porta `9000`.
7. Testar acesso final via `https://<login>.42.fr`.

Com isso, o WordPress fica no ar de forma compatível com o mandatory do Inception.
