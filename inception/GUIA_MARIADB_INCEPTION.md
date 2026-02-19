# GUIA_MARIADB_INCEPTION.md

Guia completo para colocar o serviço **MariaDB** no ar no projeto Inception.

Objetivo: subir o container `mariadb`, inicializar banco/usuário do WordPress com secrets, persistir dados em `/home/<login>/data/mariadb` e deixar o DB acessível pela rede Docker para o serviço `wordpress`.

## 1) Pré-requisitos

Antes de começar:
- Docker e Docker Compose instalados.
- Projeto com estrutura `srcs/`.
- Pasta de persistência criada no host.

Comandos:

```bash
mkdir -p /home/<login>/data/mariadb
mkdir -p srcs/requirements/mariadb/{conf,tools}
mkdir -p secrets
```

O que isso faz:
- cria pasta persistente no caminho exigido pelo enunciado;
- cria estrutura do serviço MariaDB;
- cria pasta para secrets.

## 2) Variáveis e secrets

## 2.1 Variáveis no `.env`

Arquivo: `srcs/.env`

```env
MYSQL_DATABASE=wordpress
MYSQL_USER=wpuser
```

Explicação:
- `MYSQL_DATABASE`: banco que será usado pelo WordPress.
- `MYSQL_USER`: usuário da aplicação (não root).

## 2.2 Secrets

Comandos:

```bash
printf 'StrongDbUserPass123!\n' > secrets/db_password.txt
printf 'StrongDbRootPass123!\n' > secrets/db_root_password.txt
chmod 600 secrets/db_password.txt secrets/db_root_password.txt
```

Explicação:
- cria senha do usuário de app e senha root;
- protege os arquivos com permissão restrita.

## 3) Arquivos do serviço MariaDB

Estrutura final:

```text
srcs/requirements/mariadb/
├── Dockerfile
├── conf/
│   └── 50-server.cnf
└── tools/
    └── run.sh
```

## 4) Dockerfile completo (com explicação)

Arquivo: `srcs/requirements/mariadb/Dockerfile`

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

Linha a linha:
- `FROM debian:bookworm`: base Debian estável sem `latest`.
- `RUN apt-get update ...`: instala servidor e cliente MariaDB.
- `rm -rf /var/lib/apt/lists/*`: reduz tamanho final da imagem.
- `COPY conf/50-server.cnf ...`: aplica config de rede do DB.
- `COPY tools/run.sh ...`: copia script de inicialização.
- `RUN chmod +x ...`: deixa script executável.
- `EXPOSE 3306`: documenta porta interna do serviço DB.
- `CMD [...]`: inicia container via script.

## 5) Configuração MariaDB completa

Arquivo: `srcs/requirements/mariadb/conf/50-server.cnf`

```cnf
[mysqld]
bind-address=0.0.0.0
```

Linha a linha:
- `[mysqld]`: seção do daemon MariaDB.
- `bind-address=0.0.0.0`: aceita conexão de outros containers na mesma rede Docker.

## 6) Script de inicialização completo

Arquivo: `srcs/requirements/mariadb/tools/run.sh`

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

Linha a linha:
- `#!/bin/bash`: shell do script.
- `set -e`: interrompe ao primeiro erro.
- `DB_PASSWORD=...`: lê senha do usuário app do secret.
- `DB_ROOT_PASSWORD=...`: lê senha root do secret.
- `if [ ! -d ... ]`: detecta primeira inicialização do datadir.
- `mariadb-install-db ...`: inicializa estrutura interna do banco.
- `fi`: fim da condicional.
- `chown -R ...`: garante permissões corretas no datadir.
- `mariadbd ... --skip-networking --socket ... &`: sobe instância temporária local.
- `PID="$!"`: guarda PID da instância temporária.
- `for i in ...`: loop de espera do serviço ficar pronto.
- `mariadb-admin ... ping`: health check local por socket.
- `break`: sai do loop quando DB está pronto.
- `sleep 1`: aguarda 1s entre tentativas.
- `done`: fim do loop.
- `mariadb ... <<SQL`: executa SQL de bootstrap.
- `CREATE DATABASE ...`: cria banco da aplicação.
- `CREATE USER ...`: cria usuário da aplicação com senha do secret.
- `ALTER USER root...`: define senha root.
- `GRANT ...`: dá privilégios no banco do WP para usuário app.
- `FLUSH PRIVILEGES`: aplica privilégios.
- `SQL`: fim do bloco SQL.
- `mariadb-admin ... shutdown`: encerra instância temporária.
- `wait "$PID" || true`: aguarda processo terminar.
- `exec mariadbd ...`: sobe MariaDB final em foreground como PID 1.

