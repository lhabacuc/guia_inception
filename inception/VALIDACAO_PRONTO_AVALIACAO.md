# VALIDACAO_PRONTO_AVALIACAO.md

Checklist para validar se você está pronto para a avaliação e o que fazer se não estiver.

## Como usar este arquivo

1. Faça cada teste.
2. Marque `OK` ou `NOK`.
3. Some a pontuação.
4. Siga o plano de correção dos itens `NOK`.

---

## 1) Validação técnica (70 pontos)

## 1.1 Infra sobe do zero (10 pts)

Teste:
```bash
make down
make
```

Critério `OK`:
- stack sobe sem erro.

Se `NOK`, faça:
- revisar `docker-compose.yml` e `Makefile`;
- checar logs com `docker logs <service>`.

## 1.2 Containers certos e estáveis (10 pts)

Teste:
```bash
docker ps
```

Critério `OK`:
- `mariadb`, `wordpress`, `nginx` estão `Up`.
- sem restart loop.

Se `NOK`, faça:
- identificar serviço com loop;
- abrir logs desse serviço e corrigir script/config.

## 1.3 Entrada apenas por Nginx 443 (10 pts)

Teste:
```bash
docker ps
```

Critério `OK`:
- só Nginx publica porta `443`.
- WordPress e MariaDB sem porta pública.

Se `NOK`, faça:
- remover `ports` de `wordpress` e `mariadb` no compose.

## 1.4 HTTPS e TLS 1.2/1.3 (10 pts)

Teste:
```bash
curl -k https://<login>.42.fr
openssl s_client -connect <login>.42.fr:443 -tls1_2 </dev/null
openssl s_client -connect <login>.42.fr:443 -tls1_3 </dev/null
```

Critério `OK`:
- site responde em HTTPS.
- handshake TLS 1.2 e 1.3 funciona.

Se `NOK`, faça:
- revisar `ssl_protocols` e paths de certificado no Nginx.

## 1.5 WordPress funcional com 2 usuários (10 pts)

Teste:
```bash
docker exec -it wordpress wp user list --allow-root
```

Critério `OK`:
- existe admin + segundo usuário.
- admin username não contém `admin`/`administrator`.

Se `NOK`, faça:
- criar usuário extra com `wp user create`;
- ajustar usuário admin se nome proibido.

## 1.6 MariaDB funcional (10 pts)

Teste:
```bash
docker exec -it mariadb mariadb -uroot -p"$(cat secrets/db_root_password.txt)" -e "SHOW DATABASES;"
```

Critério `OK`:
- banco responde e DB do WordPress existe.

Se `NOK`, faça:
- revisar secrets, grants e script de bootstrap do MariaDB.

## 1.7 Persistência de dados (10 pts)

Teste:
```bash
make down
make
ls -la /home/<login>/data/mariadb
ls -la /home/<login>/data/wordpress
```

Critério `OK`:
- dados continuam após reinício da stack.

Se `NOK`, faça:
- corrigir volumes no compose para `/home/<login>/data/*`.

---

## 2) Conformidade do enunciado (20 pontos)

Marque `OK/NOK` para cada item (2 pts cada):

1. Sem `latest` em imagens.
2. Sem senha hardcoded em Dockerfile.
3. Uso de `.env`.
4. Uso de secrets para senhas.
5. Sem `network_mode: host`.
6. Sem `links`.
7. Um serviço por container.
8. Sem comandos proibidos (`tail -f`, `sleep infinity`, `while true`).
9. Nginx é único entrypoint.
10. Rede Docker declarada no compose.

Se qualquer `NOK`, faça:
- corrigir antes da defesa; esses itens derrubam avaliação mesmo com stack funcional.

---

## 3) Prontidão para explicação oral (10 pontos)

Diga em voz alta, sem ler, e marque `OK/NOK` (2 pts cada):

1. Explicar fluxo: cliente -> Nginx -> php-fpm -> MariaDB.
2. Explicar diferença entre volume e bind mount.
3. Explicar diferença entre `.env` e secrets.
4. Explicar por que só 443 no Nginx.
5. Explicar por que admin não pode ter nome proibido.

Se `NOK` em qualquer item:
- revisar os arquivos `TEORIA_*` correspondentes;
- repetir explicação até conseguir em 60-90 segundos por tema.

---

## 4) Pontuação final

- Técnica: 70
- Conformidade: 20
- Oral: 10
- Total: 100

