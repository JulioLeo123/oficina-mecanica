const { createOrdensServicoDao } = require('../dao/ordensServicoDao');
const {
  ApiError,
  assertObject,
  requiredText,
  optionalText,
  validateId,
  requireFound,
} = require('./validation');

const statusValidos = [
  'aberta',
  'diagnostico',
  'orcamento_pendente',
  'aprovada',
  'nao_aprovada',
  'em_execucao',
  'finalizada',
];

let dao;

function getDao() {
  if (!dao) throw new Error('DAO de ordens de serviço não foi configurado.');
  return dao;
}

function setSupabase(supabase) {
  dao = createOrdensServicoDao(supabase);
}

function dadosOrdem(input, incluirStatusObrigatorio) {
  const body = assertObject(input);
  const dados = {
    cliente_id: validateId(body.cliente_id),
    veiculo_id: validateId(body.veiculo_id),
    descricao: optionalText(body.descricao, 'descricao'),
  };

  if (incluirStatusObrigatorio || body.status !== undefined) {
    const status = incluirStatusObrigatorio
      ? requiredText(body.status, 'status')
      : body.status;
    if (!statusValidos.includes(status)) throw new ApiError('status inválido.');
    dados.status = status;
  } else {
    dados.status = 'aberta';
  }

  return dados;
}

async function list() {
  return getDao().findAll();
}

async function findById(id) {
  return requireFound(getDao().findById(validateId(id)), 'Ordem de serviço');
}

async function create(input) {
  return getDao().create(dadosOrdem(input, false));
}

async function update(id, input) {
  return requireFound(
    getDao().update(validateId(id), dadosOrdem(input, true)),
    'Ordem de serviço'
  );
}

async function updateStatus(id, input) {
  const body = assertObject(input);
  const status = requiredText(body.status, 'status');
  if (!statusValidos.includes(status)) throw new ApiError('status inválido.');

  return requireFound(
    getDao().updateStatus(validateId(id), status),
    'Ordem de serviço'
  );
}

async function remove(id) {
  return requireFound(getDao().remove(validateId(id)), 'Ordem de serviço');
}

module.exports = {
  setSupabase,
  list,
  findById,
  create,
  update,
  updateStatus,
  remove,
};
