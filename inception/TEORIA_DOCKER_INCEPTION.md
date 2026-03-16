# 🐳 Teoria Docker: O Guia Definitivo e Anti-Tédio (Inception)

Seja muito bem-vindo ao mundo dos containers! Para o projeto Inception da 42, você precisará dominar o Docker. Mas esqueça as definições chatas. Vamos entender isso de forma prática.

## 1. O que é Docker, afinal?
Imagine que você tem uma receita de bolo incrível. O **Docker** é como um kit mágico que empacota a receita, os ingredientes, a batedeira e o forno. Você entrega esse kit para qualquer pessoa, em qualquer lugar do mundo, e o bolo sai **exatamente igual**. Sem aquela velha desculpa de "na minha máquina funciona".

No Inception, usaremos o Docker para separar nosso sistema em três "caixas" isoladas:
- 🚪 **Nginx:** O porteiro/recepcionista.
- 👨‍🍳 **WordPress (php-fpm):** O cozinheiro.
- 🗄️ **MariaDB:** O cofre/estoque.

---

## 2. O Dicionário de Sobrevivência (Com Analogias)

### 📄 Imagem (A Receita)
É um gabarito imutável. É o arquivo "congelado" que diz o que deve existir dentro do sistema. Você não muda uma imagem depois de pronta; você cria outra.

### 📦 Container (O Bolo Assado)
É a imagem "ganhando vida". É o bolo pronto. Você pode ter vários containers rodando a partir de uma mesma imagem (vários bolos da mesma receita). O container roda, faz seu trabalho e pode ser destruído sem pena.

### 📜 Dockerfile (As Instruções)
O arquivo de texto onde você escreve o passo a passo da receita.
- `FROM`: "Pegue a farinha base (ex: Debian ou Alpine)."
- `RUN`: "Bata no liquidificador (ex: apt-get install)."
- `CMD / ENTRYPOINT`: "O que fazer quando o bolo ficar pronto (O processo principal que mantém o container vivo)."

### 💾 Volume (A Despensa)
Containers têm amnésia. Se você destruir um container, tudo dentro dele some. O **Volume** é um "HD externo" ou uma despensa que sobrevive à morte do container. 
*No Inception*, você precisa guardar o banco de dados e os arquivos do site em um volume, ou seu site vai sumir toda vez que reiniciar!

### 🕸️ Network (O Rádio Walkie-Talkie)
Containers precisam conversar, mas estão em salas isoladas. A Network é a rede interna. Graças a ela, o WordPress não precisa saber o endereço IP do MariaDB; ele só pega o rádio e chama `"Ei, mariadb, me manda os dados!"`.

---

## 3. A Grande Batalha: Docker vs Máquina Virtual (VM)

**A Máquina Virtual (VM)** é como construir uma casa nova no seu quintal só para convidar um amigo. Ela precisa de encanamento próprio, energia própria (Sistema Operacional completo). É pesada e lenta.
**O Docker** é como alugar um quarto na sua casa. Os hóspedes (containers) compartilham o encanamento (Kernel do seu PC), mas cada um tem sua própria chave e privacidade. É leve, rápido e ágil!

*(Lembrete Inception: A sua VM gerada hospeda o Docker, e o Docker hospeda os serviços!)*

---

## 4. Orquestrando tudo: Docker Compose 🎼

Subir um container por vez com comandos longos é um pesadelo.
Entre no **Docker Compose**: O regente da orquestra. Ele lê um arquivo `docker-compose.yml` e entende:
*"Ok, preciso criar uma rede, subir o banco de dados primeiro, esperar ele ficar pronto, e só então subir o site e o porteiro."*
Tudo isso com um humilde comando: `docker compose up -d --build`.

---

## 5. Regras de Ouro do Inception (Para não zerar no projeto)

🛑 **Regra 1: Um serviço, um container.**
Não coloque o MariaDB e o WordPress na mesma caixa. O cozinheiro não dorme no estoque. A separação garante que, se um quebrar, o outro sobrevive.

🛑 **Regra 2: Processo PID 1 (Foreground).**
O container só vive enquanto o seu processo principal estiver rodando na frente das cortinas (foreground). Não use gambiarras como `tail -f` ou `sleep infinity`. Se o Nginx terminar de carregar e for pro background (daemon), o container acha que o trabalho acabou e "morre".

🛑 **Regra 3: Proibido `latest`.**
Usar a tag `image: latest` é confiar na sorte. Amanhã a versão atualiza e quebra seu projeto. Use versões fixas (ex: `debian:bullseye`).

🛑 **Regra 4: Segredos bem guardados.**
Nunca escreva senhas direto no `Dockerfile`! Use um arquivo `.env` para dados normais e **Docker Secrets** para as senhas pesadas.

---

## 6. O Checklist do Mestre (Teste prático)

Antes da avaliação, garanta que consegue responder na lata:
1. Por que usamos volumes nesse projeto? *(Porque senão perco os dados do site quando o container cair)*.
2. Como os containers se comunicam? *(Pela network criada no Docker Compose, usando os próprios nomes dos serviços como DNS)*.
3. Se o container tá subindo e caindo (Restart Loop), o que eu fiz de errado? *(Provavelmente não colocou o processo principal rodando em foreground)*.
