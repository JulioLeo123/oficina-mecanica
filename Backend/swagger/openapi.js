const swaggerDefinition = {
  openapi: '3.0.3',
  info: {
    title: '🔧 API — Sistema de Gestão de Oficina Mecânica',
    version: '1.0.0',
    description: `
## Visão Geral

API REST completa para gerenciamento de uma **oficina mecânica**, desenvolvida com **Node.js + Express** e banco de dados **PostgreSQL via Supabase**.

A API implementa o padrão **DAO (Data Access Object)** para separação de responsabilidades entre as camadas de acesso a dados e regras de negócio.

---

## Arquitetura

\`\`\`
server.js (Rotas Express)
    └── models/ (Validação + Regras de Negócio)
            └── dao/ (Acesso ao Banco de Dados via Supabase)
\`\`\`

---

## Entidades Principais

| Entidade | Descrição |
|---|---|
| **Clientes** | Pessoas físicas ou jurídicas que utilizam a oficina |
| **Veículos** | Automóveis vinculados a um cliente |
| **Ordens de Serviço** | Registros de serviços realizados/em andamento |

---

## Fluxo de Status — Ordem de Serviço

\`\`\`
aberta → diagnostico → orcamento_pendente → aprovada → em_execucao → finalizada
                                           ↘ nao_aprovada
\`\`\`

| Status | Descrição |
|---|---|
| \`aberta\` | Ordem recém-criada, aguardando triagem |
| \`diagnostico\` | Veículo em diagnóstico técnico |
| \`orcamento_pendente\` | Orçamento enviado, aguardando aprovação do cliente |
| \`aprovada\` | Orçamento aprovado pelo cliente |
| \`nao_aprovada\` | Orçamento recusado pelo cliente |
| \`em_execucao\` | Serviço em andamento |
| \`finalizada\` | Serviço concluído |

---

## Validações Globais

- **IDs**: Formato UUID v4 obrigatório
- **Campos de texto obrigatórios**: Não podem ser vazios ou nulos
- **Ano do veículo**: Entre 1886 e o ano atual + 1
- **Status**: Deve ser um dos valores enumerados acima

---

## Códigos de Resposta HTTP

| Código | Significado |
|---|---|
| \`200\` | OK — Requisição bem-sucedida |
| \`201\` | Created — Recurso criado com sucesso |
| \`400\` | Bad Request — Dados inválidos ou ausentes |
| \`404\` | Not Found — Recurso não encontrado |
| \`409\` | Conflict — Violação de unicidade (ex: placa duplicada) |
| \`500\` | Internal Server Error — Erro inesperado no servidor |
    `,
    license: {
      name: 'MIT',
      url: 'https://opensource.org/licenses/MIT',
    },
  },
  servers: [
    {
      url: 'http://localhost:3001',
      description: '🖥️ Servidor Local de Desenvolvimento',
    },
  ],
  tags: [
    {
      name: 'Health',
      description: 'Verificação de saúde e disponibilidade da API',
    },
    {
      name: 'Clientes',
      description: 'Gerenciamento completo de clientes da oficina',
    },
    {
      name: 'Veículos',
      description: 'Gerenciamento de veículos vinculados aos clientes',
    },
    {
      name: 'Ordens de Serviço',
      description: 'Controle de ordens de serviço com fluxo de status',
    },
  ],
  components: {
    schemas: {
      ClienteInput: {
        type: 'object',
        required: ['nome', 'telefone'],
        properties: {
          nome: {
            type: 'string',
            description: 'Nome completo do cliente',
            example: 'João da Silva',
            minLength: 1,
          },
          telefone: {
            type: 'string',
            description: 'Telefone de contato do cliente',
            example: '(11) 99999-1234',
            minLength: 1,
          },
          email: {
            type: 'string',
            nullable: true,
            description: 'E-mail do cliente (opcional)',
            example: 'joao.silva@email.com',
          },
        },
        example: {
          nome: 'João da Silva',
          telefone: '(11) 99999-1234',
          email: 'joao.silva@email.com',
        },
      },

      VeiculoInput: {
        type: 'object',
        required: ['cliente_id', 'placa', 'marca', 'modelo'],
        properties: {
          cliente_id: {
            type: 'string',
            format: 'uuid',
            description: 'UUID do cliente proprietário do veículo',
            example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
          },
          placa: {
            type: 'string',
            description: 'Placa do veículo (formato brasileiro)',
            example: 'ABC-1234',
            minLength: 1,
          },
          marca: {
            type: 'string',
            description: 'Fabricante/marca do veículo',
            example: 'Volkswagen',
            minLength: 1,
          },
          modelo: {
            type: 'string',
            description: 'Modelo do veículo',
            example: 'Gol 1.0',
            minLength: 1,
          },
          ano: {
            type: 'integer',
            nullable: true,
            description: 'Ano de fabricação (entre 1886 e ano atual+1)',
            example: 2020,
            minimum: 1886,
          },
        },
        example: {
          cliente_id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
          placa: 'ABC-1234',
          marca: 'Volkswagen',
          modelo: 'Gol 1.0',
          ano: 2020,
        },
      },

      OrdemServicoInput: {
        type: 'object',
        required: ['cliente_id', 'veiculo_id'],
        properties: {
          cliente_id: {
            type: 'string',
            format: 'uuid',
            description: 'UUID do cliente responsável pela ordem',
            example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
          },
          veiculo_id: {
            type: 'string',
            format: 'uuid',
            description: 'UUID do veículo objeto da ordem de serviço',
            example: 'b2c3d4e5-f6a7-8901-bcde-f12345678901',
          },
          descricao: {
            type: 'string',
            nullable: true,
            description: 'Descrição do serviço solicitado (opcional)',
            example: 'Troca de óleo e filtro de ar',
          },
          status: {
            type: 'string',
            description: 'Status inicial da ordem (padrão: aberta)',
            enum: ['aberta', 'diagnostico', 'orcamento_pendente', 'aprovada', 'nao_aprovada', 'em_execucao', 'finalizada'],
            default: 'aberta',
            example: 'aberta',
          },
        },
        example: {
          cliente_id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
          veiculo_id: 'b2c3d4e5-f6a7-8901-bcde-f12345678901',
          descricao: 'Troca de óleo e filtro de ar. Verificar freios.',
          status: 'aberta',
        },
      },

      OrdemServicoUpdateInput: {
        type: 'object',
        required: ['cliente_id', 'veiculo_id', 'status'],
        properties: {
          cliente_id: {
            type: 'string',
            format: 'uuid',
            description: 'UUID do cliente responsável',
            example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
          },
          veiculo_id: {
            type: 'string',
            format: 'uuid',
            description: 'UUID do veículo',
            example: 'b2c3d4e5-f6a7-8901-bcde-f12345678901',
          },
          descricao: {
            type: 'string',
            nullable: true,
            description: 'Descrição do serviço',
            example: 'Troca de óleo, filtro de ar e alinhamento.',
          },
          status: {
            type: 'string',
            description: 'Status atual da ordem (obrigatório no PUT)',
            enum: ['aberta', 'diagnostico', 'orcamento_pendente', 'aprovada', 'nao_aprovada', 'em_execucao', 'finalizada'],
            example: 'em_execucao',
          },
        },
        example: {
          cliente_id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
          veiculo_id: 'b2c3d4e5-f6a7-8901-bcde-f12345678901',
          descricao: 'Troca de óleo, filtro de ar e alinhamento.',
          status: 'em_execucao',
        },
      },

      StatusInput: {
        type: 'object',
        required: ['status'],
        properties: {
          status: {
            type: 'string',
            description: 'Novo status para a ordem de serviço',
            enum: ['aberta', 'diagnostico', 'orcamento_pendente', 'aprovada', 'nao_aprovada', 'em_execucao', 'finalizada'],
            example: 'aprovada',
          },
        },
        example: {
          status: 'aprovada',
        },
      },

      Cliente: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            format: 'uuid',
            description: 'Identificador único do cliente (UUID gerado automaticamente)',
            example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
          },
          nome: {
            type: 'string',
            description: 'Nome completo do cliente',
            example: 'João da Silva',
          },
          telefone: {
            type: 'string',
            description: 'Telefone de contato',
            example: '(11) 99999-1234',
          },
          email: {
            type: 'string',
            nullable: true,
            description: 'E-mail do cliente',
            example: 'joao.silva@email.com',
          },
          criado_em: {
            type: 'string',
            format: 'date-time',
            description: 'Data e hora de criação do registro (UTC)',
            example: '2024-11-08T10:30:00.000Z',
          },
        },
        example: {
          id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
          nome: 'João da Silva',
          telefone: '(11) 99999-1234',
          email: 'joao.silva@email.com',
          criado_em: '2024-11-08T10:30:00.000Z',
        },
      },

      Veiculo: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            format: 'uuid',
            description: 'Identificador único do veículo',
            example: 'b2c3d4e5-f6a7-8901-bcde-f12345678901',
          },
          cliente_id: {
            type: 'string',
            format: 'uuid',
            description: 'UUID do cliente proprietário',
            example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
          },
          placa: {
            type: 'string',
            description: 'Placa do veículo',
            example: 'ABC-1234',
          },
          marca: {
            type: 'string',
            description: 'Fabricante/marca',
            example: 'Volkswagen',
          },
          modelo: {
            type: 'string',
            description: 'Modelo do veículo',
            example: 'Gol 1.0',
          },
          ano: {
            type: 'integer',
            nullable: true,
            description: 'Ano de fabricação',
            example: 2020,
          },
          criado_em: {
            type: 'string',
            format: 'date-time',
            description: 'Data e hora de criação do registro (UTC)',
            example: '2024-11-08T10:30:00.000Z',
          },
        },
        example: {
          id: 'b2c3d4e5-f6a7-8901-bcde-f12345678901',
          cliente_id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
          placa: 'ABC-1234',
          marca: 'Volkswagen',
          modelo: 'Gol 1.0',
          ano: 2020,
          criado_em: '2024-11-08T10:30:00.000Z',
        },
      },

      OrdemServico: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            format: 'uuid',
            description: 'Identificador único da ordem de serviço',
            example: 'c3d4e5f6-a7b8-9012-cdef-123456789012',
          },
          cliente_id: {
            type: 'string',
            format: 'uuid',
            description: 'UUID do cliente responsável',
            example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
          },
          veiculo_id: {
            type: 'string',
            format: 'uuid',
            description: 'UUID do veículo',
            example: 'b2c3d4e5-f6a7-8901-bcde-f12345678901',
          },
          status: {
            type: 'string',
            description: 'Status atual da ordem',
            enum: ['aberta', 'diagnostico', 'orcamento_pendente', 'aprovada', 'nao_aprovada', 'em_execucao', 'finalizada'],
            example: 'em_execucao',
          },
          descricao: {
            type: 'string',
            nullable: true,
            description: 'Descrição do serviço',
            example: 'Troca de óleo e filtro de ar',
          },
          criado_em: {
            type: 'string',
            format: 'date-time',
            description: 'Data e hora de criação',
            example: '2024-11-08T10:30:00.000Z',
          },
          atualizado_em: {
            type: 'string',
            format: 'date-time',
            description: 'Data e hora da última atualização (atualizado automaticamente)',
            example: '2024-11-08T14:00:00.000Z',
          },
          clientes: {
            description: 'Dados resumidos do cliente (JOIN automático)',
            type: 'object',
            properties: {
              id: { type: 'string', format: 'uuid', example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890' },
              nome: { type: 'string', example: 'João da Silva' },
              telefone: { type: 'string', example: '(11) 99999-1234' },
            },
          },
          veiculos: {
            description: 'Dados resumidos do veículo (JOIN automático)',
            type: 'object',
            properties: {
              id: { type: 'string', format: 'uuid', example: 'b2c3d4e5-f6a7-8901-bcde-f12345678901' },
              placa: { type: 'string', example: 'ABC-1234' },
              marca: { type: 'string', example: 'Volkswagen' },
              modelo: { type: 'string', example: 'Gol 1.0' },
            },
          },
        },
        example: {
          id: 'c3d4e5f6-a7b8-9012-cdef-123456789012',
          cliente_id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
          veiculo_id: 'b2c3d4e5-f6a7-8901-bcde-f12345678901',
          status: 'em_execucao',
          descricao: 'Troca de óleo e filtro de ar. Verificar freios.',
          criado_em: '2024-11-08T10:30:00.000Z',
          atualizado_em: '2024-11-08T14:00:00.000Z',
          clientes: {
            id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
            nome: 'João da Silva',
            telefone: '(11) 99999-1234',
          },
          veiculos: {
            id: 'b2c3d4e5-f6a7-8901-bcde-f12345678901',
            placa: 'ABC-1234',
            marca: 'Volkswagen',
            modelo: 'Gol 1.0',
          },
        },
      },

      Erro400: {
        type: 'object',
        properties: {
          erro: {
            type: 'string',
            description: 'Descrição do erro de validação',
            example: 'nome é obrigatório.',
          },
        },
        example: { erro: 'nome é obrigatório.' },
      },

      Erro404: {
        type: 'object',
        properties: {
          erro: {
            type: 'string',
            description: 'Recurso solicitado não encontrado',
            example: 'Cliente não encontrado.',
          },
        },
        example: { erro: 'Cliente não encontrado.' },
      },

      Erro409: {
        type: 'object',
        properties: {
          erro: {
            type: 'string',
            description: 'Conflito — violação de restrição de unicidade',
            example: 'duplicate key value violates unique constraint',
          },
        },
        example: { erro: 'duplicate key value violates unique constraint' },
      },

      Erro500: {
        type: 'object',
        properties: {
          erro: {
            type: 'string',
            description: 'Mensagem de erro interno do servidor',
            example: 'Erro inesperado',
          },
        },
        example: { erro: 'Erro inesperado' },
      },

      HealthResponse: {
        type: 'object',
        properties: {
          status: {
            type: 'string',
            description: 'Estado da API',
            example: 'ok',
          },
        },
        example: { status: 'ok' },
      },
    },

    parameters: {
      UuidId: {
        name: 'id',
        in: 'path',
        required: true,
        schema: {
          type: 'string',
          format: 'uuid',
        },
        description: 'Identificador único do recurso no formato UUID v4',
        example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
      },
    },

    responses: {
      BadRequest: {
        description: '**400 Bad Request** — Dados inválidos ou ausentes',
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/Erro400' },
          },
        },
      },
      NotFound: {
        description: '**404 Not Found** — Recurso não encontrado',
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/Erro404' },
          },
        },
      },
      Conflict: {
        description: '**409 Conflict** — Violação de unicidade no banco de dados',
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/Erro409' },
          },
        },
      },
      InternalError: {
        description: '**500 Internal Server Error** — Erro inesperado no servidor',
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/Erro500' },
          },
        },
      },
    },
  },

  paths: {
    '/api/health': {
      get: {
        tags: ['Health'],
        summary: 'Verificação de saúde da API',
        description: 'Endpoint simples para verificar se a API está online e respondendo. Útil para monitoramento e healthchecks de infraestrutura.',
        operationId: 'getHealth',
        responses: {
          200: {
            description: '**200 OK** — API funcionando normalmente',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/HealthResponse' },
              },
            },
          },
        },
      },
    },

    '/api/clientes': {
      get: {
        tags: ['Clientes'],
        summary: 'Listar todos os clientes',
        description: 'Retorna uma lista com **todos os clientes** cadastrados, ordenados por data de criação (mais recentes primeiro).',
        operationId: 'listarClientes',
        responses: {
          200: {
            description: '**200 OK** — Lista de clientes retornada com sucesso',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/Cliente' },
                },
                examples: {
                  comClientes: {
                    summary: 'Lista com clientes cadastrados',
                    value: [
                      {
                        id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
                        nome: 'João da Silva',
                        telefone: '(11) 99999-1234',
                        email: 'joao.silva@email.com',
                        criado_em: '2024-11-08T10:30:00.000Z',
                      },
                      {
                        id: 'd4e5f6a7-b8c9-0123-def0-123456789abc',
                        nome: 'Maria Oliveira',
                        telefone: '(21) 98888-5678',
                        email: null,
                        criado_em: '2024-11-07T08:15:00.000Z',
                      },
                    ],
                  },
                  listaVazia: {
                    summary: 'Nenhum cliente cadastrado',
                    value: [],
                  },
                },
              },
            },
          },
          500: { $ref: '#/components/responses/InternalError' },
        },
      },

      post: {
        tags: ['Clientes'],
        summary: 'Criar novo cliente',
        description: `Cria um **novo cliente** no sistema.

**Campos obrigatórios:** \`nome\`, \`telefone\`

**Campo opcional:** \`email\` — Se não informado, será armazenado como \`null\`.`,
        operationId: 'criarCliente',
        requestBody: {
          required: true,
          description: 'Dados do cliente a ser criado',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ClienteInput' },
              examples: {
                completo: {
                  summary: 'Cliente com todos os campos',
                  value: {
                    nome: 'João da Silva',
                    telefone: '(11) 99999-1234',
                    email: 'joao.silva@email.com',
                  },
                },
                semEmail: {
                  summary: 'Cliente sem e-mail (mínimo obrigatório)',
                  value: {
                    nome: 'Maria Oliveira',
                    telefone: '(21) 98888-5678',
                  },
                },
              },
            },
          },
        },
        responses: {
          201: {
            description: '**201 Created** — Cliente criado com sucesso',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Cliente' },
                example: {
                  id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
                  nome: 'João da Silva',
                  telefone: '(11) 99999-1234',
                  email: 'joao.silva@email.com',
                  criado_em: '2024-11-08T10:30:00.000Z',
                },
              },
            },
          },
          400: { $ref: '#/components/responses/BadRequest' },
          500: { $ref: '#/components/responses/InternalError' },
        },
      },
    },

    '/api/clientes/{id}': {
      get: {
        tags: ['Clientes'],
        summary: 'Buscar cliente por ID',
        description: 'Retorna os dados de um **cliente específico** pelo seu UUID.',
        operationId: 'buscarClientePorId',
        parameters: [{ $ref: '#/components/parameters/UuidId' }],
        responses: {
          200: {
            description: '**200 OK** — Cliente encontrado',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Cliente' },
              },
            },
          },
          400: { $ref: '#/components/responses/BadRequest' },
          404: { $ref: '#/components/responses/NotFound' },
          500: { $ref: '#/components/responses/InternalError' },
        },
      },

      put: {
        tags: ['Clientes'],
        summary: 'Atualizar cliente',
        description: `Atualiza **todos os dados** de um cliente existente (substituição completa).

> ⚠️ **Atenção:** Esta operação é uma **substituição completa** (PUT). Todos os campos serão sobrescritos com os valores enviados.`,
        operationId: 'atualizarCliente',
        parameters: [{ $ref: '#/components/parameters/UuidId' }],
        requestBody: {
          required: true,
          description: 'Dados atualizados do cliente',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ClienteInput' },
              example: {
                nome: 'João da Silva Atualizado',
                telefone: '(11) 97777-9999',
                email: 'joao.novo@email.com',
              },
            },
          },
        },
        responses: {
          200: {
            description: '**200 OK** — Cliente atualizado com sucesso',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Cliente' },
              },
            },
          },
          400: { $ref: '#/components/responses/BadRequest' },
          404: { $ref: '#/components/responses/NotFound' },
          500: { $ref: '#/components/responses/InternalError' },
        },
      },

      delete: {
        tags: ['Clientes'],
        summary: 'Remover cliente',
        description: `Remove um cliente do sistema pelo seu UUID.

> ⚠️ **Atenção:** A exclusão é **permanente** e, por conta das regras de **cascata do banco de dados** (\`ON DELETE CASCADE\`), todos os **veículos** associados a este cliente também serão excluídos.`,
        operationId: 'removerCliente',
        parameters: [{ $ref: '#/components/parameters/UuidId' }],
        responses: {
          200: {
            description: '**200 OK** — Cliente removido com sucesso (retorna o registro excluído)',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Cliente' },
              },
            },
          },
          400: { $ref: '#/components/responses/BadRequest' },
          404: { $ref: '#/components/responses/NotFound' },
          500: { $ref: '#/components/responses/InternalError' },
        },
      },
    },

    '/api/veiculos': {
      get: {
        tags: ['Veículos'],
        summary: 'Listar veículos',
        description: `Retorna uma lista de veículos cadastrados, ordenados por data de criação (mais recentes primeiro).

**Filtro opcional:** Use o parâmetro \`cliente_id\` para listar apenas os veículos de um cliente específico.`,
        operationId: 'listarVeiculos',
        parameters: [
          {
            name: 'cliente_id',
            in: 'query',
            required: false,
            schema: {
              type: 'string',
              format: 'uuid',
            },
            description: 'Filtra os veículos pelo UUID do cliente proprietário',
            example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
          },
        ],
        responses: {
          200: {
            description: '**200 OK** — Lista de veículos retornada com sucesso',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/Veiculo' },
                },
                examples: {
                  todosVeiculos: {
                    summary: 'Todos os veículos',
                    value: [
                      {
                        id: 'b2c3d4e5-f6a7-8901-bcde-f12345678901',
                        cliente_id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
                        placa: 'ABC-1234',
                        marca: 'Volkswagen',
                        modelo: 'Gol 1.0',
                        ano: 2020,
                        criado_em: '2024-11-08T10:30:00.000Z',
                      },
                    ],
                  },
                  listaVazia: {
                    summary: 'Nenhum veículo encontrado',
                    value: [],
                  },
                },
              },
            },
          },
          400: { $ref: '#/components/responses/BadRequest' },
          500: { $ref: '#/components/responses/InternalError' },
        },
      },

      post: {
        tags: ['Veículos'],
        summary: 'Cadastrar novo veículo',
        description: `Cadastra um **novo veículo** vinculado a um cliente existente.

**Campos obrigatórios:** \`cliente_id\`, \`placa\`, \`marca\`, \`modelo\`

**Campo opcional:** \`ano\` — Deve ser um inteiro entre 1886 e o ano atual + 1.`,
        operationId: 'criarVeiculo',
        requestBody: {
          required: true,
          description: 'Dados do veículo a ser cadastrado',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/VeiculoInput' },
              examples: {
                completo: {
                  summary: 'Veículo com todos os campos',
                  value: {
                    cliente_id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
                    placa: 'ABC-1234',
                    marca: 'Volkswagen',
                    modelo: 'Gol 1.0',
                    ano: 2020,
                  },
                },
                semAno: {
                  summary: 'Veículo sem ano de fabricação',
                  value: {
                    cliente_id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
                    placa: 'XYZ-9876',
                    marca: 'Fiat',
                    modelo: 'Uno',
                  },
                },
              },
            },
          },
        },
        responses: {
          201: {
            description: '**201 Created** — Veículo cadastrado com sucesso',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Veiculo' },
              },
            },
          },
          400: { $ref: '#/components/responses/BadRequest' },
          409: { $ref: '#/components/responses/Conflict' },
          500: { $ref: '#/components/responses/InternalError' },
        },
      },
    },

    '/api/veiculos/{id}': {
      get: {
        tags: ['Veículos'],
        summary: 'Buscar veículo por ID',
        description: 'Retorna os dados de um **veículo específico** pelo seu UUID.',
        operationId: 'buscarVeiculoPorId',
        parameters: [{ $ref: '#/components/parameters/UuidId' }],
        responses: {
          200: {
            description: '**200 OK** — Veículo encontrado',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Veiculo' },
              },
            },
          },
          400: { $ref: '#/components/responses/BadRequest' },
          404: { $ref: '#/components/responses/NotFound' },
          500: { $ref: '#/components/responses/InternalError' },
        },
      },

      put: {
        tags: ['Veículos'],
        summary: 'Atualizar veículo',
        description: 'Atualiza **todos os dados** de um veículo existente (substituição completa).',
        operationId: 'atualizarVeiculo',
        parameters: [{ $ref: '#/components/parameters/UuidId' }],
        requestBody: {
          required: true,
          description: 'Dados atualizados do veículo',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/VeiculoInput' },
              example: {
                cliente_id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
                placa: 'ABC-1234',
                marca: 'Volkswagen',
                modelo: 'Gol 1.6',
                ano: 2021,
              },
            },
          },
        },
        responses: {
          200: {
            description: '**200 OK** — Veículo atualizado com sucesso',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Veiculo' },
              },
            },
          },
          400: { $ref: '#/components/responses/BadRequest' },
          404: { $ref: '#/components/responses/NotFound' },
          409: { $ref: '#/components/responses/Conflict' },
          500: { $ref: '#/components/responses/InternalError' },
        },
      },

      delete: {
        tags: ['Veículos'],
        summary: 'Remover veículo',
        description: 'Remove um veículo do sistema pelo seu UUID. A exclusão é permanente.',
        operationId: 'removerVeiculo',
        parameters: [{ $ref: '#/components/parameters/UuidId' }],
        responses: {
          200: {
            description: '**200 OK** — Veículo removido com sucesso (retorna o registro excluído)',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Veiculo' },
              },
            },
          },
          400: { $ref: '#/components/responses/BadRequest' },
          404: { $ref: '#/components/responses/NotFound' },
          500: { $ref: '#/components/responses/InternalError' },
        },
      },
    },

    '/api/ordens-servico': {
      get: {
        tags: ['Ordens de Serviço'],
        summary: 'Listar todas as ordens de serviço',
        description: `Retorna uma lista com **todas as ordens de serviço**, ordenadas por data de criação (mais recentes primeiro).

A resposta inclui dados relacionados por **JOIN automático**:
- Dados do cliente (\`clientes\`)
- Dados do veículo (\`veiculos\`)`,
        operationId: 'listarOrdensServico',
        responses: {
          200: {
            description: '**200 OK** — Lista de ordens de serviço retornada com sucesso',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/OrdemServico' },
                },
                examples: {
                  comOrdens: {
                    summary: 'Lista com ordens de serviço',
                    value: [
                      {
                        id: 'c3d4e5f6-a7b8-9012-cdef-123456789012',
                        cliente_id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
                        veiculo_id: 'b2c3d4e5-f6a7-8901-bcde-f12345678901',
                        status: 'em_execucao',
                        descricao: 'Troca de óleo e filtro de ar',
                        criado_em: '2024-11-08T10:30:00.000Z',
                        atualizado_em: '2024-11-08T14:00:00.000Z',
                        clientes: {
                          id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
                          nome: 'João da Silva',
                          telefone: '(11) 99999-1234',
                        },
                        veiculos: {
                          id: 'b2c3d4e5-f6a7-8901-bcde-f12345678901',
                          placa: 'ABC-1234',
                          marca: 'Volkswagen',
                          modelo: 'Gol 1.0',
                        },
                      },
                    ],
                  },
                  listaVazia: {
                    summary: 'Nenhuma ordem cadastrada',
                    value: [],
                  },
                },
              },
            },
          },
          500: { $ref: '#/components/responses/InternalError' },
        },
      },

      post: {
        tags: ['Ordens de Serviço'],
        summary: 'Criar nova ordem de serviço',
        description: `Cria uma **nova ordem de serviço** vinculada a um cliente e veículo existentes.

**Campos obrigatórios:** \`cliente_id\`, \`veiculo_id\`

**Campos opcionais:** \`descricao\`, \`status\`

> 💡 **Dica:** Se o campo \`status\` não for enviado, o valor padrão será \`"aberta"\`.`,
        operationId: 'criarOrdemServico',
        requestBody: {
          required: true,
          description: 'Dados da ordem de serviço a ser criada',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/OrdemServicoInput' },
              examples: {
                minimo: {
                  summary: 'Dados mínimos (status padrão: aberta)',
                  value: {
                    cliente_id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
                    veiculo_id: 'b2c3d4e5-f6a7-8901-bcde-f12345678901',
                  },
                },
                completo: {
                  summary: 'Ordem completa com descrição e status',
                  value: {
                    cliente_id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
                    veiculo_id: 'b2c3d4e5-f6a7-8901-bcde-f12345678901',
                    descricao: 'Troca de óleo e filtro de ar. Verificar freios.',
                    status: 'diagnostico',
                  },
                },
              },
            },
          },
        },
        responses: {
          201: {
            description: '**201 Created** — Ordem de serviço criada com sucesso',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/OrdemServico' },
              },
            },
          },
          400: { $ref: '#/components/responses/BadRequest' },
          500: { $ref: '#/components/responses/InternalError' },
        },
      },
    },

    '/api/ordens-servico/{id}': {
      get: {
        tags: ['Ordens de Serviço'],
        summary: 'Buscar ordem de serviço por ID',
        description: 'Retorna os dados de uma **ordem de serviço específica** com dados do cliente e veículo relacionados.',
        operationId: 'buscarOrdemServicoPorId',
        parameters: [{ $ref: '#/components/parameters/UuidId' }],
        responses: {
          200: {
            description: '**200 OK** — Ordem de serviço encontrada',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/OrdemServico' },
              },
            },
          },
          400: { $ref: '#/components/responses/BadRequest' },
          404: { $ref: '#/components/responses/NotFound' },
          500: { $ref: '#/components/responses/InternalError' },
        },
      },

      put: {
        tags: ['Ordens de Serviço'],
        summary: 'Atualizar ordem de serviço',
        description: `Atualiza **todos os dados** de uma ordem de serviço (substituição completa).

> ⚠️ **Atenção:** No método **PUT**, o campo \`status\` é **obrigatório**, diferentemente do POST onde é opcional.`,
        operationId: 'atualizarOrdemServico',
        parameters: [{ $ref: '#/components/parameters/UuidId' }],
        requestBody: {
          required: true,
          description: 'Dados atualizados da ordem de serviço (status obrigatório)',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/OrdemServicoUpdateInput' },
              example: {
                cliente_id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
                veiculo_id: 'b2c3d4e5-f6a7-8901-bcde-f12345678901',
                descricao: 'Troca de óleo, filtro de ar e alinhamento.',
                status: 'em_execucao',
              },
            },
          },
        },
        responses: {
          200: {
            description: '**200 OK** — Ordem de serviço atualizada com sucesso',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/OrdemServico' },
              },
            },
          },
          400: { $ref: '#/components/responses/BadRequest' },
          404: { $ref: '#/components/responses/NotFound' },
          500: { $ref: '#/components/responses/InternalError' },
        },
      },

      delete: {
        tags: ['Ordens de Serviço'],
        summary: 'Remover ordem de serviço',
        description: 'Remove uma ordem de serviço do sistema pelo seu UUID. A exclusão é permanente.',
        operationId: 'removerOrdemServico',
        parameters: [{ $ref: '#/components/parameters/UuidId' }],
        responses: {
          200: {
            description: '**200 OK** — Ordem de serviço removida com sucesso (retorna o registro excluído)',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/OrdemServico' },
              },
            },
          },
          400: { $ref: '#/components/responses/BadRequest' },
          404: { $ref: '#/components/responses/NotFound' },
          500: { $ref: '#/components/responses/InternalError' },
        },
      },
    },

    '/api/ordens-servico/{id}/status': {
      patch: {
        tags: ['Ordens de Serviço'],
        summary: 'Atualizar status da ordem de serviço',
        description: `Atualiza **apenas o status** de uma ordem de serviço sem modificar os demais campos.

Este endpoint é o método preferencial para **avançar o fluxo** de uma ordem de serviço.

**Fluxo de status recomendado:**
\`\`\`
aberta → diagnostico → orcamento_pendente → aprovada → em_execucao → finalizada
                                           ↘ nao_aprovada
\`\`\`

| Status | Significado |
|---|---|
| \`aberta\` | Ordem recém-criada |
| \`diagnostico\` | Em diagnóstico técnico |
| \`orcamento_pendente\` | Aguardando aprovação do cliente |
| \`aprovada\` | Orçamento aprovado |
| \`nao_aprovada\` | Orçamento recusado |
| \`em_execucao\` | Serviço em andamento |
| \`finalizada\` | Serviço concluído |`,
        operationId: 'atualizarStatusOrdemServico',
        parameters: [{ $ref: '#/components/parameters/UuidId' }],
        requestBody: {
          required: true,
          description: 'Novo status para a ordem de serviço',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/StatusInput' },
              examples: {
                diagnostico: {
                  summary: 'Iniciar diagnóstico',
                  value: { status: 'diagnostico' },
                },
                orcamentoPendente: {
                  summary: 'Enviar orçamento para aprovação',
                  value: { status: 'orcamento_pendente' },
                },
                aprovada: {
                  summary: 'Aprovar orçamento',
                  value: { status: 'aprovada' },
                },
                naoAprovada: {
                  summary: 'Recusar orçamento',
                  value: { status: 'nao_aprovada' },
                },
                emExecucao: {
                  summary: 'Iniciar execução do serviço',
                  value: { status: 'em_execucao' },
                },
                finalizada: {
                  summary: 'Finalizar serviço',
                  value: { status: 'finalizada' },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: '**200 OK** — Status atualizado com sucesso',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/OrdemServico' },
                example: {
                  id: 'c3d4e5f6-a7b8-9012-cdef-123456789012',
                  cliente_id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
                  veiculo_id: 'b2c3d4e5-f6a7-8901-bcde-f12345678901',
                  status: 'aprovada',
                  descricao: 'Troca de óleo e filtro de ar',
                  criado_em: '2024-11-08T10:30:00.000Z',
                  atualizado_em: '2024-11-08T16:00:00.000Z',
                  clientes: {
                    id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
                    nome: 'João da Silva',
                    telefone: '(11) 99999-1234',
                  },
                  veiculos: {
                    id: 'b2c3d4e5-f6a7-8901-bcde-f12345678901',
                    placa: 'ABC-1234',
                    marca: 'Volkswagen',
                    modelo: 'Gol 1.0',
                  },
                },
              },
            },
          },
          400: { $ref: '#/components/responses/BadRequest' },
          404: { $ref: '#/components/responses/NotFound' },
          500: { $ref: '#/components/responses/InternalError' },
        },
      },
    },
  },
};

module.exports = swaggerDefinition;
