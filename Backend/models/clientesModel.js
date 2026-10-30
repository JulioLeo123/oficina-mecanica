const { createClientesDao } = require('../dao/clientesDao');
const {
  assertObject,
  requiredText,
  optionalText,
  validateId,
  requireFound,
} = require('./validation');

let dao;

function getDao() {
  if (!dao) throw new Error('DAO de clientes não foi configurado.');
  return dao;
}

function setSupabase(supabase) {
  dao = createClientesDao(supabase);
}

function dadosCliente(input) {
  const body = assertObject(input);
  return {
    nome: requiredText(body.nome, 'nome'),
    telefone: requiredText(body.telefone, 'telefone'),
    email: optionalText(body.email, 'email'),
  };
}

async function list() {
  return getDao().findAll();
}

async function findById(id) {
  return requireFound(getDao().findById(validateId(id)), 'Cliente');
}

async function create(input) {
  return getDao().create(dadosCliente(input));
}

async function update(id, input) {
  return requireFound(getDao().update(validateId(id), dadosCliente(input)), 'Cliente');
}

async function remove(id) {
  return requireFound(getDao().remove(validateId(id)), 'Cliente');
}

module.exports = { setSupabase, list, findById, create, update, remove };
