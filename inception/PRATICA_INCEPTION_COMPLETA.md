# PRATICA_FERRAMENTAS_DETALHADA.md

## Objetivo

Ensinar cada ferramenta de forma independente, explicando:
1. sintaxe de cada comando;
2. por que o comando existe;
3. por que o resultado aparece;
4. exercício prático progressivo.

Sem dependência de projeto específico.

---

## 1) Docker: primeiros comandos

## 1.1 Ver versão

Comando:

```bash
docker --version
```

Sintaxe:
- `docker`: binário principal.
- `--version`: flag global que imprime versão e sai.

Por que usar:
- confirmar que Docker está instalado.

Resultado esperado:
- algo como `Docker version 27.x.x, build ...`.

Por que esse resultado aparece:
- o cliente Docker apenas lê metadados da instalação local.

## 1.2 Ver estado do daemon

Comando:

```bash
docker info
```

Sintaxe:
- `info`: subcomando para detalhes de daemon, storage driver, recursos.

Por que usar:
- validar que o daemon está ativo.

Resultado esperado:
- bloco grande com `Server`, `Storage Driver`, `Cgroup` etc.

Por que esse resultado aparece:
- cliente consulta a API do daemon e imprime diagnóstico.

---

## 2) Images: baixar e listar

## 2.1 Baixar imagem

Comando:

```bash
docker pull alpine:3.20
```

Sintaxe:
- `pull`: baixa imagem do registry.
- `alpine`: nome do repositório de imagem.
- `3.20`: tag (versão).

Por que usar:
- obter uma base mínima para testes.

Resultado esperado:
- linhas `Pulling fs layer`, `Download complete`, `Status: Downloaded`.

Por que esse resultado aparece:
- imagem é composta por camadas; Docker baixa cada layer e valida digest.

## 2.2 Listar imagens

Comando:

```bash
docker images
```

Sintaxe:
- `images`: lista imagens no cache local.

Resultado esperado:
- tabela com `REPOSITORY`, `TAG`, `IMAGE ID`, `SIZE`.

Por que esse resultado aparece:
- Docker mostra índice local de imagens.

---

## 3) Containers: executar e remover

## 3.1 Rodar container simples

Comando:

```bash
docker run --rm alpine:3.20 echo "oi"
```

Sintaxe:
- `run`: cria + inicia container.
- `--rm`: remove automaticamente ao terminar.
- `alpine:3.20`: imagem base.
- `echo "oi"`: comando executado no container.

Por que usar:
- validar execução isolada com saída simples.

Resultado esperado:
- imprime `oi` e encerra.

Por que esse resultado aparece:
- processo principal foi `echo`; ao terminar, container para e `--rm` remove.

## 3.2 Rodar em segundo plano

Comando:

```bash
docker run -d --name web_treino -p 8080:80 nginx:stable
```

Sintaxe:
- `-d`: detached (background).
- `--name web_treino`: nome amigável do container.
- `-p 8080:80`: mapeia porta host:container.
- `nginx:stable`: imagem.

Por que usar:
- subir serviço contínuo acessível no host.

Resultado esperado:
- Docker retorna ID do container.

Por que esse resultado aparece:
- daemon criou namespace + rede + processo nginx em background.

Validar:

```bash
docker ps
curl -I http://localhost:8080
```

Remover:

```bash
docker rm -f web_treino
```

Sintaxe do remove:
- `rm`: remove container.
- `-f`: força stop antes de remover.

---

## 4) Dockerfile: criar sua imagem

## 4.1 Arquivo Dockerfile

Crie um diretório de treino:

```bash
mkdir -p "$HOME/lab-docker-vim"
cd "$HOME/lab-docker-vim"
```

Crie `Dockerfile`:

```dockerfile
FROM debian:bookworm

RUN apt-get update && apt-get install -y vim && rm -rf /var/lib/apt/lists/*

WORKDIR /workspace

CMD ["bash"]
```

Explicação linha a linha:
- `FROM debian:bookworm`: imagem base.
- `RUN ... install -y vim`: instala `vim` dentro da imagem.
- `rm -rf /var/lib/apt/lists/*`: reduz tamanho final.
- `WORKDIR /workspace`: diretório padrão ao iniciar.
- `CMD ["bash"]`: shell padrão do container.

## 4.2 Build da imagem

Comando:

```bash
docker build -t vim-home:1.0 .
```

Sintaxe:
- `build`: constrói imagem a partir do Dockerfile.
- `-t vim-home:1.0`: nome+tag.
- `.`: contexto atual (arquivos enviados ao build).

Resultado esperado:
- logs por etapa e `Successfully tagged vim-home:1.0`.

Por que esse resultado aparece:
- Docker executa instruções em camadas; no fim cria novo manifest local.

---

## 5) Exercício prático pedido: editar arquivo do HOME via container com vim

## 5.1 Criar arquivo no home

Comando:

```bash
mkdir -p "$HOME/lab-docker-vim"
printf 'Linha inicial\n' > "$HOME/lab-docker-vim/anotacoes.txt"
```

