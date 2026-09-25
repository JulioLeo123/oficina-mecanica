require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');

const app = express();
app.use(cors());
app.use(express.json());

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

// resposta de erro
function handleError(res, error, status = 400) {
  console.error(error);
  return res.status(status).json({ erro: error.message || 'Erro inesperado' });
}

// criar cliente
app.post('/api/clientes', async (req, res) => {
  const { nome, telefone, email } = req.body;
  if (!nome || !telefone) {
    return res.status(400).json({ erro: 'Nome e telefone são obrigatórios' });
  }

  const { data, error } = await supabase
    .from('clientes')
    .insert([{ nome, telefone, email }])
    .select()
    .single();

  if (error) return handleError(res, error);
  res.status(201).json(data);
});

// Listar clientes
app.get('/api/clientes', async (req, res) => {
  const { data, error } = await supabase
    .from('clientes')
    .select('*')
    .order('criado_em', { ascending: false });

  if (error) return handleError(res, error);
  res.json(data);
});

// Criar veículo vinculado a um cliente
app.post('/api/veiculos', async (req, res) => {
  const { cliente_id, placa, marca, modelo, ano } = req.body;
  if (!cliente_id || !placa || !marca || !modelo) {
    return res.status(400).json({
      erro: 'cliente_id, placa, marca e modelo são obrigatórios',
    });
  }

  const { data, error } = await supabase
    .from('veiculos')
    .insert([{ cliente_id, placa, marca, modelo, ano }])
    .select()
    .single();

  if (error) return handleError(res, error);
  res.status(201).json(data);
});

// Listar veículos
app.get('/api/veiculos', async (req, res) => {
  const { cliente_id } = req.query;

  let query = supabase.from('veiculos').select('*').order('criado_em', { ascending: false });
  if (cliente_id) query = query.eq('cliente_id', cliente_id);

  const { data, error } = await query;
  if (error) return handleError(res, error);
  res.json(data);
});

// criar OS vinculado cliente + veiculo
app.post('/api/ordens-servico', async (req, res) => {
  const { cliente_id, veiculo_id, descricao } = req.body;
  if (!cliente_id || !veiculo_id) {
    return res.status(400).json({ erro: 'cliente_id e veiculo_id são obrigatórios' });
  }

  const { data, error } = await supabase
    .from('ordens_servico')
    .insert([{ cliente_id, veiculo_id, descricao, status: 'aberta' }])
    .select()
    .single();

  if (error) return handleError(res, error);
  res.status(201).json(data);
});

// listar os
app.get('/api/ordens-servico', async (req, res) => {
  const { data, error } = await supabase
    .from('ordens_servico')
    .select(`
      id,
      status,
      descricao,
      criado_em,
      clientes ( id, nome, telefone ),
      veiculos ( id, placa, marca, modelo )
    `)
    .order('criado_em', { ascending: false });

  if (error) return handleError(res, error);
  res.json(data);
});

// atualizar status 
app.patch('/api/ordens-servico/:id/status', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const statusValidos = [
    'aberta', 'diagnostico', 'orcamento_pendente',
    'aprovada', 'nao_aprovada', 'em_execucao', 'finalizada',
  ];
  if (!statusValidos.includes(status)) {
    return res.status(400).json({ erro: 'status inválido' });
  }

  const { data, error } = await supabase
    .from('ordens_servico')
    .update({ status })
    .eq('id', id)
    .select()
    .single();

  if (error) return handleError(res, error);
  res.json(data);
});

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
