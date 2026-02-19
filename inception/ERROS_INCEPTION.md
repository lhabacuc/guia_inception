# ERROS_INCEPTION.md

Guia de troubleshooting do projeto Inception.

Nota importante: “todos os erros possíveis” de forma literal é infinito (depende de SO, versão, hardware, rede, permissões, mudanças manuais, etc.).
Este arquivo cobre o conjunto **mais completo e realista** de erros que aparecem no Inception, com:
- Sintoma
- Causa provável
- Diagnóstico
- Correção
- Prevenção

## 1) Erros gerais de ambiente

## 1.1 `docker: command not found`
- Sintoma: terminal não reconhece `docker`.
- Causa: Docker não instalado ou PATH incorreto.
- Diagnóstico: `which docker`
- Correção: instalar Docker Engine + Compose plugin.
- Prevenção: validar instalação antes de começar (`docker --version`, `docker compose version`).

## 1.2 `permission denied while trying to connect to the Docker daemon socket`
- Sintoma: comandos Docker falham sem sudo.
- Causa: usuário fora do grupo `docker`.
- Diagnóstico: `groups | grep docker`
- Correção: adicionar usuário ao grupo docker e relogar.
- Prevenção: configurar isso no início da VM.

## 1.3 `Cannot connect to the Docker daemon`
- Sintoma: daemon indisponível.
- Causa: serviço Docker parado.
- Diagnóstico: `systemctl status docker`
- Correção: `sudo systemctl start docker`
- Prevenção: habilitar no boot (`sudo systemctl enable docker`).

## 1.4 `docker compose: command not found`
- Sintoma: só `docker-compose` existe ou nenhum dos dois.
- Causa: plugin compose ausente.
- Diagnóstico: `docker compose version`
- Correção: instalar plugin Compose.
- Prevenção: padronizar comandos no projeto.

## 1.5 Falta de espaço em disco
- Sintoma: build para com `no space left on device`.
- Causa: imagens/volumes antigos.
- Diagnóstico: `df -h` e `docker system df`
- Correção: limpar recursos não usados (`docker system prune -a --volumes` com cuidado).
- Prevenção: limpeza periódica na VM.

## 2) Erros de estrutura do projeto

## 2.1 `Makefile: No such file or directory`
- Sintoma: avaliador não encontra Makefile.
- Causa: arquivo fora da raiz.
- Diagnóstico: `ls -la`
- Correção: mover/criar `Makefile` na raiz.
- Prevenção: manter estrutura igual ao enunciado.

## 2.2 `srcs/docker-compose.yml not found`
- Sintoma: `make` falha.
- Causa: caminho errado no Makefile ou nome incorreto.
- Diagnóstico: `ls -la srcs`
- Correção: ajustar caminho no Makefile.
- Prevenção: usar caminho fixo no projeto inteiro.

## 2.3 Nome de serviço diferente do nome da imagem
- Sintoma: perda de ponto em avaliação por regra de nomenclatura.
- Causa: `service: wp` e `image: wordpress` etc.
- Diagnóstico: revisar `docker-compose.yml`.
- Correção: alinhar nome do serviço com imagem.
- Prevenção: padronizar `mariadb`, `wordpress`, `nginx`.

## 3) Erros de `.env` e secrets

## 3.1 Variáveis vazias no container
- Sintoma: scripts quebram com valores em branco.
- Causa: `.env` ausente, nome errado, ou variável com typo.
- Diagnóstico: `docker exec -it <container> env | grep NOME`
- Correção: corrigir nomes e reconstruir.
- Prevenção: usar nomenclatura consistente.

## 3.2 Senha em Dockerfile (falha de avaliação)
- Sintoma: projeto funcional, mas reprova.
- Causa: credenciais hardcoded em Dockerfile/commit.
- Diagnóstico: `rg -n "password|passwd|root" srcs`
- Correção: mover para secrets/.env.
- Prevenção: nunca gravar senha em Dockerfile.

## 3.3 Secrets não montados (`/run/secrets/...` inexistente)
- Sintoma: `cat /run/secrets/db_password: No such file`.
- Causa: seção `secrets:` ausente no serviço ou arquivo não existe.
- Diagnóstico: `docker inspect <container>`
- Correção: declarar secrets no compose e criar arquivos em `secrets/`.
- Prevenção: testar leitura de secret no startup script.

