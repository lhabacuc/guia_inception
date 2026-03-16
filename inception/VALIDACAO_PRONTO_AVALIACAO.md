# 🚀 Checklist Pré-Voo: Destruindo na Avaliação do Inception

Pronto para encarar os avaliadores no Inception? Este não é apenas um guia chato; é o seu **Painel de Controle de Pré-Voo**. Siga os passos e simule o caos para ter certeza de que o seu projeto é imortal.

---

## 🛫 1. Teste de Fogo da Infraestrutura

Um projeto perfeito tem que ser burro-proof. O avaliador precisa rodar dois comandos e a mágica precisa acontecer sem uma gota de intervenção manual.

### 🛑 O Teste de Inicialização Limpa
Rodou `make down` (pra desligar e limpar tudo) e depois `make`? A stack sobe lindamente do zero sem pedir socorro?

- **[ ] PASSEI:** Maravilha.
- **[ ] FAIOU:** Tem serviço subindo antes das dependências ficarem prontas ou loop de inicialização. Olhe as logs do docker correndo: `docker logs <container_que_reclama>`.

### 🛑 O "Cadê Todo Mundo?"
Dê um bom e velho `docker ps`.
- Apenas e somente O NGINX deve estar expondo porta (`0.0.0.0:443->443/tcp`). O WordPress (`9000`) e MariaDB (`3306`) devem exibir apenas a porta interna sem setinha pro host.
- Algum Restart constante na tela (Up 2 seconds... Restarting...)? Seu container tá morrendo porque o processo principal foi jogado pra background!

---

## 🔒 2. Teste do Leão-de-Chácara (Nginx / SSL)

Seu servidor não pode receber ninguém de braços abertos num HTTP limpo nem num padrão inseguro.

**A prova dos nove:**
```bash
curl -k https://<seu_login>.42.fr
openssl s_client -connect <seu_login>.42.fr:443 -tls1_2 </dev/null
```
- Acesso à porta 80 e conexão sem TLS *tem que falhar ou não existir*. 
- As respostas com TLS 1.2 / TLS 1.3 *tem que abrir o handshake*.

Se o navegador nem carrega quando bate o nome, confira se mexeu direito no `/etc/hosts` da máquina pra mapear seu login pro IP local!

---

## 🗄️ 3. O Teste do "Não Quebra a Memória" (Persistência)

Muitos avaliadores são sagazes e dão esse fatality no sistema. Faça o mesmo pra se testar:
1. Cadastre "Banana" no título do WordPress, coloque um post novo cheio de cor.
2. Jogue tudo no chão na violência bruta: `docker compose down -v`.
3. Suba de novo: `docker compose up -d`
4. Acesse o site. O post da "Banana" continua vivo? OS DADOS FICAM.

- **[ ] POST TÁ LÁ:** Seus arquivos em `/home/<login>/data/` estão fazendo o bind mount perfeitamente.
- **[ ] VOLTEI PRO ZERO:** Calma lá! Seu `docker-compose.yml` tá apontando as volumes não persistentes, ou então as permissões da pasta estão barrando seus containers.

---

## 📝 4. A Regra Fina dos Detalhes (O Joguinho de Encontrar Pêlos)

Algumas regras são puramente avaliativas e reprovam instantaneamente:
- **[ ]** Imagens sem `:latest`. Você cravou as tags?
- **[ ]** Você fez DOIS usuários no WordPress pela linha de comando?
- **[ ]** O usuário mandachuva (admin) por acaso **NÃO** se chama `admin`, `administrator` ou algo proibido na subject?
- **[ ]** Senhas vitais (principalmente de BD e do wp-admin) não transitam em variáveis plaintext de `ENV` no meio dos arquivos e estão em modo `Secrets/arquivos ocultos`?

---

## 💬 5. Simulado Fogo-Rápido: A Defesa Oral

Um avaliador te cutuca durante a correção e lança o desafio. Responda em menos de 10 segundos na sua mente:
1. **"Por que cargas d'água o WordPress e Nginx não tão no mesmo container?"** -> *Separar a apresentação do motor é mais seguro e escalável.*
2. **"O que acontece no segundo exato que eu chamo e clico no index do WordPress?"** -> *Nginx ouve a porta 443 -> Redireciona via FastCGI pro php-fpm (na porta 9000 do WP) -> WordPress roda PHP puxando dados do MariaDB -> Monta a página inteira de volta pro Nginx servir pra quem pediu.*
3. **"Qual é a diferença brutal entre os Volumes Docker (geridos por ele) e o Bind Mounts (que tu fizestes no `/home`)?"** -> *Bind Mapeia um arquivo/pasta exata da placa hospedeira, garantindo o backup independente do Docker parar de existir.*

---
**Tique em todos os campos? Parabéns. Vista o uniforme, pegue o seu café e vá entregar seu projeto com a maestria que a 42 exige.**
