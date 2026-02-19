# Inception em 3 dias (guia didático e direto)

Este guia foi reorganizado para:
1. Explicar claramente o que fazer em cada dia.
2. Mostrar **código completo apenas do MariaDB**.
3. Para WordPress, Nginx, Compose e Makefile: mostrar **só trechos essenciais** e explicar o que cada linha faz.

## Dia 1: colocar MariaDB no ar (base sólida)

## 1) Estrutura mínima

Crie:

```bash
mkdir -p srcs/requirements/mariadb/{conf,tools}
mkdir -p srcs/requirements/wordpress/{conf,tools}
mkdir -p srcs/requirements/nginx/{conf,tools}
mkdir -p secrets
mkdir -p /home/<login>/data/{mariadb,wordpress}
```

Explicação:
- `srcs/requirements/...`: onde ficam Dockerfiles, configs e scripts dos serviços.
- `secrets`: senhas fora de Dockerfile e fora de `.env`.
- `/home/<login>/data/...`: persistência exigida pelo projeto.

## 2) Domínio local

No `/etc/hosts` da VM:

```text
127.0.0.1 <login>.42.fr
```

Explicação:
- Faz `<login>.42.fr` apontar para sua máquina local.
- Na defesa, o avaliador vai testar esse domínio.

## 3) `.env` (base para todos os serviços)

`srcs/.env`:

```env
DOMAIN_NAME=<login>.42.fr
MYSQL_DATABASE=wordpress
MYSQL_USER=wpuser
DB_HOST=mariadb

WP_TITLE=Inception
WP_ADMIN_USER=supervisor42
WP_ADMIN_EMAIL=you@example.com
WP_ADMIN_PASSWORD=StrongAdminPass123!
WP_EDITOR_USER=editor42
WP_EDITOR_EMAIL=editor@example.com
WP_EDITOR_PASSWORD=StrongEditorPass123!
```

Explicação linha a linha:
- `DOMAIN_NAME`: domínio que Nginx vai servir em HTTPS.
- `MYSQL_DATABASE`: nome do banco que o WordPress vai usar.
- `MYSQL_USER`: usuário de aplicação (não root).
- `DB_HOST`: hostname do serviço MariaDB dentro da rede Docker.
- `WP_TITLE`: título inicial do site.
- `WP_ADMIN_USER`: usuário admin (evite conter `admin`).
- `WP_ADMIN_EMAIL`: email do admin.
- `WP_ADMIN_PASSWORD`: senha do admin.
- `WP_EDITOR_USER`: segundo usuário obrigatório.
- `WP_EDITOR_EMAIL`: email do editor.
- `WP_EDITOR_PASSWORD`: senha do editor.

## 4) Secrets

```bash
printf 'StrongDbUserPass123!\n' > secrets/db_password.txt
printf 'StrongDbRootPass123!\n' > secrets/db_root_password.txt
chmod 600 secrets/*.txt
```

Explicação linha a linha:
- primeira linha: cria senha do usuário de aplicação do banco.
- segunda linha: cria senha do root do banco.
- terceira linha: restringe permissão (somente dono lê/escreve).

## 5) MariaDB (código completo)

### 5.1 `srcs/requirements/mariadb/Dockerfile` (completo)

```dockerfile
FROM debian:bookworm

RUN apt-get update && apt-get install -y mariadb-server mariadb-client \
    && rm -rf /var/lib/apt/lists/*

COPY conf/50-server.cnf /etc/mysql/mariadb.conf.d/50-server.cnf
COPY tools/run.sh /usr/local/bin/run.sh
RUN chmod +x /usr/local/bin/run.sh

EXPOSE 3306

CMD ["/usr/local/bin/run.sh"]
```

Explicação linha a linha:
- `FROM debian:bookworm`: define base Debian estável (sem `latest`).
- `RUN apt-get update ...`: atualiza índice e instala servidor/cliente MariaDB.
- `rm -rf /var/lib/apt/lists/*`: limpa cache do apt e reduz tamanho da imagem.
- `COPY conf/50-server.cnf ...`: copia configuração do MariaDB.
- `COPY tools/run.sh ...`: copia script de inicialização.
- `RUN chmod +x ...`: garante permissão de execução do script.
- `EXPOSE 3306`: documenta porta interna do serviço DB.
- `CMD [...]`: inicia container executando script principal.

### 5.2 `srcs/requirements/mariadb/conf/50-server.cnf` (completo)

```cnf
[mysqld]
bind-address=0.0.0.0
```

