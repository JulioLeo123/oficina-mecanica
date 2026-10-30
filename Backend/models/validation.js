class ApiError extends Error {
  constructor(message, status = 400) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

function assertObject(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    throw new ApiError('O corpo da requisição deve ser um objeto JSON.');
  }
  return value;
}

function requiredText(value, field) {
  if (typeof value !== 'string' || !value.trim()) {
    throw new ApiError(`${field} é obrigatório.`);
  }
  return value.trim();
}

function optionalText(value, field) {
  if (value === undefined || value === null || value === '') return null;
  if (typeof value !== 'string') throw new ApiError(`${field} deve ser um texto.`);
  return value.trim() || null;
}

function validateId(id) {
  const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (typeof id !== 'string' || !uuidPattern.test(id)) {
    throw new ApiError('ID inválido.');
  }
  return id;
}

function validateYear(value) {
  if (value === undefined || value === null || value === '') return null;
  const year = Number(value);
  if (!Number.isInteger(year) || year < 1886 || year > new Date().getFullYear() + 1) {
    throw new ApiError('ano deve ser um ano válido.');
  }
  return year;
}

function notFound(resource) {
  throw new ApiError(`${resource} não encontrado.`, 404);
}

async function requireFound(promise, resource) {
  const record = await promise;
  if (!record) notFound(resource);
  return record;
}

module.exports = {
  ApiError,
  assertObject,
  requiredText,
  optionalText,
  validateId,
  validateYear,
  requireFound,
};
