# Guia Inception -- do zero ao `docker compose up`

Bem-vindo ao guia mais honesto que vais encontrar sobre o projecto Inception da 42.

---

## Antes de tudo: respira fundo

Se chegaste aqui, provavelmente estás a olhar para o subject do Inception e a pensar:
*"Eu tenho de fazer o quê? Docker? Nginx? MariaDB? WordPress? TLS? Tudo num compose? Sem usar imagens prontas?"*

Calma. Toda a gente passou por isso. Literalmente toda a gente.

Há quem diga que o Inception é o projecto onde tu descobres que o Docker não é só aquele boneco de baleia simpático -- é um bicho que morde se não o alimentares com as configs certas. Mas a boa notícia é: quando entendes o que está a acontecer, tudo encaixa como peças de LEGO (LEGO de adulto, daqueles de 2000 peças, mas LEGO na mesma).

---

## Já sabes Docker? Ou nem por isso?

Este guia foi pensado para os dois casos:

### Se nunca mexeste em Docker:
Não entres em pânico. Antes de montar a stack completa, lê os ficheiros de **teoria** e **prática** nesta ordem:

1. `TEORIA_DOCKER_INCEPTION.md` -- o que é container, imagem, volume, network, secret
2. `PRATICA_INCEPTION_COMPLETA.md` -- mete as mãos no teclado com exercícios simples
3. `PRATICA_SQL_BASICA.md` -- aprende o SQL mínimo para não te perderes

Depois sim, avança para os guias de montagem. Prometemos que vai fazer sentido.

### Se já tens experiência com Docker:
Salta directamente para a **trilha rápida** mais abaixo. Mas mesmo assim, dá uma olhadela na secção de **dicas e armadilhas** -- há coisas específicas do Inception que apanham até veteranos (tipo: "por que é que o meu container reinicia 47 vezes seguidas?").

---

## Umas histórias para te deixar mais confortável

**A história do `tail -f /dev/null`:**
Houve um tempo (obscuro) em que metade dos alunos da 42 mantinha os containers vivos com `tail -f /dev/null` ou `sleep infinity`. Parecia funcionar. Os containers ficavam "Up". Toda a gente feliz. Até ao dia da avaliação, quando o avaliador perguntava: *"Qual é o PID 1 do teu container?"* e a resposta era... `tail`. O serviço real? Morto. O container? Tecnicamente vivo, emocionalmente destruído. Moral da história: o PID 1 tem de ser o processo real do serviço. Sempre.

**A história das senhas no `.env`:**
Outro clássico: alguém mete `MYSQL_ROOT_PASSWORD=supersenha123` no `.env`, faz push para o Git, e dois dias depois percebe que o subject diz claramente *"use Docker secrets"*. Depois tenta mudar a senha... mas o volume já persistiu a antiga. Caos. Desespero. `make fclean`. Recomeçar. A lição? Senhas vão sempre em **secrets**, nunca no `.env`. Neste guia, todos os exemplos já seguem essa regra, então não terás esse problema (de nada).

**A história do `502 Bad Gateway`:**
Toda a gente, sem excepção, vê um `502 Bad Gateway` pelo menos uma vez. É quase uma tradição. Normalmente significa que o Nginx está a tentar falar com o php-fpm... mas o php-fpm está a ouvir em `127.0.0.1` em vez de `0.0.0.0`. Muda uma linha no `www.conf` e o `502` desaparece. É daquelas coisas que demora 2 horas a diagnosticar e 2 segundos a corrigir. Agora já sabes, poupaste 2 horas.

---

## Dicas de ouro (lê antes de começar)

1. **Um serviço de cada vez.** Primeiro MariaDB. Depois WordPress. Depois Nginx. Nunca tentes montar tudo ao mesmo tempo -- é receita para confusão.

2. **Logs são teus melhores amigos.** Sempre que algo não funcionar:
   ```bash
   docker logs <nome_do_container> --tail 50
   ```
   A resposta está quase sempre nos logs.

3. **Senhas em secrets, sempre.** O `.env` serve para variáveis não sensíveis (nome do banco, domínio, usernames). Senhas vão em ficheiros separados dentro da pasta `secrets/` e são montadas via Docker secrets.

4. **`name:` em tudo.** No `docker-compose.yml`, usa `name:` explícito no projecto, nos volumes e nas networks. Caso contrário o Compose adiciona prefixos automáticos e os nomes ficam imprevisíveis.

5. **Não adivinhes erros.** Se algo quebrar, abre o `ERROS_INCEPTION.md`. Tem os sintomas mais comuns e a correcção exacta.

6. **Testa depois de cada passo.** Um `docker ps` e um `docker logs` depois de cada mudança evitam horas de debugging acumulado.

---

## Ordem recomendada de leitura

Todos os ficheiros estão dentro da pasta `inception/`.

### Percurso completo (recomendado para quem está a aprender)

