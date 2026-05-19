# 🛠️ Sistema de Manutenção de Equipamentos Eletrônicos

Um sistema web completo projetado para gerenciar o fluxo de ordem de serviços para manutenção de equipamentos de informática (notebooks, desktops, impressoras, etc.). O sistema conecta clientes que precisam de reparos com os técnicos/funcionários da assistência.

---

## ✨ Funcionalidades

### 👤 Área do Cliente
* **Cadastro inteligente:** Autopreenchimento de endereço via integração com a API do **ViaCEP**.
* **Abertura de Solicitações:** Registro do equipamento e descrição detalhada do defeito.
* **Gestão de Orçamentos:** Aprovação ou rejeição (com justificativa) dos orçamentos enviados pelos técnicos.
* **Pagamento e Histórico:** Confirmação de pagamento e visualização de toda a linha do tempo da solicitação.

### 👨‍🔧 Área do Funcionário / Admin
* **Dashboard de Solicitações:** Visualização rápida de chamados pendentes com filtros por período e status.
* **Orçamentos e Manutenções:** Definição de valores, registro técnico do conserto e envio de orientações ao cliente.
* **Redirecionamento:** Capacidade de transferir uma solicitação para outro técnico especializado.
* **Relatórios (PDF):** Geração de relatórios financeiros diretamente pelo navegador utilizando `jsPDF`.

---

## 🚀 Tecnologias e Arquitetura

**Front-end:** 
* Angular (v15+), Bootstrap 5, Angular Material.
* **Padrões:** Standalone Components, Feature-Sliced Design.

**Back-end:** 
* Java 17, Spring Boot 3, Spring Data JPA, Hibernate, Bean Validation.

**Banco de Dados & Infraestrutura:** 
* PostgreSQL 15.
* Docker & Docker Compose (Containerização para consistência entre ambientes de desenvolvimento).

---

## ⚙️ Pré-requisitos e Instalação do Docker

Nós utilizamos o Docker para padronizar o ambiente. **Ninguém da equipe precisa ter o Java, Maven ou PostgreSQL instalados diretamente na máquina.** O Docker fará o download e a compilação de tudo em containers isolados.

### 🪟 Para usuários de Windows
1. Baixe e instale o [Docker Desktop](https://www.docker.com/products/docker-desktop/).
2. Durante a instalação, certifique-se de deixar a opção **"Use WSL 2 instead of Hyper-V"** marcada.
3. (Recomendado) Se nunca usou WSL no Windows, abra o PowerShell como Administrador e rode: `wsl --install`.
4. Abra o aplicativo do Docker Desktop e aguarde o ícone ficar verde (Running).

### 🐧 Para usuários de Linux (EndeavourOS / Arch Linux)
Abra o terminal e execute os comandos abaixo para instalar e habilitar o Docker:

```bash
# 1. Atualize o sistema e instale o Docker e o plugin Compose
sudo pacman -Syu docker docker-compose

# 2. Habilite o Docker para iniciar junto com o sistema
sudo systemctl enable --now docker

# 3. Adicione seu usuário ao grupo do Docker (para não precisar usar 'sudo' toda hora)
sudo usermod -aG docker $USER

# ⚠️ IMPORTANTE: Após rodar os comandos acima, reinicie o computador (ou faça logoff e login) para aplicar as permissões do grupo!