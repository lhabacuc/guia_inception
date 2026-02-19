# TEORIA_NGINX_INCEPTION.md

## 1) O que e Nginx (no contexto do Inception)

Nginx e um servidor web e reverse proxy de alta performance.
No Inception, ele e o **unico ponto de entrada** da infraestrutura e deve:
- receber conexoes HTTPS na porta `443`;
- aplicar TLS (`1.2`/`1.3`);
- encaminhar requisicoes PHP para `wordpress:9000` (php-fpm).

## 2) Papel do Nginx na arquitetura

Fluxo basico:
1. Cliente abre `https://<login>.42.fr`.
2. Nginx recebe conexao SSL/TLS.
3. Nginx serve arquivos estaticos diretamente.
4. Para `.php`, Nginx repassa para php-fpm (`fastcgi_pass wordpress:9000`).
5. php-fpm executa PHP e devolve resposta ao Nginx.
6. Nginx responde ao cliente.

Resumo: Nginx **nao executa PHP**. Quem executa PHP e o php-fpm no container WordPress.

## 3) Conceitos obrigatorios para defesa

## 3.1 TLS/SSL
- TLS protege trafego com criptografia.
- Certificado contem chave publica + identidade (CN).
- Chave privada fica no servidor.
- Handshake TLS negocia cifra e gera sessao segura.

No projeto:
- usar `ssl_protocols TLSv1.2 TLSv1.3;`
- nao usar TLS antigo (1.0/1.1).

## 3.2 Reverse Proxy
Nginx fica na frente dos servicos internos.
Vantagens:
- centraliza entrada em uma porta;
- controla seguranca e configuracao SSL;
- isola servicos internos da internet.

## 3.3 FastCGI e php-fpm
- FastCGI e protocolo usado entre Nginx e php-fpm.
- `fastcgi_pass wordpress:9000` indica para onde enviar scripts PHP.
- `SCRIPT_FILENAME` informa o caminho real do arquivo PHP.

## 3.4 Server block
Bloco `server { ... }` define:
- porta/SSL (`listen 443 ssl`);
- dominio (`server_name`);
- regras de rota (`location /`, `location ~ \.php$`).

## 4) Diretivas mais importantes (e por que existem)

- `listen 443 ssl;`
  Explica que o servidor escuta HTTPS na porta 443.

- `server_name <login>.42.fr;`
  Define dominio aceito pelo bloco.

- `ssl_protocols TLSv1.2 TLSv1.3;`
  Restringe protocolos seguros exigidos pelo projeto.

- `root /var/www/html;`
  Caminho dos arquivos do site.

- `index index.php index.html;`
  Define arquivo padrao ao acessar diretorio.

- `try_files $uri $uri/ /index.php?$args;`
  Se nao existir arquivo fisico, envia para front controller (`index.php`) mantendo query string.

- `location ~ \.php$ { ... }`
  Bloco especifico para arquivos PHP.

- `fastcgi_pass wordpress:9000;`
  Encaminha execucao PHP ao php-fpm do container WordPress.

- `fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;`
  Informa ao php-fpm o arquivo exato a executar.

## 5) Diferenca entre servir estatico e dinamico

- Estatico: imagens, CSS, JS, HTML.
  Nginx responde direto (mais rapido).

- Dinamico (PHP):
  Nginx nao interpreta PHP, apenas encaminha para php-fpm.

## 6) Integracao com Docker

No Docker Compose:
- Nginx deve estar na mesma network dos outros servicos.
- Apenas Nginx publica porta no host (`443:443`).
- WordPress e MariaDB ficam sem exposicao publica.

Beneficio:
- seguranca e separacao clara de responsabilidades.

## 7) Certificado self-signed no Inception

Como projeto local, normalmente usa-se certificado autoassinado.
Isso permite testar HTTPS sem CA publica.
Navegador pode mostrar aviso de confianca, o que e esperado.

## 8) Seguranca essencial

- Nao expor portas internas desnecessarias.
- Nao habilitar TLS legado.
- Nao deixar credenciais hardcoded.
- Rodar processo principal em foreground (`daemon off`).
- Evitar configs permissivas sem necessidade.

## 9) Erros teoricos mais comuns

- **502 Bad Gateway**
  Nginx nao consegue falar com php-fpm (servico/porta/bind incorretos).

- **Certificado ausente ou caminho errado**
  Nginx falha ao iniciar SSL.

- **Dominio errado em server_name**
  Requisicao nao cai no bloco esperado.

- **HTTP em porta 443**
  Cliente tentou sem TLS na porta HTTPS.

## 10) Perguntas comuns na avaliacao (com resposta curta)

- Por que Nginx e o unico entrypoint?
  Para centralizar seguranca, TLS e roteamento, sem expor servicos internos.

- Por que WordPress nao tem Nginx dentro dele?
  Porque cada servico deve ter responsabilidade unica; PHP fica no php-fpm.

- Qual funcao de `fastcgi_pass`?
  Enviar scripts PHP para o php-fpm executar.

- Qual diferenca entre TLS 1.2/1.3 e TLS antigos?
  1.2/1.3 sao mais seguros; antigos tem vulnerabilidades conhecidas.

## 11) Checklist teorico minimo para dominar

1. Entender fluxo cliente -> Nginx -> php-fpm -> resposta.
2. Saber explicar TLS, certificado e chave privada.
3. Saber explicar `server_name`, `location`, `try_files`, `fastcgi_pass`.
4. Saber justificar por que so a porta 443 deve estar publica.
5. Saber diferenciar Nginx (proxy/web) de php-fpm (execucao PHP).

Com essa base teorica, voce consegue explicar o Nginx do Inception com seguranca na defesa.
