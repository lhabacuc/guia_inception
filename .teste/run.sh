#!/bin/bash
set -e

DB_PASSWORD="$(cat /run/secrets/db_password)"
DB_ROOT_PASSWORD="$(cat /run/secrets/db_root_password)"

INITIALIZED=0
if [ ! -d "/var/lib/mysql/mysql" ]; then
    INITIALIZED=1
    mariadb-install-db --user=mysql --datadir=/var/lib/mysql >/dev/null
fi

chown -R mysql:mysql /var/lib/mysql
mkdir -p /run/mysqld
chown -R mysql:mysql /run/mysqld

mariadbd --user=mysql --skip-networking --socket=/tmp/mysql.sock &
PID="$!"

if [ "$INITIALIZED" -eq 1 ]; then
    PING_CMD=(mariadb-admin --socket=/tmp/mysql.sock -uroot)
else
    PING_CMD=(mariadb-admin --socket=/tmp/mysql.sock -uroot -p"${DB_ROOT_PASSWORD}")
fi

for i in $(seq 1 30); do
    if "${PING_CMD[@]}" ping >/dev/null 2>&1; then
        break
    fi
    sleep 1
done

if [ "$INITIALIZED" -eq 1 ]; then
    mariadb --socket=/tmp/mysql.sock -uroot <<SQL
CREATE DATABASE IF NOT EXISTS \`${MYSQL_DATABASE}\`;
CREATE USER IF NOT EXISTS '${MYSQL_USER}'@'%' IDENTIFIED BY '${DB_PASSWORD}';
ALTER USER 'root'@'localhost' IDENTIFIED BY '${DB_ROOT_PASSWORD}';
GRANT ALL PRIVILEGES ON \`${MYSQL_DATABASE}\`.* TO '${MYSQL_USER}'@'%';
FLUSH PRIVILEGES;
SQL
else
    mariadb --socket=/tmp/mysql.sock -uroot -p"${DB_ROOT_PASSWORD}" <<SQL
CREATE DATABASE IF NOT EXISTS \`${MYSQL_DATABASE}\`;
CREATE USER IF NOT EXISTS '${MYSQL_USER}'@'%' IDENTIFIED BY '${DB_PASSWORD}';
GRANT ALL PRIVILEGES ON \`${MYSQL_DATABASE}\`.* TO '${MYSQL_USER}'@'%';
FLUSH PRIVILEGES;
SQL
fi

mariadb-admin --socket=/tmp/mysql.sock -uroot -p"${DB_ROOT_PASSWORD}" shutdown
wait "$PID" || true

exec mariadbd --user=mysql --bind-address=0.0.0.0
