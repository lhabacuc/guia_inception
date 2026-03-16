# 🌐 Teoria Nginx: O Porteiro Rigoroso do Inception

Bem-vindo ao Nginx! É aqui que nosso projeto encontra o mundo real. Entenda o Nginx como o **Porteiro VIP** e o **Recepcionista** do seu sistema.

## 1. Qual é a missão do Nginx?

No Inception, a arquitetura exige um único ponto de entrada. O cliente (navegador) NÃO pode ir direto falar com o WordPress ou com o Banco de Dados. Ele precisa passar primeiro pelo porteiro.
A missão do Nginx é:
1. Aceitar conexões seguras na porta `443` (HTTPS).
2. Verificar a identidade usando certificados TLS.
3. Entregar conteúdo estático (imagens, HTML simples) na hora.
4. Quando alguém pede algo complexo (um arquivo `.php`), ele atua como mensageiro e joga a requisição para o WordPress resolver.

**🚨 ALERTA GIGANTE:** Nginx NÃO EXECUTA PHP! Se pedirem um bolo (PHP) pra ele, ele diz "Não sei cozinhar" e manda a ordem para a cozinha (WordPress/php-fpm).

---

## 2. A Camada de Segurança: TLS/SSL 🔒

Não queremos que a comunicação ande pelada pela internet (HTTP puro passa dados em texto claro). Por isso usamos **HTTPS**.

- **Certificado:** É a "Carteira de Identidade" do seu site.
- **Chave Privada:** Fica guardada a sete chaves no servidor.
- No Inception, criamos um certificado "auto-assinado". Como não fomos a um cartório oficial na internet pagar por isso, os navegadores dão aquele aviso de "Site Inseguro". Para esse projeto, isso é 100% normal e esperado.
- **TLS 1.2 e 1.3:** São protocolos modernos de criptografia. Protocolos mais antigos (TLS 1.0/1.1) já foram crackeados pelos vilões da internet e não devem ser configurados no seu porteiro!

---

## 3. Reverse Proxy & FastCGI (Entendendo a mágica)

### Reverse Proxy (Proxy Reverso)
Proxy normal é quando você se esconde para acessar a internet (ex: VPN). 
Proxy **Reverso** é quando o SERVIDOR se esconde de você. Você acha que está acessando `login.42.fr` no Nginx, mas na verdade o Nginx tá buscando os dados escondidos lá no container do WordPress. Ele protege os serviços internos!

### O protocolo FastCGI / php-fpm
Para o Nginx (o porteiro) falar com o WordPress (a cozinha), eles usam um telefone dedicado chamado `FastCGI`. 
No bloco de configuração, verifique isso:
`fastcgi_pass wordpress:9000;`
É aqui que o Nginx está dizendo: *"Olha, é código PHP? Então liga no ramal 9000 para a equipe do WordPress resolver!"*

---

## 4. Dissecando a Configuração (O Bloco "Server")

Quando você escreve o arquivo `.conf` do Nginx, algumas regras são cruciais:

- `listen 443 ssl;` -> "Porteiro, só abra a porta 443, e exija a pulseirinha VIP (ssl)."
- `server_name <login>.42.fr;` -> "Só deixe entrar quem está procurando especificamente por este nome."
- `root /var/www/html;` -> "Isto é o mapa de onde estão os arquivos visíveis do site."
- `index index.php index.html;` -> "Se a pessoa não pedir nenhum arquivo em específico, mande o index.php primeiro."

O comando mais cabuloso, mas que salva vidas:
**`try_files $uri $uri/ /index.php?$args;`**
Analogia: "Tente achar o arquivo físico. Não achou? Veja se é uma pasta. Também não? Então manda tudo pro chef principal do WordPress (`index.php`) e passa pra ele as anotações do cliente (`$args`)."

---

## 5. Falhas Comuns: Evite Reprovação!

- **A Síndrome do 502 Bad Gateway:** O erro mais famoso do Inception! Significa que o Nginx (porteiro) tentou ligar para o php-fpm (ramal 9000), mas ninguém atendeu. (Cheque se o container do WordPress está rodando e na mesma rede!).
- **Rede Exposta:** NUNCA publique as portas do WordPress (9000) e MariaDB (3306) no `docker-compose.yml`. Só a 443 do Nginx deve ser visível pro mundo! O projeto pede isolamento.

---

## 6. O Desafio Final: Defenda seu Nginx

Se o avaliador perguntar *"Como o cliente carrega a página?"*, responda com confiança:
1. O Navegador bate na porta 443.
2. O Nginx atende via HTTPS e olha o `server_name`.
3. Ele percebe que o arquivo principal é `.php`.
4. Ele não sabe ler `.php`, então usa o `fastcgi_pass` pra mandar a bucha pro container do WordPress.
5. O WordPress processa, devolve HTML fresquinho pro Nginx, que finalmente entrega pro cliente satisfeito.
