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
| `GET` | `/api/clientes/:id` | Busca um cliente pelo UUID |
| `POST` | `/api/clientes` | Cria um cliente |
| `PUT` | `/api/clientes/:id` | Atualiza os dados de um cliente |
| `DELETE` | `/api/clientes/:id` | Remove um cliente |
| `GET` | `/api/veiculos` | Lista veículos |
| `GET` | `/api/veiculos?cliente_id=UUID` | Lista veículos de um cliente |
| `GET` | `/api/veiculos/:id` | Busca um veículo pelo UUID |
| `POST` | `/api/veiculos` | Cria um veículo |
| `PUT` | `/api/veiculos/:id` | Atualiza os dados de um veículo |
| `DELETE` | `/api/veiculos/:id` | Remove um veículo |
| `GET` | `/api/ordens-servico` | Lista ordens de serviço |
| `GET` | `/api/ordens-servico/:id` | Busca uma ordem de serviço pelo UUID |
| `POST` | `/api/ordens-servico` | Cria uma ordem de serviço |
| `PUT` | `/api/ordens-servico/:id` | Atualiza uma ordem de serviço |
| `DELETE` | `/api/ordens-servico/:id` | Remove uma ordem de serviço |
| `PATCH` | `/api/ordens-servico/:id/status` | Atualiza somente o status da OS |

Os endpoints `PUT` recebem a representação completa dos campos editáveis do
recurso. Clientes exigem `nome` e `telefone`; veículos exigem `cliente_id`,
`placa`, `marca` e `modelo`; ordens exigem `cliente_id`, `veiculo_id` e `status`.
Campos opcionais podem ser enviados como `null`.

## Exemplos de Requisições

### Criar cliente

```json
{
  "nome": "João Silva",
  "telefone": "(11) 99999-9999",
  "email": "joao@email.com"
}
```

### Atualizar cliente

```http
PUT /api/clientes/UUID_DO_CLIENTE
Content-Type: application/json
```

```json
{
  "nome": "João Silva",
  "telefone": "(11) 99999-9999",
  "email": "joao.novo@email.com"
}
```

### Criar veículo

```json
{
  "cliente_id": "UUID_DO_CLIENTE",
  "placa": "ABC1D23",
  "marca": "Toyota",
  "modelo": "Corolla",
  "ano": 2020
}
```

### Atualizar veículo

```http
PUT /api/veiculos/UUID_DO_VEICULO
Content-Type: application/json
```

```json
{
  "cliente_id": "UUID_DO_CLIENTE",
  "placa": "ABC1D23",
  "marca": "Toyota",
  "modelo": "Corolla",
  "ano": 2021
}
```

### Criar ordem de serviço

```json
{
  "cliente_id": "UUID_DO_CLIENTE",
  "veiculo_id": "UUID_DO_VEICULO",
  "descricao": "Barulho na suspensão dianteira"
}
```

### Atualizar ordem de serviço

```http
PUT /api/ordens-servico/UUID_DA_ORDEM
Content-Type: application/json
```

```json
{
  "cliente_id": "UUID_DO_CLIENTE",
  "veiculo_id": "UUID_DO_VEICULO",
  "descricao": "Revisar suspensão dianteira",
  "status": "em_execucao"
}
```

### Atualizar status da OS

```json
{
  "status": "em_execucao"
}
```

Os UUIDs são retornados pelo banco nas respostas de criação e listagem. Os
endpoints de remoção retornam o registro removido. Uma tentativa de remover
cliente ou veículo relacionado a uma ordem de serviço é rejeitada pelo banco
para preservar as referências.

Erros são retornados em JSON no formato `{"erro":"mensagem"}`. IDs inválidos
retornam `400`, registros inexistentes retornam `404`, conflitos de unicidade
retornam `409` e erros inesperados de persistência retornam `500`.

## Design e Arquitetura

O backend aplica o padrão Model/DAO e separa as responsabilidades:

- `server.js`: declara rotas HTTP, configura middlewares e transforma exceções em respostas HTTP.
- `models/`: valida os dados e aplica regras de negócio das entidades antes de delegar operações.
- `dao/`: concentra as consultas e operações de persistência no Supabase/PostgreSQL.
- `dao/query.js`: padroniza a propagação de erros retornados pelo Supabase.

Cada recurso (`clientes`, `veiculos` e `ordens_servico`) possui seu próprio
Model e DAO. Assim, as regras e a persistência ficam fora das rotas e podem ser
mantidas separadamente.

No frontend, páginas, componentes e serviços também são separados para facilitar manutenção:

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