## 3.4 Permissão negada ao ler secret
- Sintoma: `Permission denied`.
- Causa: permissões ou owner incompatíveis.
- Diagnóstico: `ls -la secrets/`
- Correção: `chmod 600 secrets/*.txt`.
- Prevenção: criar secrets sempre com permissão mínima.

## 4) Erros de Docker Compose / build

## 4.1 `build context` errado
- Sintoma: `COPY failed: file not found`.
- Causa: caminhos relativos incorretos no Dockerfile.
- Diagnóstico: revisar `build: ...` e `COPY ...`.
- Correção: alinhar caminhos ao contexto do serviço.
- Prevenção: testar build isolado por serviço.

## 4.2 `failed to solve: ...`
- Sintoma: build interrompe sem imagem final.
- Causa: pacote inexistente, rede fora, typo.
- Diagnóstico: reler linhas acima do erro.
- Correção: corrigir nome de pacote/comando.
- Prevenção: validar comandos em container base temporário.

## 4.3 Build usa cache com artefato quebrado
- Sintoma: erro persiste após correção.
- Causa: camada antiga cacheada.
- Diagnóstico: comparar comando atual vs logs de cache.
- Correção: `docker compose build --no-cache`.
- Prevenção: usar no-cache após mudança crítica.

## 4.4 `latest tag is prohibited`
- Sintoma: reprovação mesmo stack funcional.
- Causa: `FROM alpine:latest` etc.
- Diagnóstico: `rg -n "latest" srcs`
- Correção: fixar versão permitida.
- Prevenção: nunca usar `latest`.

## 5) Erros de rede entre containers

## 5.1 `php_network_getaddresses: getaddrinfo for mariadb failed`
- Sintoma: WordPress não resolve host do DB.
- Causa: serviço fora da rede, nome errado em `DB_HOST`.
- Diagnóstico: `docker exec -it wordpress getent hosts mariadb`
- Correção: usar mesma network e `DB_HOST=mariadb`.
- Prevenção: manter nomes de serviço consistentes.

## 5.2 Comunicação interserviços falha com network correta
- Sintoma: resolve host, mas conexão recusa.
- Causa: serviço destino não pronto ou bind incorreto.
- Diagnóstico: logs + teste de porta dentro da rede.
- Correção: corrigir bind (`0.0.0.0`) e startup order.
- Prevenção: healthcheck/wait loop robusto.

## 5.3 Uso proibido de `network_mode: host` / `links`
- Sintoma: pode funcionar, mas reprova.
- Causa: violação de regra do enunciado.
- Diagnóstico: revisar compose.
- Correção: remover e usar network dedicada.
- Prevenção: checklist antes da defesa.

## 6) Erros de volumes e persistência

## 6.1 Dados não persistem após `down/up`
- Sintoma: WP reinstala ou DB zera.
- Causa: sem volume persistente ou caminho errado.
- Diagnóstico: `docker volume ls`, `ls /home/<login>/data/...`
- Correção: mapear volumes para `/home/<login>/data/*`.
- Prevenção: validar persistência cedo (Dia 1).

## 6.2 Erro de permissão no volume
- Sintoma: MariaDB/WordPress não escreve no volume.
- Causa: owner/permissão da pasta host.
- Diagnóstico: `ls -la /home/<login>/data/*`
- Correção: ajustar owner/perms conforme usuário do processo no container.
- Prevenção: criar pasta com permissões corretas antes do primeiro build.

## 6.3 Uso de bind mount onde enunciado exige named volumes
- Sintoma: reprovação por regra.
- Causa: volume definido direto como `./data:/var/lib/mysql`.
- Diagnóstico: revisar compose.
- Correção: usar `volumes:` com `driver_opts` apontando para `/home/<login>/data`.
- Prevenção: comparar com checklist do PDF.

## 7) MariaDB: erros comuns

## 7.1 `Access denied for user ...`
- Sintoma: WordPress não conecta no DB.
- Causa: senha/user diferente do criado no bootstrap.
- Diagnóstico: logs do mariadb + `SELECT user,host FROM mysql.user;`
- Correção: recriar usuário/GRANT com senha certa.
- Prevenção: fonte única de senha via secret.

## 7.2 MariaDB inicia e encerra imediatamente
- Sintoma: container reinicia em loop.
- Causa: config inválida ou diretório corrompido.
- Diagnóstico: `docker logs mariadb`.
- Correção: corrigir `my.cnf`; em último caso recriar volume.
- Prevenção: não editar config sem validar sintaxe.

