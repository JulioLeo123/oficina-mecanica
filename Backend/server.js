require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');
const clientesModel = require('./models/clientesModel');
const veiculosModel = require('./models/veiculosModel');
const ordensServicoModel = require('./models/ordensServicoModel');

const app = express();
app.use(cors());
app.use(express.json());

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
  console.log(`Servidor rodando na porta ${PORT}`);
});
