import { useEffect, useState, type FormEvent } from 'react';
import DataList, { type DataColumn } from '../components/DataList';
import FormField from '../components/FormField';
import { criarCliente, getClientes } from '../services/api';
import type { Cliente, Feedback } from '../types';

const initialForm = {
  nome: '',
  telefone: '',
  email: '',
};

export default function Clientes() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<Feedback | null>(null);

  async function loadClientes() {
    try {
      setLoading(true);
      setClientes(await getClientes());
    } catch (err) {
      setFeedback({
        type: 'error',
        text: err instanceof Error ? err.message : 'Erro ao carregar clientes.',
      });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void Promise.resolve().then(loadClientes);
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      setSaving(true);
      await criarCliente({ ...form, email: form.email || null });
      setForm(initialForm);
      setFeedback({ type: 'success', text: 'Cliente cadastrado com sucesso.' });
      await loadClientes();
    } catch (err) {
      setFeedback({
        type: 'error',
        text: err instanceof Error ? err.message : 'Erro ao cadastrar cliente.',
      });
    } finally {
      setSaving(false);
    }
  }

  const columns: DataColumn<Cliente>[] = [
    { key: 'nome', header: 'Nome', render: (cliente) => <strong>{cliente.nome}</strong> },
    { key: 'telefone', header: 'Telefone', render: (cliente) => cliente.telefone },
    { key: 'email', header: 'E-mail', render: (cliente) => cliente.email || 'Nao informado' },
  ];

  return (
    <div className="page">
      <section className="page-header">
        <p className="eyebrow">Cadastro e relacionamento</p>
        <h1>Clientes</h1>
        <p>Registre os proprietarios e mantenha os contatos disponiveis para novas OS.</p>
      </section>

      {feedback && <div className={`feedback ${feedback.type}`}>{feedback.text}</div>}

      <section className="content-panel">
        <div className="section-heading">
          <div>
            <h2>Novo cliente</h2>
            <p>Nome e telefone sao obrigatorios para manter o contrato da API.</p>
          </div>
        </div>

        <form className="form-grid" onSubmit={handleSubmit}>
          <FormField
            id="cliente-nome"
            label="Nome"
            value={form.nome}
            onChange={(event) => setForm((current) => ({ ...current, nome: event.target.value }))}
            required
          />
          <FormField
            id="cliente-telefone"
            label="Telefone"
            value={form.telefone}
            onChange={(event) =>
              setForm((current) => ({ ...current, telefone: event.target.value }))
            }
            required
          />
          <FormField
            id="cliente-email"
            label="E-mail"
            type="email"
            value={form.email}
            onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
          />
          <button className="button primary" type="submit" disabled={saving}>
            {saving ? 'Salvando...' : 'Cadastrar cliente'}
          </button>
        </form>
      </section>

      <section className="content-panel">
        <div className="section-heading">
          <div>
            <h2>Clientes cadastrados</h2>
          </div>
          <span className="panel-count">{clientes.length} registros</span>
        </div>
        <DataList
          columns={columns}
          data={clientes}
          getKey={(cliente) => cliente.id}
          emptyMessage="Nenhum cliente cadastrado ainda."
          loading={loading}
        />
      </section>
    </div>
  );
}
