# TEORIA_WORDPRESS_INCEPTION.md

## 1) O que e WordPress no Inception

No Inception, WordPress e o servico de aplicacao web (CMS) que gera conteudo dinamico em PHP.
Ele roda em container proprio com `php-fpm` e depende de:
- MariaDB (armazenar dados)
- Nginx (receber requisicoes HTTPS e encaminhar PHP)

WordPress **nao deve** ter Nginx dentro do mesmo container.

## 2) Papel do WordPress na arquitetura

Fluxo simplificado:
1. Cliente acessa `https://<login>.42.fr`.
2. Nginx recebe a requisicao.
3. Se for PHP, Nginx envia para `wordpress:9000`.
4. php-fpm executa codigo WordPress.
5. WordPress consulta MariaDB para posts, usuarios, configuracoes.
6. Resultado volta para Nginx e depois para o cliente.

Resumo:
- Nginx = entrada e proxy
- WordPress/php-fpm = logica da aplicacao
- MariaDB = dados persistentes

## 3) Conceitos essenciais

## 3.1 CMS
WordPress e um CMS (Content Management System):
- permite criar paginas, posts, usuarios, temas, plugins;
- separa conteudo de apresentacao;
- usa painel administrativo (`/wp-admin`).

## 3.2 PHP-FPM
`php-fpm` e o gerenciador de processos PHP em modo FastCGI.
No Inception:
- ele escuta em `0.0.0.0:9000`;
- recebe scripts PHP do Nginx;
- executa e devolve resposta.

Sem php-fpm, o WordPress nao processa PHP.

## 3.3 Banco de dados
WordPress guarda no MariaDB:
- usuarios e senhas (hash)
- posts/paginas
- configuracoes do site
- metadata

Se DB nao estiver disponivel, erro classico:
`Error establishing a database connection`.

## 3.4 Persistencia
WordPress deve persistir em volume:
- `/var/www/html` no container
- mapeado para `/home/<login>/data/wordpress` no host (via volume Docker)

Sem isso, ao recriar container, o site pode reinicializar.

## 4) Arquivos e componentes importantes

## 4.1 `wp-config.php`
Arquivo central de configuracao do WordPress:
- nome do banco
- usuario do banco
- senha
- host do banco
- salts/chaves de seguranca

No Inception, esse arquivo costuma ser criado automaticamente no startup com `wp-cli`.

## 4.2 `wp-content/`
Pasta com conteudo principal do site:
- `plugins/`
- `themes/`
- `uploads/`

Precisa estar no volume persistente para nao perder dados.

## 4.3 WP-CLI
Ferramenta de linha de comando do WordPress.
Usos comuns no projeto:
- baixar core (`wp core download`)
- gerar config (`wp config create`)
- instalar site (`wp core install`)
- criar usuario extra (`wp user create`)

## 5) Variaveis de ambiente e secrets

No projeto:
- variaveis nao sensiveis no `.env` (ex: `MYSQL_DATABASE`, `DB_HOST`, `DOMAIN_NAME`)
- senha sensivel em Docker secret (ex: `/run/secrets/db_password`)

Motivo:
- evita hardcode de credenciais em Dockerfile/codigo
- melhora seguranca e conformidade na avaliacao

## 6) Requisitos importantes do enunciado relacionados ao WordPress

1. Container WordPress deve ter apenas WordPress + php-fpm (sem Nginx).
2. Deve existir pelo menos 2 usuarios no WordPress/DB:
- admin
- outro usuario (ex: editor)
3. Usuario admin nao pode ter nome com `admin`/`administrator`.
4. Senhas nao podem ficar hardcoded em Dockerfile.
5. Servico nao deve ficar vivo com hacks (`tail -f`, `sleep infinity`, etc.).

## 7) Integracao com Docker Compose

No compose, WordPress tipicamente precisa:
- `depends_on: mariadb`
- `env_file: .env`
- `secrets: db_password`
- `volumes: wordpress_data:/var/www/html`
- `networks: inception`

E **nao precisa** publicar porta para host.
A entrada externa deve ser somente o Nginx em `443`.

## 8) Erros teoricos comuns

## 8.1 `Error establishing a database connection`
Causas mais comuns:
- host do banco errado
- usuario/senha errados
- MariaDB ainda nao pronto

## 8.2 502 no Nginx
Causa comum:
- WordPress/php-fpm nao escuta em `0.0.0.0:9000`

## 8.3 Reinstalacao do WordPress a cada restart
Causa comum:
- volume de `/var/www/html` nao esta persistindo

## 8.4 Falha de avaliacao mesmo funcionando
Causas comuns:
- admin com nome proibido
- credenciais expostas
- WordPress com Nginx dentro do mesmo container

## 9) Perguntas comuns na defesa

- Por que WordPress precisa de php-fpm?
Porque Nginx nao executa PHP; ele so encaminha.

- Por que usar WP-CLI no startup?
Para automatizar install/config e garantir reproducibilidade.

- Por que WordPress precisa de volume?
Para persistir core/config/uploads e evitar perda de dados.

- Por que usar secret para senha do DB?
Para nao deixar credencial exposta no repositório/Dockerfile.

- Por que WordPress nao expoe porta publica?
Porque Nginx e o unico entrypoint da infraestrutura.

## 10) Checklist teorico minimo para dominar

1. Entender fluxo Nginx -> php-fpm -> MariaDB.
2. Saber explicar funcao do `wp-config.php`.
3. Saber diferenciar `.env` de secrets.
4. Saber justificar volume persistente de WordPress.
5. Saber explicar por que o container WP nao deve ter Nginx.
6. Saber explicar criacao de 2 usuarios e restricao do nome do admin.

Com essa base, voce consegue justificar tecnicamente o servico WordPress no Inception durante a avaliacao.
