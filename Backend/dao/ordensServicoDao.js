const { execute } = require('./query');

const selectComRelacionamentos = `
  id,
  cliente_id,
  veiculo_id,
  status,
  descricao,
  criado_em,
  atualizado_em,
  clientes ( id, nome, telefone ),
  veiculos ( id, placa, marca, modelo )
`;

function createOrdensServicoDao(supabase) {
  return {
    findAll() {
      return execute(
        supabase
          .from('ordens_servico')
          .select(selectComRelacionamentos)
          .order('criado_em', { ascending: false })
      );
    },

    findById(id) {
      return execute(
        supabase
          .from('ordens_servico')
          .select(selectComRelacionamentos)
          .eq('id', id)
          .maybeSingle()
      );
    },

    create(ordem) {
      return execute(
        supabase.from('ordens_servico').insert([ordem]).select(selectComRelacionamentos).single()
      );
    },

    update(id, ordem) {
      return execute(
        supabase
          .from('ordens_servico')
          .update(ordem)
          .eq('id', id)
          .select(selectComRelacionamentos)
          .maybeSingle()
      );
    },

    updateStatus(id, status) {
      return execute(
        supabase
          .from('ordens_servico')
          .update({ status })
          .eq('id', id)
          .select(selectComRelacionamentos)
          .maybeSingle()
      );
    },

    remove(id) {
      return execute(
        supabase
          .from('ordens_servico')
          .delete()
          .eq('id', id)
          .select('*')
          .maybeSingle()
      );
    },
  };
}

module.exports = { createOrdensServicoDao };
