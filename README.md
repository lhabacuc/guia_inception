# MAIN_GUIA.md

Guia principal para navegar os outros arquivos e terminar mais rápido.

## 1) Ordem recomendada de leitura

1. `TEORIA_DOCKER_INCEPTION.md`
2. `TEORIA_NGINX_INCEPTION.md`
3. `TEORIA_WORDPRESS_INCEPTION.md`
4. `TEORIA_MARIADB_INCEPTION.md`
5. `PRATICA_INCEPTION_COMPLETA.md`
6. `PRATICA_SQL_BASICA.md`
7. `PRATICA_WP_PROJETO.md`
8. `GUIA_MARIADB_INCEPTION.md`
9. `GUIA_WORDPRESS_INCEPTION.md`
10. `GUIA_NGINX_INCEPTION.md`
11. `GUIA_INCEPTION_3_DIAS.md`
12. `ERROS_INCEPTION.md`

Ideia:
- primeiro entender conceito;
- depois praticar ferramenta;
- depois montar serviços;
- por fim usar troubleshooting.

## 2) Trilha rápida (se tiver pouco tempo)

1. Ler só:
- `PRATICA_INCEPTION_COMPLETA.md`
- `GUIA_MARIADB_INCEPTION.md`
- `GUIA_WORDPRESS_INCEPTION.md`
- `GUIA_NGINX_INCEPTION.md`
- `ERROS_INCEPTION.md`

2. Executar na ordem:
- subir MariaDB;
- subir WordPress;
- subir Nginx;
- validar HTTPS e persistência.

3. Revisar rápido:
- `PRATICA_SQL_BASICA.md`
- `PRATICA_WP_PROJETO.md`

## 3) Qual guia usar por dúvida

- Dúvida de Docker/Compose/volumes/secrets:
  `PRATICA_INCEPTION_COMPLETA.md` + `TEORIA_DOCKER_INCEPTION.md`

- Dúvida de banco/SQL:
  `PRATICA_SQL_BASICA.md` + `GUIA_MARIADB_INCEPTION.md`

- Dúvida de WP-CLI/usuários:
  `PRATICA_WP_PROJETO.md` + `GUIA_WORDPRESS_INCEPTION.md`

- Dúvida de TLS/Nginx/502:
  `GUIA_NGINX_INCEPTION.md` + `TEORIA_NGINX_INCEPTION.md`

- Erro durante execução:
  `ERROS_INCEPTION.md`

## 4) Dicas para terminar mais rápido

1. Não tente tudo ao mesmo tempo.
- primeiro DB,
- depois WP,
- depois Nginx.

2. Sempre validar após cada etapa.
- `docker ps`
- `docker logs <service>`

3. Se algo quebrar, não adivinhe.
- abra `ERROS_INCEPTION.md`
- compare sintoma e aplique correção exata.

4. Evite retrabalho.
- padronize nomes de variáveis no `.env`
- não troque nomes de serviço no meio do processo.

5. Foque no que dá ponto.
- 443 via Nginx
- TLS 1.2/1.3
- persistência
- 2 usuários no WP
- sem segredos hardcoded

6. Faça uma rotina de validação final.
- site abre em `https://<login>.42.fr`
- dados persistem após `down/up`
- só Nginx publica porta.

## 5) Plano de estudo de 3 dias (compacto)

Dia 1:
- teoria Docker + prática base + MariaDB.

Dia 2:
- WordPress + WP-CLI + SQL básico.

Dia 3:
- Nginx/TLS + testes finais + correção por troubleshooting.

## 6) Checklist final antes da defesa

1. Entende e explica o fluxo completo: cliente -> nginx -> wp/php-fpm -> mariadb.
2. Consegue subir a stack sem copiar comandos cegamente.
3. Consegue mostrar usuários do WP e tabelas do DB.
4. Consegue explicar volumes e secrets.
5. Consegue diagnosticar erro básico com logs.

Se seguir este arquivo como mapa, você usa cada guia no momento certo e termina mais rápido.
