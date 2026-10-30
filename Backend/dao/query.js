async function execute(query) {
  const { data, error } = await query;
  if (error) throw error;
  return data;
}

module.exports = { execute };
