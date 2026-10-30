const { execute } = require('./query');

function createVeiculosDao(supabase) {
  return {
    findAll(clienteId) {
      let query = supabase
        .from('veiculos')
        .select('*')
        .order('criado_em', { ascending: false });

      if (clienteId) query = query.eq('cliente_id', clienteId);
      return execute(query);
    },

    findById(id) {
      return execute(supabase.from('veiculos').select('*').eq('id', id).maybeSingle());
    },

    create(veiculo) {
      return execute(supabase.from('veiculos').insert([veiculo]).select().single());
    },

    update(id, veiculo) {
      return execute(
        supabase.from('veiculos').update(veiculo).eq('id', id).select().maybeSingle()
      );
    },

    remove(id) {
      return execute(
        supabase.from('veiculos').delete().eq('id', id).select().maybeSingle()
      );
    },
  };
}

module.exports = { createVeiculosDao };
