# GUIA_VM_INCEPTION.md

Guia completo para criar uma VM Debian 13 (Trixie) com KDE Plasma para o projeto Inception.
Cobre VMM (virt-manager) e VirtualBox, por terminal e por interface grafica.

---

## Indice

1. [Pre-requisitos](#1-pre-requisitos)
2. [Preparar diretorio do disco](#2-preparar-diretorio-do-disco)
3. [Descarregar ISO do Debian 13](#3-descarregar-iso-do-debian-13)
4. [Opcao A -- Virtual Machine Manager (VMM / virt-manager)](#4-opcao-a--virtual-machine-manager-vmm--virt-manager)
   - 4.1 [Criar VM pelo Terminal (virsh/virt-install)](#41-criar-vm-pelo-terminal-virshvirt-install)
   - 4.2 [Criar VM pela Interface Grafica (virt-manager)](#42-criar-vm-pela-interface-grafica-virt-manager)
5. [Opcao B -- VirtualBox](#5-opcao-b--virtualbox)
   - 5.1 [Criar VM pela Interface Grafica](#51-criar-vm-pela-interface-grafica)
6. [Instalar Debian 13 na VM](#6-instalar-debian-13-na-vm)
   - 6.1 [Instalacao Grafica (recomendado)](#61-instalacao-grafica-recomendado)
   - 6.2 [Instalacao pelo Terminal (text mode)](#62-instalacao-pelo-terminal-text-mode)
7. [Pos-instalacao -- KDE Plasma e ferramentas](#7-pos-instalacao--kde-plasma-e-ferramentas)
8. [Configuracao de rede para Inception](#8-configuracao-de-rede-para-inception)
9. [Snapshot -- proteger o estado limpo](#9-snapshot--proteger-o-estado-limpo)
10. [Checklist final](#10-checklist-final)
11. [Erros comuns](#11-erros-comuns)

---

## 1) Pre-requisitos

No host (tua maquina Linux), precisas de:

| Requisito | Minimo |
|-----------|--------|
| RAM livre | 16 GB (8 GB para a VM) |
| Disco livre em `$HOME/sgoinfre/vm` | 30 GB |
| CPU com virtualizacao (VT-x/AMD-V) | Ativada na BIOS |
| ISO Debian 13 | ~650 MB (netinst) |

Verificar se virtualizacao esta ativa:

```bash
# Se o resultado for > 0, virtualizacao esta ativa
egrep -c '(vmx|svm)' /proc/cpuinfo
```

Se der `0`, reinicia o PC, entra na BIOS/UEFI e ativa VT-x (Intel) ou AMD-V (AMD).

---

## 2) Preparar diretorio do disco

O disco da VM vai ficar em `$HOME/sgoinfre/vm` (requisito do projeto na 42).

```bash
# Criar diretorio
mkdir -p "$HOME/sgoinfre/vm" // de preferencia no goinfre

# Verificar que existe e tem espaco
df -h "$HOME/sgoinfre"
```

> **Importante**: na 42 o `sgoinfre` e uma pasta partilhada com mais espaco.
> Nunca guardes o disco da VM no `$HOME` normal -- podes exceder a cota.

---

## 3) Descarregar ISO do Debian 13

```bash
# Criar pasta para ISOs
mkdir -p "$HOME/sgoinfre/iso"

# Descarregar netinst (instalacao via rede -- mais leve)
wget -P "$HOME/sgoinfre/iso" \
  https://cdimage.debian.org/debian-cd/current/amd64/iso-cd/debian-13.4.0-amd64-netinst.iso

# Verificar que descarregou
ls -lh "$HOME/sgoinfre/iso/"
```

> **Nota**: Debian 13 "Trixie" ainda e a versao testing.
> A ISO netinst descarrega os pacotes durante a instalacao (precisa de internet).

---

## 4) Opcao A -- Virtual Machine Manager (VMM / virt-manager)

### 4.1 Criar VM pelo Terminal (virsh/virt-install)

Este e o metodo mais rapido e reprodutivel.

**Variaveis (ajusta ao teu caso):**

```bash
VM_NAME="inception"
VM_DISK="$HOME/sgoinfre/vm/inception.qcow2"
VM_ISO="$HOME/sgoinfre/iso/debian-13.4.0-amd64-netinst.iso"
VM_RAM=8048       # MB
VM_CPUS=4
VM_DISK_SIZE=30   # GB (apenas exemplos)
```

**Passo 1 -- Criar o disco virtual:**

```bash
qemu-img create -f qcow2 "$VM_DISK" "${VM_DISK_SIZE}G"
```

**Passo 2 -- Criar e arrancar a VM:**

```bash
virt-install \
  --name "$VM_NAME" \
  --ram "$VM_RAM" \
  --vcpus "$VM_CPUS" \
  --disk path="$VM_DISK",format=qcow2 \
  --cdrom "$VM_ISO" \
  --os-variant debian12 \
  --network network=default \
  --graphics spice \
  --video virtio \
  --boot uefi \
  --noautoconsole
```

> **Nota**: `--os-variant debian12` funciona para Debian 13 (ainda nao ha variante oficial para trixie).
> Se quiseres ver as variantes disponiveis: `osinfo-query os | grep debian`

**Passo 3 -- Abrir consola para fazer a instalacao:**

```bash
# Abrir janela grafica
virt-viewer "$VM_NAME"

# OU se preferires consola de texto (sem GUI no host):
virsh console "$VM_NAME"
```

**Comandos uteis com virsh:**

```bash
# Listar VMs
virsh list --all

# Iniciar VM
virsh start inception

# Desligar VM (gracioso)
virsh shutdown inception

# Forcar desligar
virsh destroy inception

# Apagar VM (mantendo disco)
virsh undefine inception

# Apagar VM e disco
virsh undefine inception --remove-all-storage
```

---

### 4.2 Criar VM pela Interface Grafica (virt-manager)

**Passo 1 -- Abrir virt-manager:**

```bash
virt-manager
```

**Passo 2 -- Nova VM:**

1. Clicar em **File > New Virtual Machine** (ou no icone **+**)
2. Selecionar **Local install media (ISO image)**
3. Clicar **Browse** > **Browse Local** > navegar ate:
   `$HOME/sgoinfre/iso/debian-13.4.0-amd64-netinst.iso`
4. Se pedir OS type, escrever **Debian 13** (ou "Generic Linux")

**Passo 3 -- Memoria e CPU:**

- Memory: **8048 MB**
- CPUs: **4**

**Passo 4 -- Disco:**

1. Selecionar **Select or create custom storage**
2. Clicar **Manage** > **Browse Local**
3. Navegar ate `$HOME/sgoinfre/vm/`
4. Escrever nome do ficheiro: `inception.qcow2`
5. Tamanho: **30 GB**

> **Importante**: tens de apontar o disco para `$HOME/sgoinfre/vm/`.
> Por defeito o virt-manager quer guardar em `/var/lib/libvirt/images/` -- NAO aceites o default!

**Passo 5 -- Rede:**

- Manter **NAT (default)**

**Passo 6 -- Revisar e finalizar:**

1. Marcar **Customize configuration before install** (opcional)
2. Clicar **Finish**
3. A VM arranca e mostra o instalador do Debian

---

## 5) Opcao B -- VirtualBox

### 5.1 Criar VM pela Interface Grafica

**Passo 1 -- Abrir VirtualBox:**

```bash
virtualbox
```

**Passo 2 -- Configurar pasta de maquinas:**

1. **File > Preferences > General**
2. Em **Default Machine Folder** colocar: `$HOME/sgoinfre/vm`
   (substituir `$HOME` pelo caminho real, ex: `/home/teulogin/sgoinfre/vm`)
3. **OK**

**Passo 3 -- Nova VM:**

1. Clicar **New** (ou `Ctrl+N`)
2. Preencher:
   - **Name**: `inception`
   - **Folder**: confirmar que mostra `$HOME/sgoinfre/vm`
   - **ISO Image**: clicar no icone de pasta e navegar ate a ISO
   - **Type**: `Linux`
   - **Version**: `Debian (64-bit)`
3. **NAO** marcar "Unattended Install" (queremos controlar a instalacao)
4. **Next**

**Passo 4 -- Hardware:**

- **Base Memory**: `8048 MB`
- **Processors**: `4`
- **Next**

**Passo 5 -- Disco:**

- Selecionar **Create a Virtual Hard Disk Now**
- **Disk Size**: `30 GB`
- Confirmar que o caminho mostra `$HOME/sgoinfre/vm/inception/`
- **Next**

**Passo 6 -- Resumo:**

- Rever as configuracoes
- **Finish**

**Passo 7 -- Arrancar:**

- Selecionar a VM `inception` na lista
- Clicar **Start**
- O instalador do Debian aparece

---

## 6) Instalar Debian 13 na VM

### 6.1 Instalacao Grafica (recomendado)

Quando a VM arranca com a ISO, aparece o menu do instalador Debian.

**1. Selecionar modo de instalacao:**
   - Escolher **Graphical Install**

**2. Lingua:**
   - Selecionar: **Portuguese (Brazil)** ou **English** (tua preferencia)

**3. Localizacao:**
   - Selecionar teu pais

**4. Teclado:**
   - Selecionar o layout do teu teclado (ex: `Portuguese` ou `US International`)

**5. Hostname:**
   - Escrever: `<teu_login>42` (ex: `jsilva42`)
   - Isto e usado pelo projeto Inception para o dominio `<login>.42.fr`

**6. Dominio:**
   - Deixar vazio (ou escrever `42.fr`)

**7. Password do root:**
   - Definir uma password para root
   - **Guardar esta password!**

**8. Criar utilizador:**
   - Nome completo: teu nome
   - Username: `<teu_login>` (ex: `jsilva`)
   - Password: escolher uma password

**9. Particionar disco:**
   - Selecionar: **Guided - use entire disk**
   - Selecionar o disco virtual (unico disponivel)
   - Esquema: **All files in one partition** (mais simples para a VM)
   - **Finish partitioning and write changes to disk**
   - Confirmar: **Yes**

**10. Mirror de pacotes:**
   - Pais: selecionar o mais proximo
   - Mirror: `deb.debian.org` (default, funciona bem)
   - Proxy: deixar vazio (a menos que estejas atras de proxy)

**11. Popularity contest:**
    - Selecionar **No**

**12. Selecao de software:**
    - **DESMARCAR tudo** (vamos instalar KDE Plasma depois manualmente)
    - Marcar **APENAS**:
      - [x] **SSH server**
      - [x] **Standard system utilities**
    - **NAO marcar** "Debian desktop environment" nem nenhum desktop aqui
    - Clicar **Continue**

> **Porque nao instalar KDE aqui?** Porque queremos controlar exatamente o que e instalado
> e ter uma base limpa primeiro.

**13. GRUB:**
    - Instalar GRUB no disco principal: **Yes**
    - Selecionar: `/dev/sda` (ou `/dev/vda`)

**14. Finalizar:**
    - **Continue** para reiniciar
    - A VM reinicia e mostra o login do Debian

---

### 6.2 Instalacao pelo Terminal (text mode)

Se nao tiveres interface grafica no host ou preferires instalar por texto.

**1. Selecionar modo de instalacao:**
   - No menu do Debian escolher **Install** (sem "Graphical")

**2. Navegar com o teclado:**
   - `Tab` -- mover entre opcoes
   - `Enter` -- confirmar
   - `Espaco` -- marcar/desmarcar opcoes
   - Setas -- mover na lista

**3. Seguir os mesmos passos da instalacao grafica** (secao 6.1):
   - Tudo igual, so muda a interface (texto em vez de GUI)
   - As opcoes e a sequencia sao identicas

**4. Na selecao de software:**
   - Usar `Espaco` para desmarcar/marcar:
     - [ ] Debian desktop environment (DESMARCAR)
     - [x] SSH server (MARCAR)
     - [x] Standard system utilities (MARCAR)

**5. Completar a instalacao e reiniciar.**

**Alternativa -- instalacao totalmente automatizada (preseed):**

Para quem quer automatizar a instalacao completa, pode usar um ficheiro preseed.
Isto e avancado e normalmente nao e necessario para o Inception.

---

## 7) Pos-instalacao -- KDE Plasma e ferramentas

Apos o primeiro boot, faz login como **root** (ou com o teu user e usa `su -`).

### 7.1 Atualizar o sistema

```bash
apt update && apt upgrade -y
```

### 7.2 Instalar KDE Plasma

```bash
# Instalar KDE Plasma (versao minima -- recomendado)
apt install -y kde-plasma-desktop sddm

# OU versao completa com todas as apps KDE (ocupa mais espaco)
# apt install -y kde-standard sddm

# Ativar o display manager
systemctl enable sddm
systemctl set-default graphical.target
```

### 7.3 Instalar ferramentas essenciais para Inception

```bash
# Ferramentas base
apt install -y sudo git curl wget vim make

# Docker e Docker Compose (obrigatorio para Inception)
apt install -y docker.io docker-compose

# OU instalar Docker do repositorio oficial (versao mais recente):
apt install -y ca-certificates gnupg
install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/debian/gpg | \
  gpg --dearmor -o /etc/apt/keyrings/docker.gpg
echo "deb [arch=amd64 signed-by=/etc/apt/keyrings/docker.gpg] \
  https://download.docker.com/linux/debian trixie stable" | \
  tee /etc/apt/sources.list.d/docker.list > /dev/null
apt update
apt install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin

# Adicionar teu utilizador ao grupo docker e sudo
usermod -aG docker <teu_login>
usermod -aG sudo <teu_login>
```

### 7.4 Instalar Guest Additions (opcional mas util)

**Para VirtualBox:**

```bash
# Na VM Debian
apt install -y build-essential dkms linux-headers-$(uname -r)

# Inserir CD de Guest Additions:
# - No menu VirtualBox: Devices > Insert Guest Additions CD image
# Depois na VM:
mount /dev/cdrom /mnt
sh /mnt/VBoxLinuxAdditions.run
umount /mnt
reboot
```

**Para VMM (QEMU/KVM):**

```bash
# Ja vem com spice-vdagent para clipboard e resize
apt install -y spice-vdagent qemu-guest-agent
systemctl enable spice-vdagent qemu-guest-agent
```

### 7.5 Reiniciar e verificar

```bash
reboot
```

Apos reiniciar:
- Deve aparecer o ecrã de login do **SDDM** (KDE)
- Faz login com o teu utilizador
- Abre o terminal (Konsole) e verifica:

```bash
# Verificar Docker
docker --version
docker compose version   # se instalaste docker-compose-plugin
docker-compose --version # se instalaste docker-compose classico

# Verificar que o teu user tem permissoes
docker run hello-world
```

---

## 8) Configuracao de rede para Inception

O projeto Inception requer que acedas ao site via `<login>.42.fr`.

### 8.1 Configurar /etc/hosts na VM

```bash
sudo sh -c 'echo "127.0.0.1 <teu_login>.42.fr" >> /etc/hosts'

# Verificar
cat /etc/hosts
ping -c 1 <teu_login>.42.fr
```

### 8.2 Port forwarding (se usas NAT)

Se a rede da VM esta em NAT, precisas de redirecionar a porta 443.

**VirtualBox:**

```bash
VBoxManage modifyvm "inception" --natpf1 "https,tcp,,443,,443"
```

**VMM/KVM:**
Com rede NAT default, o port forwarding nao e direto. Alternativas:
- Usar **bridged network** em vez de NAT
- OU aceder ao site diretamente pelo IP da VM

---

## 9) Snapshot -- proteger o estado limpo

Antes de comecar o Inception, tira um snapshot! Se algo correr mal, restauras sem reinstalar.

### VMM (virsh):

```bash
# Criar snapshot
virsh snapshot-create-as inception "base-limpa" \
  --description "Debian 13 + KDE + Docker instalados"

# Listar snapshots
virsh snapshot-list inception

# Restaurar snapshot
virsh snapshot-revert inception "base-limpa"
```

### VirtualBox:

```bash
# Criar snapshot
VBoxManage snapshot inception take "base-limpa" \
  --description "Debian 13 + KDE + Docker instalados"

# Listar snapshots
VBoxManage snapshot inception list

# Restaurar snapshot
VBoxManage snapshot inception restore "base-limpa"
```

---

## 10) Checklist final

Confirma que tudo esta correto antes de avancar para o Inception:

| # | Verificacao | Comando |
|---|-----------|---------|
| 1 | VM arranca sem erros | `virsh start inception` ou `VBoxManage startvm inception` |
| 2 | Disco esta em `$HOME/sgoinfre/vm/` | `ls -lh $HOME/sgoinfre/vm/` |
| 3 | KDE Plasma carrega ao iniciar | Login grafico SDDM aparece |
| 4 | Tem acesso a internet | `ping -c 3 8.8.8.8` |
| 5 | DNS funciona | `ping -c 3 google.com` |
| 6 | Docker instalado e funcional | `docker run hello-world` |
| 7 | Docker Compose instalado | `docker compose version` |
| 8 | SSH funciona | `systemctl status sshd` |
| 9 | Teu user tem sudo | `sudo whoami` (deve dar `root`) |
| 10 | Teu user esta no grupo docker | `groups` (deve mostrar `docker`) |
| 11 | Hostname correto | `hostname` (deve dar `<login>42`) |
| 12 | /etc/hosts configurado | `ping -c 1 <login>.42.fr` |
| 13 | Snapshot criado | `virsh snapshot-list inception` ou `VBoxManage snapshot inception list` |

Se todos passarem, estas pronto para comecar o Inception!

---

## 11) Erros comuns

### "Permission denied" ao criar disco em sgoinfre

```bash
# Verificar permissoes
ls -ld "$HOME/sgoinfre/vm"

# Corrigir
chmod 755 "$HOME/sgoinfre/vm"
```

### libvirtd nao arranca

```bash
sudo systemctl status libvirtd

# Se estiver inativo:
sudo systemctl enable --now libvirtd

# Verificar se KVM esta disponivel:
ls -la /dev/kvm
# Se nao existir, virtualizacao nao esta ativa na BIOS
```

### VBoxManage: "VT-x is not available"

A virtualizacao (VT-x/AMD-V) nao esta ativa na BIOS.
Reiniciar, entrar na BIOS e ativar.

> Se estiveres numa VM dentro de outra VM (nested virtualization),
> o host exterior tem de permitir nested virt.

### "No space left on device" durante instalacao

O disco em `$HOME/sgoinfre` esta cheio.

```bash
df -h "$HOME/sgoinfre"

# Libertar espaco ou pedir mais cota
```

### SDDM nao aparece apos instalar KDE

```bash
# Verificar que SDDM esta ativo
sudo systemctl status sddm

# Se nao estiver:
sudo systemctl enable sddm
sudo systemctl set-default graphical.target
sudo reboot
```

### Docker "permission denied" sem sudo

```bash
# Adicionar ao grupo docker
sudo usermod -aG docker "$USER"

# Fazer logout e login (ou reiniciar a sessao)
newgrp docker
```

### Nao consigo aceder a VM por SSH do host

```bash
# Verificar IP da VM (dentro da VM)
ip addr show

# No host, testar:
ssh <user>@<IP_DA_VM>

# Se usas NAT no VirtualBox, configura port forwarding:
VBoxManage modifyvm "inception" --natpf1 "ssh,tcp,,2222,,22"
# Depois conecta com:
ssh -p 2222 <user>@localhost
```

---

**Proximo passo**: agora que a VM esta pronta, segue para o `GUIA_INCEPTION_3_DIAS.md` para montar a infraestrutura Docker.