Explicação linha a linha:
- `[mysqld]`: seção de configuração do daemon MariaDB.
- `bind-address=0.0.0.0`: aceita conexão de outros containers na rede Docker.

### 5.3 `srcs/requirements/mariadb/tools/run.sh` (completo)

```bash
#!/bin/bash
set -e

DB_PASSWORD="$(cat /run/secrets/db_password)"
DB_ROOT_PASSWORD="$(cat /run/secrets/db_root_password)"

if [ ! -d "/var/lib/mysql/mysql" ]; then
    mariadb-install-db --user=mysql --datadir=/var/lib/mysql >/dev/null
fi

chown -R mysql:mysql /var/lib/mysql

mariadbd --user=mysql --skip-networking --socket=/tmp/mysql.sock &
PID="$!"

for i in $(seq 1 30); do
    if mariadb-admin --socket=/tmp/mysql.sock ping >/dev/null 2>&1; then
        break
    fi
    sleep 1
done

mariadb --socket=/tmp/mysql.sock <<SQL
CREATE DATABASE IF NOT EXISTS \`${MYSQL_DATABASE}\`;
CREATE USER IF NOT EXISTS '${MYSQL_USER}'@'%' IDENTIFIED BY '${DB_PASSWORD}';
ALTER USER 'root'@'localhost' IDENTIFIED BY '${DB_ROOT_PASSWORD}';
GRANT ALL PRIVILEGES ON \`${MYSQL_DATABASE}\`.* TO '${MYSQL_USER}'@'%';
FLUSH PRIVILEGES;
SQL

mariadb-admin --socket=/tmp/mysql.sock -uroot -p"${DB_ROOT_PASSWORD}" shutdown
wait "$PID" || true

exec mariadbd --user=mysql --bind-address=0.0.0.0
```

Explicação linha a linha:
- `#!/bin/bash`: interpretador do script.
- `set -e`: script para no primeiro erro.
- `DB_PASSWORD=...`: lê senha do usuário no secret Docker.
- `DB_ROOT_PASSWORD=...`: lê senha root no secret Docker.
- `if [ ! -d ... ]`: verifica se banco ainda não foi inicializado.
- `mariadb-install-db ...`: inicializa datadir na primeira execução.
- `fi`: fim do bloco condicional.
- `chown -R ...`: garante dono correto dos arquivos do banco.
- `mariadbd ... --skip-networking ... &`: sobe MariaDB temporário por socket local.
- `PID="$!"`: guarda PID do processo temporário.
- `for i in ...`: espera banco ficar pronto.
- `mariadb-admin ... ping`: testa saúde do servidor local.
- `break`: sai do loop quando estiver pronto.
- `sleep 1`: espera 1s entre tentativas.
- `done`: fim do loop.
- `mariadb --socket ... <<SQL`: executa bloco SQL de bootstrap.
- `CREATE DATABASE ...`: cria banco WordPress.
- `CREATE USER ...`: cria usuário de aplicação.
- `ALTER USER root...`: define senha root.
- `GRANT ALL PRIVILEGES ...`: permissões no banco do WP.
- `FLUSH PRIVILEGES;`: aplica tabela de privilégios.
- `SQL`: fim do heredoc SQL.
- `mariadb-admin ... shutdown`: desliga instância temporária.
- `wait "$PID" || true`: espera processo terminar sem quebrar em erro já esperado.
- `exec mariadbd ...`: sobe instância final em foreground (PID 1 correto).

### 5.4 Teste do fim do Dia 1

```bash
chmod +x srcs/requirements/mariadb/tools/run.sh
```

Depois suba stack e verifique logs (Compose e Makefile vêm no Dia 2, em trechos):

```bash
docker compose -f srcs/docker-compose.yml up -d --build
docker logs mariadb
```

Meta do Dia 1:
- Container `mariadb` estável.
- Dados criados em `/home/<login>/data/mariadb`.

## Dia 2: integrar WordPress + Nginx (somente trechos essenciais)

## 1) `docker-compose.yml` (trechos)

Trecho do serviço `mariadb`:

```yaml
mariadb:
  build: ./requirements/mariadb
  image: mariadb
  container_name: mariadb
  restart: unless-stopped
  env_file: .env
  volumes:
    - mariadb_data:/var/lib/mysql
  networks:
    - inception
  secrets:
    - db_password
    - db_root_password
```

O que cada linha faz:
- `build`: manda construir da pasta do serviço.
- `image`: nome da imagem gerada.
- `container_name`: nome fixo do container.
- `restart`: reinicia após crash.
- `env_file`: carrega variáveis do `.env`.
- `volumes`: persiste dados do banco.
- `networks`: conecta na rede interna.
- `secrets`: monta senhas em `/run/secrets/...`.