Permissão do script:

```bash
chmod +x srcs/requirements/mariadb/tools/run.sh
```

## 7) Trecho do docker-compose.yml (MariaDB)

Arquivo: `srcs/docker-compose.yml` (trechos)

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
- `build`: constrói imagem local do MariaDB.
- `image`: nome da imagem final.
- `container_name`: nome fixo do container.
- `restart`: sobe novamente em crash.
- `env_file`: injeta variáveis do `.env`.
- `volumes`: persiste datadir do banco.
- `networks`: conecta na rede interna.
- `secrets`: disponibiliza senhas em `/run/secrets`.

Trecho do volume com caminho exigido:

```yaml
volumes:
  mariadb_data:
    driver: local
    driver_opts:
      type: none
      o: bind
      device: /home/<login>/data/mariadb
```

Explicação:
- garante persistência exatamente no caminho pedido pelo projeto.

Trecho dos secrets:

```yaml
secrets:
  db_password:
    file: ../secrets/db_password.txt
  db_root_password:
    file: ../secrets/db_root_password.txt
```

Explicação:
- referencia os arquivos de senha no host para montar no container.

## 8) Como subir e validar MariaDB

Subir stack:

```bash
docker compose -f srcs/docker-compose.yml up -d --build
```

Ver container:

```bash
docker ps
```

Ver logs do MariaDB:

```bash
docker logs mariadb --tail 100
```

Testar conexão dentro do container:

```bash
docker exec -it mariadb mariadb -uroot -p"$(cat secrets/db_root_password.txt)" -e "SHOW DATABASES;"
```

Conferir se banco/usuário existem:

```bash
docker exec -it mariadb mariadb -uroot -p"$(cat secrets/db_root_password.txt)" -e "SELECT user,host FROM mysql.user;"
```

Validar persistência:

```bash
docker compose -f srcs/docker-compose.yml down
docker compose -f srcs/docker-compose.yml up -d
ls -la /home/<login>/data/mariadb
```

## 9) Checklist de pronto (MariaDB)

- `mariadb` está `Up` sem restart loop.
- Banco `wordpress` criado.
- Usuário `MYSQL_USER` criado com privilégios no banco.
- Root com senha definida via secret.
- Dados persistindo em `/home/<login>/data/mariadb`.
- Sem porta 3306 exposta publicamente no host.

## 10) Erros comuns e correção

## 10.1 `Access denied for user`
- Causa: senha do secret não bate com usuário criado.
- Diagnóstico:
```bash
docker logs mariadb --tail 100
```
- Correção: alinhar `db_password.txt` + recriar usuário/grants.

## 10.2 MariaDB reiniciando em loop
- Causa: erro no `run.sh` ou config inválida.
- Diagnóstico:
```bash
docker logs mariadb --tail 200
```
- Correção: revisar `50-server.cnf`, SQL bootstrap e permissões de volume.

## 10.3 `No such file /run/secrets/...`
- Causa: secrets não declarados no compose.
- Correção: adicionar secrets no serviço e no bloco global `secrets:`.

## 10.4 `Permission denied` em `/var/lib/mysql`
- Causa: problema de owner/permissão na pasta persistente.
- Correção: ajustar permissões no host e manter `chown` no startup.

## 10.5 DB não persiste após reinício
- Causa: volume incorreto.
- Correção: conferir `device: /home/<login>/data/mariadb` no compose.

## 11) Fluxo rápido de execução

1. Criar pasta persistente e estrutura do serviço.
2. Criar `.env` com `MYSQL_DATABASE` e `MYSQL_USER`.
3. Criar secrets `db_password` e `db_root_password`.
4. Criar `Dockerfile`, `50-server.cnf`, `run.sh`.
5. Declarar serviço no `docker-compose.yml` com volume/network/secrets.
6. Subir com `docker compose up -d --build`.
7. Validar logs, banco, usuários e persistência.

Com isso o MariaDB fica no ar de forma correta para integrar com WordPress no Inception.
