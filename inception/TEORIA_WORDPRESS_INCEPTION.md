# 👨‍🍳 Teoria WordPress: O Motor Dinâmico do Inception

O Nginx é o porteiro, o MariaDB é o estoque. Chegou a hora de conhecer o **Cozinheiro**: O serviço do **WordPress + PHP-FPM**.
Se você pensa no WordPress apenas como um lugar de fazer blog fácil, no Inception o buraco é mais embaixo: Precisamos entender exatamente o que ele é arquiteturalmente.

## 1. O que é esse tal de WordPress afinal?
Trata-se do CMS (Sistema de Gerenciamento de Conteúdo) mais usado do mundo. É essencialmente um belíssimo amontoado de arquivos escritos em **PHP**. 
Sendo código PHP, ele não roda sozinho feito mágica. Ele precisa de um intérprete. E é aí que entra o nosso herói secundário, o **PHP-FPM** (FastCGI Process Manager).

O Nginx passa a receita (o arquivo `.php`), e o PHP-FPM entende a gramática, executa os comandos (que incluem pedir dados pro banco de dados) e devolve a página HTML purinha pronta pro usuário ler.

---

## 2. A Missão do Container

Seu container de WordPress no projeto precisa ser **PURISTA**. 
1. **NÃO PODE** instalar o Nginx dentro dele (violaria o princípio "1 serviço por container").
2. Ele DEVE inicializar na porta `9000` escutando conexões e esperando ordens do Nginx.

---

## 3. WP-CLI: Automação sem Cliquezinho de Mouse

Em um servidor padrão, o usuário instalaria o WordPress digitando na tela do navegador aquele famoso "Menu de Instalação de 5 minutos". 
Mas no Inception, a infra sobe de forma autônoma. O avaliador vai rodar `docker compose up` e tudo tem que estar pronto. Como pulamos aquela etapa chata de instalação gráfica?
**Com o WP-CLI!**

WP-CLI é a linha de comando do WordPress. Com ele, no seu script de bootstrap (`entrypoint`), você:
- Faz download limpo do motor principal (`wp core download`).
- Gera o arquivo de conexão com o banco de dados (`wp config create`).
- Instala o site simulando um clique de interface (`wp core install`).
- Cria um usuário secundário (`wp user create`).

E bum, tudo tá pronto via terminal sem ninguém intervir. Mágica.

---

## 4. O Coração do Site: `wp-config.php`

Esse é o arquivo que faz a ponte entre a cozinha e o estoque. É nele que configuramos:
- Nome do Banco de Dados
- Usuário do Banco
- Senha
- Host (`mariadb` — magicamente resolvido pelo DNS do Docker Compose na nossa network).

O Script do WP-CLI vai gerar esse arquivo dinamicamente, lendo as variáveis `.env` e principalmente a senha em **Secret** injetada. Lembre-se: Nada de "senha admin123" hardcoded.

---

## 5. Pegadinhas Clássicas do Enunciado

A 42 não dá ponto sem nó. O projeto do Inception tem regrinhas estritas para a verificação do WordPress:
1. **Nome de usuário proibido:** Seu usuário administrador NÃO PODE se chamar `admin` nem `administrator`. 
2. **Segundo usuário:** É obrigatório possuir pelo menos dois usuários registrados (um admin e um normal, como Editor).
3. **Persistência dupla:** Não esqueça que os arquivos estáticos (códigos, posts, imagens upadas) ficam em `/var/www/html`. O banco de dados salva textos, mas as INFORMAÇÕES e PLUGINS ficam nessas pastas. Essa pasta **TEM QUE ESTAR EM UM VOLUME**, montada para o host (conforme regras do Nginx poder ler esses arquivos localmente também).

---

## 6. Socorro, Deu 502!

Erros de Bad Gateway (502) assombram todos no Inception porque o fluxo do projeto é Nginx -> WP -> Banco.
A investigação do erro funciona assim:
- Nginx tenta acessar a porta `9000`. 
- Quem tá na 9000? O php-fpm.
- O php-fpm tá rodando? (Se o container não parou na tela de comando rodando o php-fpm em FOREGROUND, ele capota prematuramente).
- O arquivo `.conf` do php-fpm na pasta `/etc/` está apontando para `listen = 0.0.0.0:9000`? (Se estiver só `127.0.0.1`, o Nginx bate na porta fechada, pois eles não dividem a mesma máquina host!).

Saber investigar os pontos de contato é o que garante o selo de provado!