Trecho obrigatório de persistência em `/home/<login>/data`:

```yaml
volumes:
  mariadb_data:
    driver: local
    driver_opts:
      type: none
      o: bind
      device: /home/<login>/data/mariadb
```

O que faz:
- cria volume Docker usando bind no caminho exigido pelo enunciado.

## 2) WordPress (trechos)

Trecho do `Dockerfile`:

```dockerfile
RUN apt-get update && apt-get install -y \
    php8.2-fpm php8.2-mysql mariadb-client curl \
    && rm -rf /var/lib/apt/lists/*
```

Explicação:
- instala `php-fpm` (obrigatório) e extensão MySQL para WP.
- instala `mariadb-client` para checar conexão no script.

Trecho do `run.sh`:

```bash
DB_PASSWORD="$(cat /run/secrets/db_password)"

wp config create \
  --dbname="${MYSQL_DATABASE}" \
  --dbuser="${MYSQL_USER}" \
  --dbpass="${DB_PASSWORD}" \
  --dbhost="${DB_HOST}" \
  --allow-root
```

Explicação:
- lê senha do secret e gera `wp-config.php` sem hardcode de senha em Dockerfile.

Trecho que cria 2 usuários (admin + editor):

```bash
wp core install ... --admin_user="${WP_ADMIN_USER}" ...
wp user create "${WP_EDITOR_USER}" "${WP_EDITOR_EMAIL}" --role=editor ...
```

Explicação:
- atende regra de ter dois usuários no WordPress.

## 3) Nginx + TLS (trechos)

Trecho do `nginx.conf`:

```nginx
listen 443 ssl;
ssl_protocols TLSv1.2 TLSv1.3;
fastcgi_pass wordpress:9000;
```

Explicação:
- abre só `443` com SSL.
- limita TLS para 1.2 e 1.3.
- envia PHP para o serviço `wordpress` porta `9000`.

Trecho do `run.sh`:

```bash
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout "/etc/nginx/ssl/${DOMAIN_NAME}.key" \
  -out "/etc/nginx/ssl/${DOMAIN_NAME}.crt" \
  -subj "/C=BR/ST=SP/L=SP/O=42/CN=${DOMAIN_NAME}"

exec nginx -g 'daemon off;'
```

Explicação:
- gera certificado self-signed local para ambiente do projeto.
- sobe Nginx em foreground (sem gambiarra de loop).

## 4) Makefile (trechos)

```makefile
all:
	mkdir -p /home/<login>/data/mariadb /home/<login>/data/wordpress
	docker compose -f srcs/docker-compose.yml up -d --build

down:
	docker compose -f srcs/docker-compose.yml down
```

Explicação:
- `all`: cria diretórios persistentes e sobe tudo.
- `down`: derruba stack.

## 5) Teste do fim do Dia 2

```bash
make
docker ps
docker logs wordpress
docker logs nginx
curl -k https://<login>.42.fr
```

Meta do Dia 2:
- Site abre via HTTPS.
- Nginx chama WP corretamente.
- WP conecta no MariaDB.

## Dia 3: validação para defesa

## 1) Testes obrigatórios

Persistência:

```bash
make down
make
```

TLS:

```bash
openssl s_client -connect <login>.42.fr:443 -tls1_2 </dev/null
openssl s_client -connect <login>.42.fr:443 -tls1_3 </dev/null
```

Portas/publicação:

```bash
docker ps
```

Verifique:
- Apenas `nginx` publica `443`.
- `mariadb` e `wordpress` sem porta exposta ao host.

## 2) Checklist final

1. Sem `latest`.
2. Sem senha em Dockerfile.
3. Sem `network_mode: host` e sem `links`.
4. Sem comandos proibidos para manter container vivo.
5. Volume persistente em `/home/<login>/data/*`.
6. Domínio `<login>.42.fr` funcionando.
7. Admin user sem `admin` no nome.

## 3) Erros comuns

`502 Bad Gateway`:
- normalmente `php-fpm` não está escutando em `0.0.0.0:9000`.

WP sem conectar no DB:
- `DB_HOST` deve ser `mariadb`.
- secret de senha precisa bater com usuário criado no MariaDB.

Domínio não abre:
- revisar `/etc/hosts`.

---

Se quiser, no próximo passo eu também monto uma versão extra chamada `GUIA_INCEPTION_3_DIAS_RESUMO_EXECUTAVEL.md` com checklist de execução em ordem de comandos (estilo "copie e rode").
