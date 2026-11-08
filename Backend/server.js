require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');
const swaggerUi = require('swagger-ui-express');
const swaggerDefinition = require('./swagger/openapi');
const clientesModel = require('./models/clientesModel');
const veiculosModel = require('./models/veiculosModel');
const ordensServicoModel = require('./models/ordensServicoModel');

const app = express();
app.use(cors());
app.use(express.json());

// Doc Swagger UI
const swaggerUiOptions = {
  customSiteTitle: 'API Oficina Mecânica — Docs',
  customCss: `
    .swagger-ui .topbar { background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%); }
    .swagger-ui .topbar .download-url-wrapper { display: none; }
    .swagger-ui .info .title { color: #e94560; }
    .swagger-ui .info { margin: 30px 0; }
    .swagger-ui .opblock.opblock-get .opblock-summary-method { background: #2196f3; }
    .swagger-ui .opblock.opblock-post .opblock-summary-method { background: #4caf50; }
    .swagger-ui .opblock.opblock-put .opblock-summary-method { background: #ff9800; }
    .swagger-ui .opblock.opblock-patch .opblock-summary-method { background: #9c27b0; }
    .swagger-ui .opblock.opblock-delete .opblock-summary-method { background: #f44336; }
    .swagger-ui .btn.execute { background: #e94560; border-color: #e94560; }
    .swagger-ui .btn.execute:hover { background: #c73652; border-color: #c73652; }
  `,
  customfavIcon: 'https://cdn.jsdelivr.net/npm/emoji-favicon-toolkit@1.0.0/dist/favicon.ico',
  swaggerOptions: {
    defaultModelsExpandDepth: 1,
    defaultModelExpandDepth: 2,
    docExpansion: 'list',
    filter: true,
    showExtensions: true,
    showCommonExtensions: true,
    tryItOutEnabled: true,
  },
};
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDefinition, swaggerUiOptions));

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

clientesModel.setSupabase(supabase);
veiculosModel.setSupabase(supabase);
ordensServicoModel.setSupabase(supabase);

function asyncRoute(handler) {
  return (req, res, next) => {
    Promise.resolve(handler(req, res, next)).catch(next);
  };
}

app.post('/api/clientes', asyncRoute(async (req, res) => {
  const cliente = await clientesModel.create(req.body);
  res.status(201).json(cliente);
}));

app.get('/api/clientes', asyncRoute(async (_req, res) => {
  res.json(await clientesModel.list());
}));

app.get('/api/clientes/:id', asyncRoute(async (req, res) => {
  res.json(await clientesModel.findById(req.params.id));
}));

app.put('/api/clientes/:id', asyncRoute(async (req, res) => {
  res.json(await clientesModel.update(req.params.id, req.body));
}));

app.delete('/api/clientes/:id', asyncRoute(async (req, res) => {
  res.json(await clientesModel.remove(req.params.id));
}));

app.post('/api/veiculos', asyncRoute(async (req, res) => {
  const veiculo = await veiculosModel.create(req.body);
  res.status(201).json(veiculo);
}));

app.get('/api/veiculos', asyncRoute(async (req, res) => {
  res.json(await veiculosModel.list(req.query.cliente_id));
}));

app.get('/api/veiculos/:id', asyncRoute(async (req, res) => {
  res.json(await veiculosModel.findById(req.params.id));
}));

app.put('/api/veiculos/:id', asyncRoute(async (req, res) => {
  res.json(await veiculosModel.update(req.params.id, req.body));
}));

app.delete('/api/veiculos/:id', asyncRoute(async (req, res) => {
  res.json(await veiculosModel.remove(req.params.id));
}));

app.post('/api/ordens-servico', asyncRoute(async (req, res) => {
  const ordem = await ordensServicoModel.create(req.body);
  res.status(201).json(ordem);
}));

app.get('/api/ordens-servico', asyncRoute(async (_req, res) => {
  res.json(await ordensServicoModel.list());
}));

app.get('/api/ordens-servico/:id', asyncRoute(async (req, res) => {
  res.json(await ordensServicoModel.findById(req.params.id));
}));

app.put('/api/ordens-servico/:id', asyncRoute(async (req, res) => {
  res.json(await ordensServicoModel.update(req.params.id, req.body));
}));

app.delete('/api/ordens-servico/:id', asyncRoute(async (req, res) => {
  res.json(await ordensServicoModel.remove(req.params.id));
}));

app.patch('/api/ordens-servico/:id/status', asyncRoute(async (req, res) => {
  res.json(await ordensServicoModel.updateStatus(req.params.id, req.body));
}));

app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));

app.use((error, _req, res, _next) => {
  console.error(error);
  const status = error.status
    || (error.code === '23505' ? 409 : error.code === '23503' ? 400 : 500);
  res.status(status).json({ erro: error.message || 'Erro inesperado' });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`\n🔧  Oficina Mecânica — API REST`);
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
  console.log(`🚀  Servidor:    http://localhost:${PORT}`);
  console.log(`📚  Swagger UI:  http://localhost:${PORT}/api-docs`);
  console.log(`💚  Health:      http://localhost:${PORT}/api/health`);
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`);
});
