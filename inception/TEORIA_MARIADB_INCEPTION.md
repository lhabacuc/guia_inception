# TEORIA_MARIADB_INCEPTION.md

## 1) O que e MariaDB no Inception

MariaDB e o servico de banco de dados relacional da stack.
No Inception, ele armazena todos os dados persistentes do WordPress:
- usuarios
- posts/paginas
- configuracoes
- metadados

Sem MariaDB funcional, o WordPress nao consegue operar.

## 2) Papel do MariaDB na arquitetura

Fluxo basico:
1. WordPress recebe requisicao via Nginx/php-fpm.
2. WordPress executa consultas SQL no MariaDB.
3. MariaDB retorna dados para o WordPress.
4. WordPress monta resposta HTML e devolve via Nginx.

Resumo:
- Nginx = entrada HTTPS
- WordPress/php-fpm = logica aplicacao
- MariaDB = armazenamento persistente

## 3) Conceitos essenciais

## 3.1 Banco relacional
MariaDB organiza dados em:
- databases
- tabelas
- linhas/colunas

WordPress cria tabelas proprias (ex.: `wp_users`, `wp_posts`, etc.).

## 3.2 Usuario e privilegios
Boas praticas no Inception:
- nao usar root para aplicacao;
- criar usuario dedicado (`MYSQL_USER`);
- conceder privilegios apenas no banco do WordPress.

Comandos SQL tipicos:
- `CREATE DATABASE ...`
- `CREATE USER ... IDENTIFIED BY ...`
- `GRANT ALL PRIVILEGES ON wordpress.* TO ...`
- `FLUSH PRIVILEGES`

## 3.3 Root vs usuario de aplicacao
- `root`: administracao do servidor de banco.
- usuario de app: usado pelo WordPress para operacao diaria.

Separar os dois reduz risco de seguranca e erro humano.

## 3.4 Persistencia
No projeto, o datadir do MariaDB (`/var/lib/mysql`) deve persistir em volume.
O enunciado pede armazenamento no host em `/home/<login>/data/mariadb`.

Sem persistencia:
- banco e usuarios podem ser perdidos ao recriar container.

## 4) Inicializacao do MariaDB em container

Fluxo comum de bootstrap:
1. Ler secrets (senha user/root).
2. Inicializar datadir na primeira execucao.
3. Subir instancia temporaria por socket local.
4. Rodar SQL de criacao de banco/usuario/permissoes.
5. Encerrar instancia temporaria.
6. Subir `mariadbd` final em foreground (PID 1).

Esse padrao evita hacks e melhora previsibilidade.

## 5) Rede no Docker e conectividade

No Inception:
- MariaDB deve estar na mesma network Docker dos outros servicos.
- WordPress conecta via nome de servico (`DB_HOST=mariadb`).
- normalmente nao se expoe `3306` para host (entrada publica nao necessaria).

`bind-address=0.0.0.0` permite conexao de containers na rede interna.

## 6) Seguranca essencial

- Nunca hardcode senha em Dockerfile.
- Usar secrets para credenciais sensiveis.
- Restringir privilegios do usuario de aplicacao.
- Evitar exposicao desnecessaria de porta 3306.
- Manter backups/logica de recuperacao em cenarios reais.

## 7) `.env` vs secrets (no contexto do MariaDB)

- `.env`: variaveis nao sensiveis (nome do DB, usuario, host).
- secrets: senhas (`db_password`, `db_root_password`).

Motivo:
- reduzir vazamento de credenciais
- atender requisitos de seguranca da avaliacao

## 8) Erros teoricos comuns

## 8.1 `Access denied for user`
Causas:
- senha errada
- usuario nao criado
- privilegios ausentes

## 8.2 `Error establishing a database connection` no WordPress
Causas:
- MariaDB fora do ar
- `DB_HOST` errado
- credenciais inconsistentes

## 8.3 DB reinicia em loop
Causas:
- script de bootstrap com erro
- config invalida
- permissao ruim no datadir

## 8.4 dados somem apos restart
Causa:
- volume mal configurado ou sem persistencia no caminho correto

## 9) O que explicar na defesa

- Por que MariaDB esta em container separado?
  Separacao de responsabilidade, manutencao e seguranca.

- Por que nao usar root no WordPress?
  Principio do menor privilegio.

- Por que usar secrets para senha?
  Evita expor credenciais no codigo e no historico Git.

- Por que persistir em `/home/<login>/data/mariadb`?
  Requisito do enunciado e garantia de durabilidade de dados.

- Por que processo final em foreground?
  Porque container deve manter processo principal como PID 1.

## 10) Checklist teorico minimo

1. Entender fluxo WordPress <-> MariaDB.
2. Saber diferenciar root e usuario de aplicacao.
3. Saber explicar SQL de bootstrap (DB/user/grants).
4. Saber justificar uso de secrets.
5. Saber explicar persistencia do datadir.
6. Saber explicar rede Docker e `DB_HOST=mariadb`.

Com essa base, voce consegue explicar o MariaDB do Inception com seguranca durante a avaliacao.