Classificação:
- `90-100`: pronto para avaliação.
- `75-89`: quase pronto, corrigir `NOK` hoje.
- `60-74`: risco alto, focar em conformidade + infraestrutura.
- `<60`: não pronto, fazer plano de recuperação completo.

---

## 5) Plano de recuperação (se não estiver pronto)

## Caso A: muitos erros técnicos

1. Congelar mudanças novas.
2. Corrigir por ordem:
- MariaDB
- WordPress
- Nginx
3. Validar após cada correção com logs.

## Caso B: stack roda mas reprova regra

1. Rodar checklist de conformidade.
2. Corrigir todos os itens proibidos.
3. Revalidar com `docker ps`, `curl`, `openssl`.

## Caso C: sabe executar, mas não sabe explicar

1. Treinar 5 perguntas da seção oral.
2. Fazer simulação de defesa de 15 min.
3. Repetir até explicar sem consultar arquivo.

---

## 6) Simulado final (15 minutos)

Cronômetro:

1. Min 0-3: subir stack e mostrar `docker ps`.
2. Min 3-6: provar HTTPS/TLS.
3. Min 6-9: mostrar usuários WP e DB.
4. Min 9-12: explicar volumes/secrets/rede.
5. Min 12-15: responder 3 perguntas teóricas.

Se concluir sem travar, você está pronto.

---

## 7) Conceitos que o avaliador pode cobrar (resumo curto)

## 7.1 O que é PID 1 no container

- Em Linux, o primeiro processo do ambiente é o PID 1.
- No container, o processo principal do serviço vira PID 1.
- Se esse processo terminar, o container termina.

Por isso:
- o script deve finalizar com `exec <processo_principal>`;
- não deve usar processo “fake” só para manter container vivo.

## 7.2 Por que `tail -f`, `sleep infinity`, `while true` são proibidos

- Esses comandos não são o serviço real.
- Eles mascaram erro de inicialização.
- O container parece “Up”, mas aplicação pode estar quebrada.

## 7.3 Foreground vs daemon

- Em container, o ideal é rodar serviço em foreground.
- Exemplo correto:
  - `nginx -g 'daemon off;'`
  - `php-fpm -F`
- Se rodar em background sem processo principal ativo, container encerra.

## 7.4 Sinais e encerramento limpo

- Docker envia sinais (ex.: `SIGTERM`) ao PID 1 ao parar container.
- Se PID 1 for o processo real, ele encerra corretamente.
- Se PID 1 for script mal feito, pode haver shutdown ruim e corrupção.

## 7.5 Restart policy não corrige configuração errada

- `restart: unless-stopped` ajuda em crash.
- Mas se config estiver errada, vai ficar em loop de restart.
- Primeiro corrige causa raiz, depois valida restart policy.

## 7.6 Network interna por nome de serviço

- No Compose, containers resolvem DNS pelo nome do serviço.
- Exemplo: WordPress conecta em `mariadb` (não precisa IP fixo).
- Isso simplifica manutenção e evita hardcode de IP.

## 7.7 Volume persistente: por que é obrigatório

- Container é descartável; dados não devem ser.
- Volume mantém estado fora do ciclo de vida do container.
- Sem volume correto, ao recriar container você perde DB/site.

## 7.8 Named volume vs bind mount (o que o avaliador espera)

- `named volume`:
  - é gerenciado pelo Docker;
  - mais portátil e desacoplado da estrutura de pastas do host;
  - ideal para persistência de dados de serviços.

- `bind mount`:
  - monta caminho direto do host no container;
  - útil para desenvolvimento local e arquivos específicos;
  - depende da estrutura/permissão do host.

No Inception:
- o enunciado pede volumes Docker para persistência;
- os dados devem ficar em `/home/<login>/data`;
- prática comum no projeto: volume nomeado com `driver_opts` apontando para esse caminho.

## 7.9 Como explicar isso em 20 segundos na defesa

Resposta curta sugerida:
- “Eu uso volumes para manter persistência fora do ciclo de vida do container.  
No Inception, os dados precisam ficar em `/home/<login>/data`, então configuro volumes da stack para gravar ali.  
Bind mount conecta direto a pasta do host; named volume é gerenciado pelo Docker.  
Para dados de banco/site, priorizo volume da stack com persistência controlada.”

## 7.10 Erros comuns de volume (e impacto)

- caminho errado em `/home/<login>/data`:
  - dados não persistem como esperado.

- permissão incorreta na pasta do host:
  - serviço sobe com erro de escrita.

- usar montagem diferente do especificado no enunciado:
  - risco de perda de pontos na conformidade.
