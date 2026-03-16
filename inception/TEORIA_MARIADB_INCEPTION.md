# 🗄️ Teoria MariaDB: O Grande Cofre do Inception

Chegamos à camada dos dados. Conheça o **MariaDB**, o super banco de dados relacional que vai atuar como o cofre e o grande arquivo do seu site WordPress. 

## 1. Pra que serve o MariaDB no Inception?

O WordPress é incrível, mas ele sofre de amnésia crônica sem um banco de dados. MariaDB é quem guarda:
- O nome e senha (encriptada) dos usuários.
- Todos os posts, textos e comentários.
- A configuração do seu tema.

Se o banco de dados cair, o site quebra revelando aquela temida tela branca com letras pretas irritantes: *"Error establishing a database connection"*.

---

## 2. A Hierarquia de Usuários: Root vs Usuário do App

Imagine que o banco de dados é um banco de verdade (como uma agência financeira).
- **O Root (O Gerente Geral):** Tem poder absoluto. Pode criar contas, apagar contas, incendiar o banco e mudar o sistema inteiro. **NUNCA** deixe o WordPress se conectar como Root. Isso é um suicídio de segurança.
- **O Usuário da Aplicação (O Caixa):** É o usuário que vamos criar (`MYSQL_USER`). Ele só tem permissão para ler, escrever e apagar dados dentro das gavetas do próprio WordPress. 

Na avaliação, mostrar que você separou isso e aplicou os privilégios corretos (`GRANT ALL PRIVILEGES ON wordpress.* TO user`) ganha sorrisos do avaliador.

---

## 3. O Segredo da Persistência (Volume é Vida!)

Pense nos dados soltos dentro de um container Docker como notas de dinheiro guardadas dentro de um balão de ar. Se o balão estourar, o dinheiro voa pro além.
**A solução? Volumes.**
O MariaDB guarda as tabelas em um diretório padrão (como `/var/lib/mysql`). No Inception, o requisito é mapear esse local para uma pasta na sua máquina: `/home/<login>/data/mariadb`. 

Quando o container cai ou é recriado, os seus dados permanecem fisicamente salvos no seu PC. Na próxima inicialização, o container novo se conecta a essa pasta e magicamente recupera toda a memória! Se falhar na persistência durante o teste do avaliador, é PONTUAÇÃO ZERO na hora.

---

## 4. Segredos à Sete Chaves: `.env` x `Secrets`

Credenciais hardcoded no `Dockerfile` (tipo `ENV MYSQL_PASSWORD=1234`) são uma heresia no Inception. 
Nós utilizamos duas camadas de organização:
1. **`.env`**: As variáveis de configuração não-sensíveis (ex: nome do banco, host). É o crachá da visita.
2. **`Docker Secrets`**: Os arquivos super secretos montados no container apenas durante a execução. Onde guardamos senhas. O container lê do arquivo `/run/secrets/...` internamente e ninguém vê de fora.

---

## 5. Como Iniciar o Cofre com Elegância?

Sempre que o container do MariaDB é ligado *pela primeira vez*, precisamos:
1. Ler as senhas seguras.
2. Instalar as bases do sistema.
3. Subir o servidor temporariamente.
4. Executar os scripts SQL preparativos (`CREATE DATABASE`, `CREATE USER`, etc).
5. Desligar e religar a versão definitiva no **Foreground**.

Por queForeground (PID 1)? Porque o container precisa de um processo principal bloqueando a tela para acreditar que está "trabalhando".

---

## 6. O Isolamento de Rede

Uma regra de ouro da arquitetura em três camadas: **Quem está de fora só fala com o Nginx.**
O MariaDB não deve publicar a porta `3306` para a sua máquina hospedeira. Ele deve conversar APENAS com o WordPress, pelos corredores da rede interna (`networks: inception`). 
Para que ele escute os vizinhos do condomínio, precisamos garantir que o MariaDB faça um "bind" no endereço de rede universal (`bind-address=0.0.0.0`).

---

## 7. Quiz Rápido pra Defesa:

- **Por que usamos MySQL/MariaDB ao invés de um banco em arquivo tipo SQLite?** *(Porque aplicações web em produção exigem alta performance estruturada e bancos de dados orientados a cliente-servidor).*
- **Por que o site quebrou quando subi tudo de novo?** *(Cheque se configurou o `volumes` corretamente no compose e se está guardando a persistência no host!)*
- **O WordPress pode usar a porta do MariaDB do host?** *(Não! Ele deve conectar pelo DNS interno do docker, usando a variável `DB_HOST=mariadb`).*
