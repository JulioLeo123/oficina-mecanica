# Documentação da API

API REST para cadastro de clientes, veículos e ordens de serviço da oficina.

## Acesso e formato

- URL local padrão: `http://localhost:3001/api`
- Formato de entrada e saída: JSON com UTF-8.
- Para enviar um corpo, use `Content-Type: application/json`.
- A API não exige autenticação nas rotas implementadas.
- Os IDs são UUIDs gerados pelo banco. Datas são retornadas em formato ISO 8601.

Configure `SUPABASE_URL`, `SUPABASE_KEY` e, opcionalmente, `PORT` no ambiente do backend. O valor padrão da porta é `3001`.

## Rotas

| Método | Caminho | Descrição | Sucesso |
| --- | --- | --- | --- |
| `GET` | `/health` | Verifica se a API está ativa. | `200` |
| `GET` | `/clientes` | Lista clientes, dos mais recentes aos mais antigos. | `200` |
| `POST` | `/clientes` | Cadastra um cliente. | `201` |
| `GET` | `/clientes/{id}` | Busca cliente pelo UUID. | `200` |
| `PUT` | `/clientes/{id}` | Substitui os campos editáveis do cliente. | `200` |
| `DELETE` | `/clientes/{id}` | Remove e retorna o cliente. | `200` |
| `GET` | `/veiculos` | Lista veículos, dos mais recentes aos mais antigos. | `200` |
| `GET` | `/veiculos?cliente_id={uuid}` | Filtra veículos pelo cliente. | `200` |
| `POST` | `/veiculos` | Cadastra um veículo. | `201` |
| `GET` | `/veiculos/{id}` | Busca veículo pelo UUID. | `200` |
| `PUT` | `/veiculos/{id}` | Substitui os campos editáveis do veículo. | `200` |
| `DELETE` | `/veiculos/{id}` | Remove e retorna o veículo. | `200` |
| `GET` | `/ordens-servico` | Lista ordens, das mais recentes às mais antigas, com dados resumidos do cliente e veículo. | `200` |
| `POST` | `/ordens-servico` | Abre uma ordem de serviço. | `201` |
| `GET` | `/ordens-servico/{id}` | Busca ordem pelo UUID, com dados resumidos do cliente e veículo. | `200` |
| `PUT` | `/ordens-servico/{id}` | Substitui os campos editáveis da ordem. | `200` |
| `PATCH` | `/ordens-servico/{id}/status` | Atualiza apenas o status da ordem. | `200` |
| `DELETE` | `/ordens-servico/{id}` | Remove e retorna a ordem. | `200` |

Substitua `{id}` por um UUID. Exemplo: `/clientes/550e8400-e29b-41d4-a716-446655440000`.

## Campos

### Cliente

| Campo | Tipo | Regra |
| --- | --- | --- |
| `id` | UUID | Gerado pelo banco; apenas resposta. |
| `nome` | string | Obrigatório e não pode ser vazio. |
| `telefone` | string | Obrigatório e não pode ser vazio. |
| `email` | string ou `null` | Opcional. O valor vazio é normalizado para `null`. |
| `criado_em` | data/hora | Gerado pelo banco; apenas resposta. |

### Veículo

| Campo | Tipo | Regra |
| --- | --- | --- |
| `id` | UUID | Gerado pelo banco; apenas resposta. |
| `cliente_id` | UUID | Obrigatório; deve referenciar um cliente existente. |
| `placa` | string | Obrigatório e não pode ser vazio. |
| `marca` | string | Obrigatório e não pode ser vazio. |
| `modelo` | string | Obrigatório e não pode ser vazio. |
| `ano` | inteiro ou `null` | Opcional; entre 1886 e o próximo ano do calendário. |
| `criado_em` | data/hora | Gerado pelo banco; apenas resposta. |

### Ordem de serviço