Resultado esperado:
- arquivo `anotacoes.txt` criado no host.

## 5.2 Subir container com bind mount no arquivo

Comando:

```bash
docker run --rm -it \
  -v "$HOME/lab-docker-vim:/workspace" \
  vim-home:1.0
```

Sintaxe:
- `--rm`: apaga container ao sair.
- `-it`: modo interativo com TTY.
- `-v host:container`: bind mount.
- `"$HOME/lab-docker-vim:/workspace"`: pasta do host acessível no container.
- `vim-home:1.0`: imagem criada.

Por que usar:
- editar arquivo do host usando ferramentas instaladas no container.

Por que isso funciona:
- bind mount compartilha o mesmo arquivo entre host e container.

## 5.3 Editar com vim dentro do container

Dentro do container:

```bash
cd /workspace
vim anotacoes.txt
```

No `vim`:
1. `i` para entrar em modo inserção.
2. adicionar texto, ex.: `Editado dentro do container`.
3. `Esc`
4. `:wq` + Enter para salvar e sair.

Sair do container:

```bash
exit
```

## 5.4 Validar no host

Comando:

```bash
cat "$HOME/lab-docker-vim/anotacoes.txt"
```

Resultado esperado:
- deve mostrar o texto novo.

Por que esse resultado aparece:
- o arquivo é o mesmo (bind mount), então a edição persiste no host.

---

## 6) Docker Compose: múltiplos serviços

Crie `compose.yml`:

```yaml
services:
  web:
    image: nginx:stable
    ports:
      - "8081:80"
```

Subir:

```bash
docker compose -f compose.yml up -d
```

Sintaxe:
- `compose`: módulo de orquestração.
- `-f compose.yml`: arquivo de definição.
- `up -d`: cria e sobe serviços em background.

Validar:

```bash
docker compose -f compose.yml ps
curl -I http://localhost:8081
```

Derrubar:

```bash
docker compose -f compose.yml down
```

Por que usar Compose:
- gerenciar vários containers com configuração declarativa.

---

## 7) Volumes: persistência real

Criar volume:

```bash
docker volume create dados_demo
```

Gravar dado:

```bash
docker run --rm -v dados_demo:/data alpine:3.20 sh -c "echo persistente > /data/valor.txt"
```

Ler dado em outro container:

```bash
docker run --rm -v dados_demo:/data alpine:3.20 cat /data/valor.txt
```

Resultado esperado:
- saída `persistente`.

Por que esse resultado aparece:
- volume é gerenciado pelo Docker e sobrevive aos containers.

---

## 8) Secrets (simulação prática local)

Criar segredo local:

```bash
printf 'SenhaSuperSecreta\n' > "$HOME/lab-docker-vim/segredo.txt"
chmod 600 "$HOME/lab-docker-vim/segredo.txt"
```

Consumir segredo no container (somente leitura):

```bash
docker run --rm \
  -v "$HOME/lab-docker-vim/segredo.txt:/run/segredo.txt:ro" \
  alpine:3.20 cat /run/segredo.txt
```

Sintaxe relevante:
- `:ro` no volume = read-only.

Por que usar:
- separar credencial de imagem/código.

---

## 9) HTTP/HTTPS com curl

Teste HTTP:

```bash
curl -I http://example.com
```

Teste HTTPS:

```bash
curl -I https://example.com
```

Sintaxe:
- `-I`: busca apenas headers.

Por que comparar:
- entender redirecionamento e segurança TLS.

Resultado esperado:
- status como `200`, `301`, `302` e cabeçalhos.

---

## 10) SQL com MariaDB em container

Subir banco:

```bash
docker run --rm -d --name sql_demo -e MARIADB_ROOT_PASSWORD=rootpass mariadb:11
```

Criar DB:

```bash
docker exec -it sql_demo mariadb -uroot -prootpass -e "CREATE DATABASE aula;"
```

Listar DBs:

```bash
docker exec -it sql_demo mariadb -uroot -prootpass -e "SHOW DATABASES;"
```

Remover:

```bash
docker rm -f sql_demo
```

Por que isso ensina SQL:
- você pratica conexão, criação e consulta básicas.

---

## 11) WP-CLI (WordPress CLI)

Comando:

```bash
docker run --rm -it wordpress:cli wp --info
```

Por que usar:
- aprender automação de tarefas WordPress por linha de comando.

Resultado esperado:
- versão PHP, WP-CLI, paths e detalhes de ambiente.

---

## 12) Checklist de aprendizado

1. Executou `hello-world` e entendeu saída.
2. Baixou/listou/removeu imagens.
3. Criou/inspecionou/removeu containers.
4. Construiu imagem via Dockerfile.
5. Fez exercício de `vim` editando arquivo do `$HOME` via bind mount.
6. Subiu serviço com Compose.
7. Validou persistência com volume.
8. Simulou segredo com montagem read-only.
9. Testou HTTP/HTTPS com `curl -I`.
10. Executou SQL básico em MariaDB container.
11. Rodou comando do WP-CLI.

Se todos os itens acima funcionarem, o usuário domina a prática essencial das ferramentas.
