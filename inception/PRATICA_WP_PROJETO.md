# PRATICA_WP_PROJETO.md

Guia prático de comandos `wp` (WP-CLI) apenas com o necessário para o projeto.

Formato de cada item:
- Comando
- O que faz
- Resultado esperado
- Para que saber

## 0) Pré-requisito

Todos os comandos abaixo devem rodar dentro do container WordPress.
Use este prefixo:

```bash
docker exec -it wordpress
```

Exemplo:

```bash
docker exec -it wordpress wp --info --allow-root
```

---

## 1) Validar se WP-CLI está disponível

Comando:

```bash
docker exec -it wordpress wp --info --allow-root
```

O que faz:
- mostra versão do WP-CLI, PHP e paths.

Resultado esperado:
- saída com versão (`WP-CLI version`) e info do runtime.

Para que saber:
- confirmar que o container consegue usar `wp`.

---

## 2) Baixar WordPress core

Comando:

```bash
docker exec -it wordpress wp core download --allow-root
```

O que faz:
- baixa arquivos do WordPress para o diretório atual (`/var/www/html`).

Resultado esperado:
- mensagem de sucesso de download.

Para que saber:
- passo inicial da instalação automática do site.

---

## 3) Gerar `wp-config.php`

Comando:

```bash
docker exec -it wordpress wp config create \
  --dbname="$MYSQL_DATABASE" \
  --dbuser="$MYSQL_USER" \
  --dbpass="$(cat /run/secrets/db_password)" \
  --dbhost="$DB_HOST" \
  --allow-root
```

O que faz:
- cria arquivo `wp-config.php` com dados de conexão no banco.

Resultado esperado:
- mensagem `Success: Generated 'wp-config.php' file.`

Para que saber:
- sem esse arquivo, WordPress não conecta no MariaDB.

---

## 4) Instalar WordPress

Comando:

```bash
docker exec -it wordpress wp core install \
  --url="https://$DOMAIN_NAME" \
  --title="$WP_TITLE" \
  --admin_user="$WP_ADMIN_USER" \
  --admin_password="$WP_ADMIN_PASSWORD" \
  --admin_email="$WP_ADMIN_EMAIL" \
  --allow-root
```

O que faz:
- cria o site WordPress e o usuário administrador.

Resultado esperado:
- `Success: WordPress installed successfully.`

Para que saber:
- é a instalação principal exigida para o site funcionar.

---

## 5) Criar segundo usuário (exigência do projeto)

Comando:

```bash
docker exec -it wordpress wp user create "$WP_EDITOR_USER" "$WP_EDITOR_EMAIL" \
  --role=editor \
  --user_pass="$WP_EDITOR_PASSWORD" \
  --allow-root
```

O que faz:
- cria usuário adicional (ex.: editor).

Resultado esperado:
- `Success: Created user ...`

Para que saber:
- projeto pede mais de um usuário no WordPress.

---

## 6) Verificar se WordPress já está instalado

Comando:

```bash
docker exec -it wordpress wp core is-installed --allow-root
```

O que faz:
- checa se o WordPress já foi instalado.

Resultado esperado:
- sem saída e retorno `0` quando instalado.

Para que saber:
- evita reinstalar WordPress a cada restart do container.

---

## 7) Listar usuários

Comando:

```bash
docker exec -it wordpress wp user list --allow-root
```

O que faz:
- lista usuários cadastrados no WordPress.

Resultado esperado:
- tabela com `ID`, `user_login`, `user_email`, `roles`.

Para que saber:
- prova rápida de que admin + segundo usuário existem.

---

## 8) Validar URL configurada

Comando:

```bash
docker exec -it wordpress wp option get siteurl --allow-root
```

O que faz:
- mostra URL base configurada no WordPress.

Resultado esperado:
- `https://<login>.42.fr` (ou valor equivalente do `.env`).

Para que saber:
- valida se domínio foi configurado corretamente.

---

## 9) Comandos de suporte úteis

Listar plugins:

```bash
docker exec -it wordpress wp plugin list --allow-root
```

Listar temas:

```bash
docker exec -it wordpress wp theme list --allow-root
```

Para que saber:
- checagem rápida em debug e defesa.

---

## 10) Sequência mínima (ordem recomendada)

1. `wp --info`
2. `wp core download`
3. `wp config create`
4. `wp core install`
5. `wp user create ...` (segundo usuário)
6. `wp user list`
7. `wp option get siteurl`

Se esses passos funcionarem, a prática de `wp` necessária para o projeto está completa.

---

## 11) Erros comuns

`Error: This does not seem to be a WordPress installation.`
- causa: rodou comando antes de `wp core download` ou no diretório errado.

`Error establishing a database connection`
- causa: DB host/user/password incorretos.

`wp: command not found`
- causa: WP-CLI não instalado no container.

`already installed`
- causa: tentou `wp core install` de novo.