## 7.3 `Can't create/write to file` no datadir
- Sintoma: falha de bootstrap.
- Causa: permissão em `/var/lib/mysql`.
- Diagnóstico: logs + `ls -la` no host.
- Correção: ajustar owner/perms e reiniciar.
- Prevenção: `chown` no startup script.

## 7.4 Porta 3306 exposta no host (erro de requisito)
- Sintoma: avaliação marca infra exposta indevidamente.
- Causa: `ports: 3306:3306` no compose.
- Diagnóstico: `docker ps`.
- Correção: remover publicação de porta do DB.
- Prevenção: somente Nginx publica porta.

## 8) WordPress / PHP-FPM: erros comuns

## 8.1 `Error establishing a database connection`
- Sintoma: página padrão de erro do WP.
- Causa: credenciais/host errados, DB indisponível.
- Diagnóstico: logs do wordpress + teste `mariadb-admin ping`.
- Correção: ajustar `wp-config.php` e variáveis.
- Prevenção: script de espera antes do `wp core install`.

## 8.2 `wp: command not found`
- Sintoma: script falha ao instalar WP.
- Causa: WP-CLI não instalado/caminho errado.
- Diagnóstico: `docker exec -it wordpress which wp`
- Correção: instalar e marcar como executável.
- Prevenção: validar no Dockerfile durante build.

## 8.3 `php-fpm` não sobe em foreground
- Sintoma: container finaliza imediatamente.
- Causa: comando sem `-F`.
- Diagnóstico: logs do container.
- Correção: `exec php-fpm8.2 -F`.
- Prevenção: garantir PID 1 correto no `CMD`/script.

## 8.4 WordPress reinstala sempre
- Sintoma: a cada restart, setup novo.
- Causa: `wp-config.php` não persiste ou volume errado.
- Diagnóstico: verificar volume `/var/www/html`.
- Correção: mapear volume persistente certo.
- Prevenção: checar arquivo após reinício.

## 8.5 Admin username inválido para regra do projeto
- Sintoma: projeto funcional, reprovação na defesa.
- Causa: admin contém `admin`/`administrator`.
- Diagnóstico: revisar `.env` e usuários do WP.
- Correção: recriar usuário admin válido.
- Prevenção: usar nome neutro desde o início.

## 8.6 `Permission denied` em `/var/www/html`
- Sintoma: WP não cria/edita arquivos.
- Causa: owner incorreto no volume.
- Diagnóstico: `docker exec -it wordpress ls -la /var/www/html`
- Correção: ajustar owner para `www-data` quando necessário.
- Prevenção: corrigir no startup script/Dockerfile.

## 9) Nginx / TLS: erros comuns

## 9.1 `502 Bad Gateway`
- Sintoma: Nginx responde 502.
- Causa: PHP-FPM não acessível (`wordpress:9000`).
- Diagnóstico: logs Nginx + verificar `php-fpm` no wordpress.
- Correção: corrigir `fastcgi_pass` e `www.conf` (`listen 0.0.0.0:9000`).
- Prevenção: teste interno de conectividade após subir stack.

## 9.2 `400 The plain HTTP request was sent to HTTPS port`
- Sintoma: acesso via HTTP na 443.
- Causa: cliente sem TLS.
- Diagnóstico: teste com `curl -k https://...`.
- Correção: usar HTTPS.
- Prevenção: documentar URL correta.

## 9.3 Certificado não encontrado
- Sintoma: Nginx não sobe por arquivo `.crt`/`.key` ausente.
- Causa: script não gerou cert ou path errado.
- Diagnóstico: logs + `ls /etc/nginx/ssl`.
- Correção: corrigir geração `openssl` e caminhos no conf.
- Prevenção: gerar cert no startup se não existir.

## 9.4 TLS fora do requisito
- Sintoma: projeto funciona, mas reprova.
- Causa: TLSv1.0/1.1 habilitado.
- Diagnóstico: revisar `ssl_protocols`.
- Correção: `ssl_protocols TLSv1.2 TLSv1.3;`
- Prevenção: travar protocolo explicitamente.

