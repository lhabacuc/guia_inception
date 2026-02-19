# GUIA_INCEPTION_3_DIAS_SEM_COPIAR.md

Guia alternativo ao `GUIA_INCEPTION_3_DIAS.md` para quem não quer copiar código.

Objetivo: você construir o projeto entendendo o que precisa fazer, em qual ordem, e como validar cada etapa.

## Como usar este guia

- Não copie código pronto.
- Em cada etapa, escreva seus arquivos com base no que a etapa pede.
- Só avance quando a validação da etapa estiver `OK`.

---

## Dia 1: Base da infraestrutura e MariaDB

## 1) Organizar estrutura

O que fazer:
- criar estrutura de diretórios (`srcs`, `requirements`, `conf`, `tools`, `secrets`);
- criar `Makefile` na raiz;
- preparar caminho de persistência em `/home/<login>/data`.

Como saber que está certo:
- você consegue explicar onde fica cada serviço e onde ficam dados persistentes.

## 2) Definir variáveis e segredos

O que fazer:
- criar `.env` com variáveis de domínio, banco e usuários do WP;
- criar arquivos de secrets para senha do DB e root do DB;
- garantir que segredo não fica hardcoded em Dockerfile.

Como saber que está certo:
- seus scripts leem segredo em runtime, não de texto fixo no Dockerfile.

## 3) Construir serviço MariaDB

O que fazer:
- criar Dockerfile do MariaDB;
- ajustar config para aceitar conexão da rede Docker;
- criar script de inicialização que:
  - lê secrets,
  - inicializa banco na primeira execução,
  - cria DB do WordPress,
  - cria usuário de app,
  - define senha root,
  - inicia MariaDB em foreground.

Como saber que está certo:
- container `mariadb` sobe sem loop;
- banco e usuário existem;
- você entende cada comando SQL usado no bootstrap.

## 4) Definir compose base

O que fazer:
- declarar serviço `mariadb` no compose;
- declarar rede dedicada;
- declarar volume persistente para banco em `/home/<login>/data/mariadb`;
- conectar secrets no serviço.

Como saber que está certo:
- DB sobe pelo compose e persiste após restart.

---

## Dia 2: WordPress com php-fpm e integração

## 1) Construir serviço WordPress

O que fazer:
- criar Dockerfile com php-fpm, extensões PHP e wp-cli;
- configurar php-fpm para escutar em `0.0.0.0:9000`;
- criar script `run.sh` que:
  - espera MariaDB ficar pronto,
  - baixa core do WP na primeira execução,
  - gera `wp-config.php`,
  - instala site,
  - cria segundo usuário,
  - inicia php-fpm em foreground.

Como saber que está certo:
- WordPress instala uma vez;
- em restart, não reinstala;
- `wp user list` mostra admin + segundo usuário.

## 2) Integrar com MariaDB no compose

O que fazer:
- adicionar serviço `wordpress` no compose;
- ligar na mesma network do DB;
- montar volume persistente para `/var/www/html`;
- conectar secret de senha do DB;
- usar dependência de inicialização + wait loop no script.

Como saber que está certo:
- WordPress conecta no DB sem erro;
- arquivos do WP persistem em `/home/<login>/data/wordpress`.

## 3) Validar fluxo interno

O que fazer:
- testar resolução DNS entre containers;
- testar se php-fpm está ouvindo corretamente;
- revisar logs de WP e DB.

Como saber que está certo:
- sem `Error establishing a database connection`;
- sem loop de restart.

---

## Dia 3: Nginx + TLS + preparação para defesa

## 1) Construir serviço Nginx

O que fazer:
- criar Dockerfile do Nginx;
- criar config de server block para HTTPS;
- restringir protocolos para TLS 1.2/1.3;
- configurar FastCGI para `wordpress:9000`;
- criar script que gera certificado local e inicia Nginx em foreground.

Como saber que está certo:
- Nginx sobe e responde em `https://<login>.42.fr`.

## 2) Fechar compose final

O que fazer:
- adicionar serviço `nginx`;
- publicar apenas `443:443`;
- não publicar portas de WordPress/MariaDB;
- manter todos os serviços na rede dedicada.

Como saber que está certo:
- só Nginx aparece com porta pública no `docker ps`.

## 3) Validação final obrigatória

O que fazer:
- validar HTTPS e handshake TLS;
- validar persistência após `down/up`;
- validar usuários no WP;
- validar DB e tabelas;
- validar conformidade com regras proibidas.

Como saber que está certo:
- todos os testes passam sem ajuste manual improvisado.

## 4) Preparar explicação da defesa

Você precisa conseguir explicar sem ler:
- fluxo completo: cliente -> Nginx -> php-fpm -> MariaDB;
- por que PID 1 importa;
- por que não usar `tail -f`/`sleep infinity`;
- diferença entre secrets e `.env`;
- diferença entre volume e bind mount;
- por que só Nginx expõe porta.

---

## Regras de ouro para terminar rápido

1. Não pule validação por etapa.
2. Não depure Nginx com DB quebrado.
3. Sempre olhar logs antes de alterar arquivo.
4. Corrija causa raiz, não sintoma.
5. Evite renomear variáveis/serviços no meio do caminho.

---

## Critério de pronto

Você está pronto quando:
1. sobe tudo com um comando;
2. HTTPS funciona no domínio correto;
3. dados persistem;
4. conformidade do enunciado está limpa;
5. você consegue explicar arquitetura e decisões em linguagem simples.

Se faltar qualquer item, volte à etapa correspondente e corrija antes da avaliação.
