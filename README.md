# Oficina Mecânica - Sistema de Gestão

Sistema web para gestão de uma oficina mecânica, desenvolvido como entrega acadêmica com foco em cadastro de clientes, veículos e ordens de serviço. A aplicação possui frontend moderno em React e backend REST em Node.js, com persistência em Supabase/PostgreSQL.

## Visão Geral

O projeto organiza o fluxo básico de atendimento de uma oficina:

- Cadastro de clientes.
- Cadastro de veículos vinculados aos clientes.
- Abertura de ordens de serviço.
- Acompanhamento das ordens por status.
- Dashboard com resumo operacional.
- Interface responsiva para uso em desktop, tablet e celular.

## Tecnologias

**Frontend**

- React
- TypeScript
- Vite
- React Router
- CSS puro com variáveis de tema

**Backend**

- Node.js
- Express
- Supabase JS
- PostgreSQL via Supabase

## Funcionalidades

### Dashboard

Tela inicial com indicadores rápidos da oficina:

- Total de clientes.
- Total de veículos.
- Ordens abertas.
- Ordens em andamento.
- Lista das últimas ordens de serviço.

### Clientes

Permite cadastrar e listar clientes com:

- Nome.
- Telefone.
- E-mail opcional.

### Veículos

Permite cadastrar veículos vinculados a clientes:

- Cliente responsável.
- Placa.
- Marca.
- Modelo.
- Ano opcional.

### Ordens de Serviço

Permite abrir e acompanhar ordens de serviço com:

- Cliente.
- Veículo.
- Descrição inicial.
- Status da OS.
- Kanban simples por status.

Status disponíveis:

- Aberta
- Diagnóstico
- Orçamento pendente
- Aprovada
- Não aprovada
- Em execução
- Finalizada

## Estrutura do Projeto

```text
Oficina_Mecanica/
  Backend/
    server.js
    schema.sql
    package.json
    .env.example

  Frontend/
    src/
      components/
      pages/
      services/
      styles/
      utils/
      App.tsx
      main.tsx
    package.json
```

## Como Rodar o Projeto

### 1. Clonar o repositório

```bash
git clone https://github.com/JulioLeo123/oficina-mecanica.git
cd oficina-mecanica
```

### 2. Configurar o backend

Entre na pasta do backend:

```bash
cd Backend
npm install
```

Crie um arquivo `.env` com base no `.env.example`:

```env
SUPABASE_URL=https://seu-projeto.supabase.co
SUPABASE_KEY=sua-chave-supabase
PORT=3001
```

Execute a API:

```bash
npm run dev
```

A API ficará disponível em:

```text
http://localhost:3001/api
```

### 3. Configurar o frontend

Em outro terminal, entre na pasta do frontend:

```bash
cd Frontend
npm install
npm run dev
```

O frontend ficará disponível em:

```text
http://localhost:5173
```

Se a porta `5173` estiver ocupada, o Vite abrirá automaticamente outra porta.

## Rotas da API

| Método | Rota | Descrição |
| --- | --- | --- |
| `GET` | `/api/health` | Verifica se a API está online |
| `GET` | `/api/clientes` | Lista clientes |
| `POST` | `/api/clientes` | Cria um cliente |
| `GET` | `/api/veiculos` | Lista veículos |
| `GET` | `/api/veiculos?cliente_id=ID` | Lista veículos de um cliente |
| `POST` | `/api/veiculos` | Cria um veículo |
| `GET` | `/api/ordens-servico` | Lista ordens de serviço |
| `POST` | `/api/ordens-servico` | Cria uma ordem de serviço |
| `PATCH` | `/api/ordens-servico/:id/status` | Atualiza o status da OS |

## Exemplos de Requisições

### Criar cliente

```json
{
  "nome": "João Silva",
  "telefone": "(11) 99999-9999",
  "email": "joao@email.com"
}
```

### Criar veículo

```json
{
  "cliente_id": 1,
  "placa": "ABC1D23",
  "marca": "Toyota",
  "modelo": "Corolla",
  "ano": 2020
}
```

### Criar ordem de serviço

```json
{
  "cliente_id": 1,
  "veiculo_id": 1,
  "descricao": "Barulho na suspensão dianteira"
}
```

### Atualizar status da OS

```json
{
  "status": "em_execucao"
}
```

## Design e Arquitetura

O frontend foi separado em páginas, componentes e serviços para facilitar manutenção e apresentação acadêmica:

- `pages/`: telas principais da aplicação.
- `components/`: elementos reutilizáveis da interface.
- `services/api.ts`: centraliza chamadas HTTP ao backend.
- `styles/theme.css`: concentra a identidade visual do sistema.
- `types.ts`: define os tipos principais usados no frontend.

A estilização foi feita com CSS puro e variáveis, mantendo o projeto didático, leve e fácil de explicar. A paleta usa tons técnicos e industriais, com destaque para azul, amarelo e cores semânticas de status.

## Responsividade

A interface foi pensada para uso em diferentes dispositivos:

- Navbar com menu adaptado para telas pequenas.
- Tabelas convertidas em cards no mobile.
- Kanban com rolagem horizontal.
- Formulários reorganizados em uma coluna em celulares.

## Segurança

O arquivo `.env` real não deve ser enviado ao GitHub. Por isso, o projeto inclui apenas:

```text
Backend/.env.example
```

Use esse arquivo como modelo para configurar suas variáveis localmente.

## Scripts Úteis

### Backend

```bash
npm run dev
npm start
```

### Frontend

```bash
npm run dev
npm run build
npm run lint
npm run preview
```

## Status do Projeto

Entrega Parcial 1 concluída:

- Backend REST funcional.
- Frontend multi-página.
- Integração com Supabase.
- Layout responsivo.
- Dashboard inicial.
- CRUD inicial de clientes, veículos e ordens de serviço.

## Autor

Desenvolvido por Julio Leonardo como projeto acadêmico de Sistema de Gestão de Oficina Mecânica.