## 9.5 Porta 80 exposta sem necessidade
- Sintoma: avaliação considera entrada fora da regra.
- Causa: `ports: "80:80"`.
- Diagnóstico: `docker ps`.
- Correção: remover porta 80.
- Prevenção: manter só `443:443`.

## 10) Erros de scripts de inicialização

## 10.1 Script sem permissão de execução
- Sintoma: `permission denied` ao iniciar container.
- Causa: faltou `chmod +x`.
- Diagnóstico: `ls -l /usr/local/bin/run.sh`
- Correção: `RUN chmod +x ...` no Dockerfile.
- Prevenção: padrão em todos os serviços.

## 10.2 Fim de linha Windows (`^M`)
- Sintoma: `bad interpreter: /bin/bash^M`.
- Causa: arquivo salvo em CRLF.
- Diagnóstico: `cat -A run.sh`
- Correção: converter para LF.
- Prevenção: configurar editor para LF.

## 10.3 Script termina sem `exec`
- Sintoma: processo filho morre e container encerra.
- Causa: comando principal não está como PID 1.
- Diagnóstico: revisar fim do script.
- Correção: usar `exec <daemon> ...`.
- Prevenção: sempre encerrar com `exec` no serviço principal.

## 10.4 Uso de comandos proibidos para manter container vivo
- Sintoma: funciona, mas reprova em avaliação.
- Causa: `tail -f`, `sleep infinity`, `while true`.
- Diagnóstico: revisar `CMD`, `ENTRYPOINT` e scripts.
- Correção: remover hacks e iniciar daemon real em foreground.
- Prevenção: checklist de conformidade antes da defesa.

## 11) Erros de domínio e acesso

## 11.1 `<login>.42.fr` não resolve
- Sintoma: navegador não encontra host.
- Causa: `/etc/hosts` sem entrada.
- Diagnóstico: `getent hosts <login>.42.fr`
- Correção: adicionar `127.0.0.1 <login>.42.fr`.
- Prevenção: configurar hosts no início.

## 11.2 Site abre em IP, mas não no domínio
- Sintoma: acesso por `https://127.0.0.1` funciona, domínio não.
- Causa: `server_name` diferente do domínio.
- Diagnóstico: revisar `nginx.conf`.
- Correção: alinhar `server_name` com `.env`.
- Prevenção: usar template com variável de ambiente.

## 12) Erros de avaliação/defesa (não técnicos, mas críticos)

## 12.1 Projeto funciona mas não sabe explicar
- Sintoma: falha na defesa.
- Causa: implementação sem entendimento.
- Diagnóstico: dificuldade em justificar decisões.
- Correção: revisar fluxo completo e praticar explicação.
- Prevenção: documentar decisões técnicas durante desenvolvimento.

## 12.2 README/User/Dev docs incompletos
- Sintoma: perda de ponto/reprovação por requisito documental.
- Causa: foco só em “rodar”.
- Diagnóstico: comparar docs com enunciado.
- Correção: preencher seções obrigatórias.
- Prevenção: escrever docs no Dia 3.

## 12.3 Credenciais versionadas no Git
- Sintoma: falha direta de segurança no projeto.
- Causa: commit de `.env` real ou secrets.
- Diagnóstico: `git log -p` e `rg` em histórico (se necessário).
- Correção: remover do repositório e rotacionar senhas.
- Prevenção: `.gitignore` correto e revisão antes de commit.

## 13) Comandos de diagnóstico rápido (kit de emergência)

```bash
# status geral
docker ps
docker compose -f srcs/docker-compose.yml ps

# logs

docker logs mariadb --tail 100
docker logs wordpress --tail 100
docker logs nginx --tail 100

# rede e DNS interno
docker network ls
docker network inspect inception

docker exec -it wordpress getent hosts mariadb

# TLS
openssl s_client -connect <login>.42.fr:443 -tls1_2 </dev/null
openssl s_client -connect <login>.42.fr:443 -tls1_3 </dev/null

# volumes/persistência
ls -la /home/<login>/data/mariadb
ls -la /home/<login>/data/wordpress
```

## 14) Fluxo de correção recomendado (ordem)

1. Verifique se os containers estão de pé (`docker ps`).
2. Corrija primeiro MariaDB (base de dados).
3. Depois WordPress/php-fpm.
4. Depois Nginx/TLS.
5. Por fim, persistência e regras do enunciado.

Essa ordem evita perda de tempo depurando camada de cima com camada de baixo quebrada.
