const { execute } = require('./query');

function createClientesDao(supabase) {
  return {
    findAll() {
      return execute(
        supabase.from('clientes').select('*').order('criado_em', { ascending: false })
      );
    },

    findById(id) {
      return execute(supabase.from('clientes').select('*').eq('id', id).maybeSingle());
    },

    create(cliente) {
      return execute(supabase.from('clientes').insert([cliente]).select().single());
    },

    update(id, cliente) {
      return execute(
        supabase.from('clientes').update(cliente).eq('id', id).select().maybeSingle()
      );
    },

    remove(id) {
      return execute(
        supabase.from('clientes').delete().eq('id', id).select().maybeSingle()
      );
    },
  };
}

module.exports = { createClientesDao };
