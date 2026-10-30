const { createVeiculosDao } = require('../dao/veiculosDao');
const {
  assertObject,
  requiredText,
  validateId,
  validateYear,
  requireFound,
} = require('./validation');

let dao;

function getDao() {
  if (!dao) throw new Error('DAO de veículos não foi configurado.');
  return dao;
}

function setSupabase(supabase) {
  dao = createVeiculosDao(supabase);
}

function dadosVeiculo(input) {
  const body = assertObject(input);
  return {
    cliente_id: validateId(body.cliente_id),
    placa: requiredText(body.placa, 'placa'),
    marca: requiredText(body.marca, 'marca'),
    modelo: requiredText(body.modelo, 'modelo'),
    ano: validateYear(body.ano),
  };
}

async function list(clienteId) {
  return getDao().findAll(clienteId ? validateId(clienteId) : undefined);
}

async function findById(id) {
  return requireFound(getDao().findById(validateId(id)), 'Veículo');
}

async function create(input) {
  return getDao().create(dadosVeiculo(input));
}

async function update(id, input) {
  return requireFound(getDao().update(validateId(id), dadosVeiculo(input)), 'Veículo');
}

async function remove(id) {
  return requireFound(getDao().remove(validateId(id)), 'Veículo');
}

module.exports = { setSupabase, list, findById, create, update, remove };