| Campo | Tipo | Regra |
| --- | --- | --- |
| `id` | UUID | Gerado pelo banco; apenas resposta. |
| `cliente_id` | UUID | Obrigatório; deve referenciar um cliente existente. |
| `veiculo_id` | UUID | Obrigatório; deve referenciar um veículo existente. |
| `descricao` | string ou `null` | Opcional. O valor vazio é normalizado para `null`. |
| `status` | string | Na criação, opcional e assume `aberta` por padrão. Na atualização, obrigatório. |
| `criado_em` | data/hora | Gerado pelo banco; apenas resposta. |
| `atualizado_em` | data/hora | Mantido pelo banco; presente nas respostas de busca/listagem com relações. |
| `clientes` | objeto ou `null` | Nas respostas de listagem/busca/criação/atualização, inclui `id`, `nome` e `telefone`. |
| `veiculos` | objeto ou `null` | Nas respostas de listagem/busca/criação/atualização, inclui `id`, `placa`, `marca` e `modelo`. |

Status aceitos: `aberta`, `diagnostico`, `orcamento_pendente`, `aprovada`, `nao_aprovada`, `em_execucao` e `finalizada`.

## Corpos de requisição

Os endpoints `PUT` exigem todos os campos editáveis da entidade, mesmo quando um campo opcional será enviado como `null`.

### Cliente — `POST /clientes` e `PUT /clientes/{id}`

```json
{
  "nome": "João Silva",
  "telefone": "(11) 99999-9999",
  "email": "joao@email.com"
}
```

Para cliente sem e-mail, envie `"email": null`.

### Veículo — `POST /veiculos` e `PUT /veiculos/{id}`

```json
{
  "cliente_id": "550e8400-e29b-41d4-a716-446655440000",
  "placa": "ABC1D23",
  "marca": "Toyota",
  "modelo": "Corolla",
  "ano": 2020
}
```

`ano` pode ser `null`.

### Ordem — `POST /ordens-servico`

```json
{
  "cliente_id": "550e8400-e29b-41d4-a716-446655440000",
  "veiculo_id": "6ba7b810-9dad-11d1-80b4-00c04fd430c8",
  "descricao": "Barulho na suspensão dianteira"
}
```

O `status` é opcional na criação e começa como `aberta`. Também pode ser enviado explicitamente.

### Ordem — `PUT /ordens-servico/{id}`

```json
{
  "cliente_id": "550e8400-e29b-41d4-a716-446655440000",
  "veiculo_id": "6ba7b810-9dad-11d1-80b4-00c04fd430c8",
  "descricao": "Revisar suspensão dianteira",
  "status": "em_execucao"
}
```

### Atualizar somente o status — `PATCH /ordens-servico/{id}/status`

```json
{
  "status": "em_execucao"
}
```

## Exemplos com cURL

```bash
curl http://localhost:3001/api/health
```

```bash
curl -X POST http://localhost:3001/api/clientes \
  -H 'Content-Type: application/json' \
  -d '{"nome":"João Silva","telefone":"(11) 99999-9999","email":"joao@email.com"}'
```

```bash
curl 'http://localhost:3001/api/veiculos?cliente_id=550e8400-e29b-41d4-a716-446655440000'
```

```bash
curl -X PATCH http://localhost:3001/api/ordens-servico/UUID_DA_ORDEM/status \
  -H 'Content-Type: application/json' \
  -d '{"status":"em_execucao"}'
```

## Respostas e erros

Listas retornam arrays JSON; buscas, criações, atualizações e remoções retornam um objeto JSON. A criação retorna `201`; as demais operações bem-sucedidas retornam `200`.

O endpoint de saúde retorna:

```json
{ "status": "ok" }
```

Erros seguem o formato:

```json
{ "erro": "Mensagem do erro" }
```

| Código | Quando ocorre |
| --- | --- |
| `400` | JSON ou campo inválido, UUID inválido, status não aceito ou referência a cliente/veículo inexistente. |
| `404` | Cliente, veículo ou ordem não encontrado. |
| `409` | Conflito de unicidade, se houver uma restrição `UNIQUE` configurada no banco. O `schema.sql` deste projeto não define restrições desse tipo atualmente. |
| `500` | Erro inesperado no servidor ou na persistência. |

Uma remoção de cliente ou veículo que ainda esteja referenciado por uma ordem de serviço pode falhar por integridade referencial do banco.

## Verificação rápida

Com o backend em execução, solicite `GET http://localhost:3001/api/health`. Para iniciar localmente, configure as variáveis do Supabase em `Backend/.env` e execute `npm run dev` dentro de `Backend`.
