import { useEffect, useMemo, useState, type FormEvent } from 'react';
import DataList, { type DataColumn } from '../components/DataList';
import FormField from '../components/FormField';
import SelectField from '../components/SelectField';
import { criarVeiculo, getClientes, getVeiculos } from '../services/api';
import type { Cliente, Feedback, Veiculo } from '../types';

const initialForm = {
  cliente_id: '',
  placa: '',
  marca: '',
  modelo: '',
  ano: '',
};

export default function Veiculos() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [veiculos, setVeiculos] = useState<Veiculo[]>([]);
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<Feedback | null>(null);

  async function loadData() {
    try {
      setLoading(true);
      const [clientesData, veiculosData] = await Promise.all([getClientes(), getVeiculos()]);
      setClientes(clientesData);
      setVeiculos(veiculosData);
    } catch (err) {
      setFeedback({
        type: 'error',
        text: err instanceof Error ? err.message : 'Erro ao carregar veiculos.',
      });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void Promise.resolve().then(loadData);
  }, []);

  const clientesPorId = useMemo(
    () => new Map(clientes.map((cliente) => [String(cliente.id), cliente.nome])),
    [clientes],
  );

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      setSaving(true);
      await criarVeiculo({
        ...form,
        placa: form.placa.toUpperCase(),
        ano: form.ano ? Number(form.ano) : null,
      });
      setForm(initialForm);
      setFeedback({ type: 'success', text: 'Veiculo cadastrado com sucesso.' });
      await loadData();
    } catch (err) {
      setFeedback({
        type: 'error',
        text: err instanceof Error ? err.message : 'Erro ao cadastrar veiculo.',
      });
    } finally {
      setSaving(false);
    }
  }

  const columns: DataColumn<Veiculo>[] = [
    { key: 'placa', header: 'Placa', render: (veiculo) => <strong>{veiculo.placa}</strong> },
    {
      key: 'modelo',
      header: 'Veiculo',
      render: (veiculo) => `${veiculo.marca} ${veiculo.modelo}`,
    },
    { key: 'ano', header: 'Ano', render: (veiculo) => veiculo.ano || 'Nao informado' },
    {
      key: 'cliente',
      header: 'Cliente',
      render: (veiculo) => clientesPorId.get(String(veiculo.cliente_id)) ?? 'Nao localizado',
    },
  ];

  return (
    <div className="page">
      <section className="page-header">
        <p className="eyebrow">Frota atendida</p>
        <h1>Veiculos</h1>
        <p>Vincule cada veiculo ao cliente responsavel antes de abrir uma ordem de servico.</p>
      </section>

      {feedback && <div className={`feedback ${feedback.type}`}>{feedback.text}</div>}

      <section className="content-panel">
        <div className="section-heading">
          <div>
            <h2>Novo veiculo</h2>
            <p>Cadastre um novo veiculo.</p>
          </div>
        </div>

        <form className="form-grid" onSubmit={handleSubmit}>
          <SelectField
            id="veiculo-cliente"
            label="Cliente"
            value={form.cliente_id}
            onChange={(event) =>
              setForm((current) => ({ ...current, cliente_id: event.target.value }))
            }
            required
          >
            <option value="">Selecione o cliente</option>
            {clientes.map((cliente) => (
              <option key={cliente.id} value={cliente.id}>
                {cliente.nome}
              </option>
            ))}
          </SelectField>
          <FormField
            id="veiculo-placa"
            label="Placa"
            value={form.placa}
            onChange={(event) => setForm((current) => ({ ...current, placa: event.target.value }))}
            required
          />
          <FormField
            id="veiculo-marca"
            label="Marca"
            value={form.marca}
            onChange={(event) => setForm((current) => ({ ...current, marca: event.target.value }))}
            required
          />
          <FormField
            id="veiculo-modelo"
            label="Modelo"
            value={form.modelo}
            onChange={(event) =>
              setForm((current) => ({ ...current, modelo: event.target.value }))
            }
            required
          />
          <FormField
            id="veiculo-ano"
            label="Ano"
            type="number"
            min="1950"
            value={form.ano}
            onChange={(event) => setForm((current) => ({ ...current, ano: event.target.value }))}
          />
          <button className="button primary" type="submit" disabled={saving || clientes.length === 0}>
            {saving ? 'Salvando...' : 'Cadastrar veiculo'}
          </button>
        </form>
      </section>

      <section className="content-panel">
        <div className="section-heading">
          <div>
            <h2>Veiculos cadastrados</h2>
          </div>
          <span className="panel-count">{veiculos.length} registros</span>
        </div>
        <DataList
          columns={columns}
          data={veiculos}
          getKey={(veiculo) => veiculo.id}
          emptyMessage="Nenhum veiculo cadastrado ainda."
          loading={loading}
        />
      </section>
    </div>
  );
}