| Ordem | Ficheiro | O que aborda |
|-------|----------|-------------|
| 0 | `GUIA_VM_INCEPTION.md` | Criar a VM Debian (se ainda não tens) |
| 1 | `TEORIA_DOCKER_INCEPTION.md` | Conceitos Docker essenciais |
| 2 | `TEORIA_NGINX_INCEPTION.md` | Como o Nginx funciona no Inception |
| 3 | `TEORIA_WORDPRESS_INCEPTION.md` | WordPress + php-fpm explicado |
| 4 | `TEORIA_MARIADB_INCEPTION.md` | MariaDB, SQL e bootstrap |
| 5 | `PRATICA_INCEPTION_COMPLETA.md` | Exercícios práticos de Docker |
| 6 | `PRATICA_SQL_BASICA.md` | SQL básico em container |
| 7 | `PRATICA_WP_PROJETO.md` | WP-CLI e gestão de utilizadores |
| 8 | `GUIA_MARIADB_INCEPTION.md` | Montar o serviço MariaDB |
| 9 | `GUIA_WORDPRESS_INCEPTION.md` | Montar o serviço WordPress |
| 10 | `GUIA_NGINX_INCEPTION.md` | Montar o serviço Nginx |
| 11 | `GUIA_INCEPTION_3_DIAS.md` | Plano de 3 dias com trechos de código |
| 12 | `GUIA_INCEPTION_3_DIAS_SEM_COPIAR.md` | Plano de 3 dias sem copiar (para entender de verdade) |
| 13 | `ERROS_INCEPTION.md` | Troubleshooting de erros comuns |
| 14 | `VALIDACAO_PRONTO_AVALIACAO.md` | Checklist antes da defesa |

### Trilha rápida (se já sabes Docker e queres ir directo ao ponto)

1. `GUIA_INCEPTION_3_DIAS.md` -- montagem passo a passo
2. `GUIA_MARIADB_INCEPTION.md` -- detalhes do MariaDB
3. `GUIA_WORDPRESS_INCEPTION.md` -- detalhes do WordPress
4. `GUIA_NGINX_INCEPTION.md` -- detalhes do Nginx
5. `ERROS_INCEPTION.md` -- quando algo falhar
6. `VALIDACAO_PRONTO_AVALIACAO.md` -- simulado da defesa

---

## Qual guia abrir por tipo de dúvida

| Dúvida | Onde procurar |
|--------|--------------|
| VM / VirtualBox / VMM / instalação Debian | `GUIA_VM_INCEPTION.md` |
| Docker / Compose / volumes / secrets | `PRATICA_INCEPTION_COMPLETA.md` + `TEORIA_DOCKER_INCEPTION.md` |
| Banco / SQL | `PRATICA_SQL_BASICA.md` + `GUIA_MARIADB_INCEPTION.md` |
| WP-CLI / utilizadores WP | `PRATICA_WP_PROJETO.md` + `GUIA_WORDPRESS_INCEPTION.md` |
| TLS / Nginx / 502 | `GUIA_NGINX_INCEPTION.md` + `TEORIA_NGINX_INCEPTION.md` |
| Erro durante execução | `ERROS_INCEPTION.md` |
| Estou pronto para a avaliação? | `VALIDACAO_PRONTO_AVALIACAO.md` |

---

## Plano de 3 dias (resumo)

| Dia | Foco |
|-----|------|
| 1 | Teoria Docker + prática base + MariaDB funcional |
| 2 | WordPress + php-fpm + integração com DB |
| 3 | Nginx + TLS + validação final + preparação oral |

Detalhes completos em `GUIA_INCEPTION_3_DIAS.md` (com código) ou `GUIA_INCEPTION_3_DIAS_SEM_COPIAR.md` (para quem quer construir sozinho).

---

## Regras do projecto que não podes esquecer

- Sem tag `latest` em nenhuma imagem.
- Sem senhas hardcoded em Dockerfile ou `.env` -- usa Docker secrets.
- Sem `network_mode: host` nem `links`.
- Sem `tail -f`, `sleep infinity`, `while true` para manter container vivo.
- Só o Nginx publica porta (`443`).
- Dois utilizadores no WordPress (admin + outro), e o admin não pode ter `admin`/`administrator` no nome.
- Volumes persistem dados em `/home/<login>/data/`.
- Usa `name:` no compose para volumes, networks e projecto.

---

## Checklist final antes da defesa

1. Entendes e explicas o fluxo: cliente -> Nginx -> php-fpm -> MariaDB.
2. Sobes a stack sem copiar comandos cegamente.
3. Mostras utilizadores do WP e tabelas do DB.
4. Explicas volumes e secrets sem hesitar.
5. Diagnosticas um erro básico só com logs.

Se passares nestes 5 pontos, estás pronto. Boa sorte (mas não vais precisar, porque preparaste-te bem).
