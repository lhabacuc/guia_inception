# PRATICA_SQL_BASICA.md

Guia prático de SQL básico com MariaDB/MySQL.

Objetivo:
- entrar no banco local e remoto;
- entrar como root;
- listar databases;
- criar database;
- criar user;
- dar permissões;
- criar tabela;
- inserir e consultar dados;
- listar usuários.

## 1) Pré-requisitos

- Servidor MariaDB/MySQL instalado e rodando.
- Cliente `mariadb` ou `mysql` disponível.

Verificar cliente:

```bash
mariadb --version
# ou
mysql --version
```

---

## 2) Entrar no banco localmente

## 2.1 Entrar como root (local)

```bash
mariadb -u root -p
```

Sintaxe:
- `-u root`: usuário root.
- `-p`: pede senha no terminal.

Resultado esperado:
- prompt SQL: `MariaDB [(none)]>` ou `mysql>`.

## 2.2 Entrar como usuário comum (local)

```bash
mariadb -u appuser -p
```

---

## 3) Entrar no banco remotamente

## 3.1 Entrar como root remoto

```bash
mariadb -h 192.168.1.10 -P 3306 -u root -p
```

Sintaxe:
- `-h`: host remoto.
- `-P`: porta (normalmente 3306).
- `-u`: usuário.
- `-p`: senha.

## 3.2 Entrar como usuário comum remoto

```bash
mariadb -h db.exemplo.local -P 3306 -u appuser -p
```

Observação:
- acesso remoto depende de permissão do usuário (`'user'@'host'`) e bind/rede.

---

## 4) Comandos SQL básicos (dentro do prompt)

## 4.1 Listar databases

```sql
SHOW DATABASES;
```

## 4.2 Criar database

```sql
CREATE DATABASE aula_sql;
```

## 4.3 Selecionar database

```sql
USE aula_sql;
```

## 4.4 Ver database atual

```sql
SELECT DATABASE();
```

## 4.5 Listar tabelas da database atual

```sql
SHOW TABLES;
```

---

## 5) Criar tabela e manipular dados

## 5.1 Criar tabela `usuarios`

```sql
CREATE TABLE usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 5.2 Descrever tabela

```sql
DESCRIBE usuarios;
```

## 5.3 Inserir dados

```sql
INSERT INTO usuarios (nome, email)
VALUES
  ('Ana Silva', 'ana@example.com'),
  ('Bruno Lima', 'bruno@example.com');
```

## 5.4 Consultar dados

```sql
SELECT * FROM usuarios;
```

## 5.5 Filtrar dados

```sql
SELECT id, nome FROM usuarios WHERE nome LIKE 'A%';
```

## 5.6 Atualizar dado

```sql
UPDATE usuarios
SET nome = 'Ana Souza'
WHERE email = 'ana@example.com';
```

## 5.7 Apagar dado

```sql
DELETE FROM usuarios
WHERE email = 'bruno@example.com';
```

---

## 6) Usuários e permissões

## 6.1 Criar usuário local (somente localhost)

```sql
CREATE USER 'appuser'@'localhost' IDENTIFIED BY 'SenhaForte123!';
```

## 6.2 Criar usuário remoto (qualquer host)

```sql
CREATE USER 'appremote'@'%' IDENTIFIED BY 'SenhaForte456!';
```

## 6.3 Dar permissão em uma database

```sql
GRANT ALL PRIVILEGES ON aula_sql.* TO 'appuser'@'localhost';
GRANT ALL PRIVILEGES ON aula_sql.* TO 'appremote'@'%';
FLUSH PRIVILEGES;
```

## 6.4 Listar usuários

```sql
SELECT user, host FROM mysql.user ORDER BY user, host;
```

## 6.5 Ver grants de um usuário

```sql
SHOW GRANTS FOR 'appuser'@'localhost';
```

## 6.6 Revogar permissão

```sql
REVOKE INSERT, UPDATE, DELETE ON aula_sql.* FROM 'appuser'@'localhost';
FLUSH PRIVILEGES;
```

## 6.7 Remover usuário

```sql
DROP USER 'appremote'@'%';
```

---

## 7) Entrar como root no Docker (opcional)

Se o banco estiver em container:

```bash
docker exec -it mariadb mariadb -u root -p
```

Ou passando senha inline (menos seguro no histórico):

```bash
docker exec -it mariadb mariadb -u root -p'SuaSenha'
```

---

## 8) Sair do cliente SQL

```sql
EXIT;
```

---

## 9) Exercício guiado completo

1. Entrar como root local.
2. Rodar `SHOW DATABASES;`.
3. Criar DB `aula_sql`.
4. `USE aula_sql;`.
5. Criar tabela `usuarios`.
6. Inserir 2 registros.
7. Rodar `SELECT * FROM usuarios;`.
8. Criar usuário `appuser@localhost`.
9. Dar GRANT nessa DB.
10. Sair e entrar com `appuser`.
11. Confirmar acesso com `SELECT * FROM usuarios;`.

Se todos passos funcionarem, sua prática SQL básica está correta.

---

## 10) Erros comuns

`ERROR 1045 (28000): Access denied`
- usuário/senha errados ou sem permissão para host.

`ERROR 1049 (42000): Unknown database`
- database ainda não criada ou nome digitado errado.

`ERROR 1146 (42S02): Table doesn't exist`
- tabela não criada na database atual.

`Can't connect to MySQL server`
- serviço parado, host/porta incorretos, firewall, bind-address.

