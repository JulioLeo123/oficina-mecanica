import { useEffect, useMemo, useState, type FormEvent } from 'react';
import FormField from '../components/FormField';
import SelectField from '../components/SelectField';
import StatusBadge from '../components/StatusBadge';
import {
  atualizarStatusOS,
  criarOS,
  getClientes,
  getOrdensServico,
  getVeiculos,
} from '../services/api';
import {
  STATUS_OPTIONS,
  type Cliente,
  type Feedback,
  type OrdemServico,
  type StatusOS,
  type Veiculo,
} from '../types';
import { formatStatus } from '../utils/status';

const initialForm = {
  cliente_id: '',
  veiculo_id: '',
  descricao: '',
};

export default function OrdensServico() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [veiculos, setVeiculos] = useState<Veiculo[]>([]);
  const [ordens, setOrdens] = useState<OrdemServico[]>([]);
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | number | null>(null);
  const [feedback, setFeedback] = useState<Feedback | null>(null);

  async function loadData() {
    try {
      setLoading(true);
      const [clientesData, veiculosData, ordensData] = await Promise.all([
        getClientes(),
        getVeiculos(),
        getOrdensServico(),
      ]);
      setClientes(clientesData);
      setVeiculos(veiculosData);
      setOrdens(ordensData);
    } catch (err) {
      setFeedback({
        type: 'error',
        text: err instanceof Error ? err.message : 'Erro ao carregar ordens de servico.',
      });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void Promise.resolve().then(loadData);
  }, []);

  const veiculosDoCliente = useMemo(
    () => veiculos.filter((veiculo) => String(veiculo.cliente_id) === form.cliente_id),
    [form.cliente_id, veiculos],
  );

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      setSaving(true);
      await criarOS(form);
      setForm(initialForm);
      setFeedback({ type: 'success', text: 'Ordem de servico aberta com sucesso.' });
      await loadData();
    } catch (err) {
      setFeedback({
        type: 'error',
        text: err instanceof Error ? err.message : 'Erro ao abrir ordem de servico.',
      });
    } finally {
      setSaving(false);
    }
  }

  async function handleStatusChange(ordem: OrdemServico, status: StatusOS) {
    try {
      setUpdatingId(ordem.id);
      await atualizarStatusOS(ordem.id, status);
      setFeedback({ type: 'success', text: 'Status da OS atualizado.' });
      await loadData();
    } catch (err) {
      setFeedback({
        type: 'error',
        text: err instanceof Error ? err.message : 'Erro ao atualizar status.',
      });
    } finally {
      setUpdatingId(null);
    }
  }

  const ordensPorStatus = useMemo(
    () =>
      STATUS_OPTIONS.map((status) => ({
        status,
        ordens: ordens.filter((ordem) => ordem.status === status),
      })),
    [ordens],
  );

  return (
    <div className="page">
      <section className="page-header">
        <p className="eyebrow">Fluxo de atendimento</p>
        <h1>Ordens de Servico</h1>
        <p>Abra OS vinculando cliente e veiculo, depois acompanhe cada etapa por status.</p>
      </section>

      {feedback && <div className={`feedback ${feedback.type}`}>{feedback.text}</div>}

      <section className="content-panel">
        <div className="section-heading">
          <div>
            <h2>Nova ordem</h2>
            <p>A OS sempre nasce com status aberta, conforme o backend atual.</p>
          </div>
        </div>

        <form className="form-grid" onSubmit={handleSubmit}>
          <SelectField
            id="os-cliente"
            label="Cliente"
            value={form.cliente_id}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                cliente_id: event.target.value,
                veiculo_id: '',
              }))
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
          <SelectField
            id="os-veiculo"
            label="Veiculo"
            value={form.veiculo_id}
            onChange={(event) =>
              setForm((current) => ({ ...current, veiculo_id: event.target.value }))
            }
            disabled={!form.cliente_id}
            required
          >
            <option value="">Selecione o veiculo</option>
            {veiculosDoCliente.map((veiculo) => (
              <option key={veiculo.id} value={veiculo.id}>
                {veiculo.placa} - {veiculo.modelo}
              </option>
            ))}
          </SelectField>
          <FormField
            id="os-descricao"
            label="Descricao inicial"
            textarea
            value={form.descricao}
            onChange={(event) =>
              setForm((current) => ({ ...current, descricao: event.target.value }))
            }
          />
          <button className="button primary" type="submit" disabled={saving || clientes.length === 0}>
            {saving ? 'Abrindo...' : 'Abrir OS'}
          </button>
        </form>
      </section>

      <section className="content-panel">
        <div className="section-heading">
          <div>
            <h2>Kanban de ordens</h2>
            <p>Colunas baseadas nos status aceitos pelo PATCH /api/ordens-servico/:id/status.</p>
          </div>
          <span className="panel-count">{ordens.length} ordens</span>
        </div>

        {loading ? (
          <div className="state-box">Carregando ordens de servico...</div>
        ) : ordens.length === 0 ? (
          <div className="state-box">Nenhuma ordem de servico cadastrada ainda.</div>
        ) : (
          <div className="kanban">
            {ordensPorStatus.map((column) => (
              <div className="kanban-column" key={column.status}>
                <div className="kanban-title">
                  <StatusBadge status={column.status} />
                  <span>{column.ordens.length}</span>
                </div>
                <div className="kanban-list">
                  {column.ordens.length === 0 ? (
                    <div className="empty-column">Sem OS neste status.</div>
                  ) : (
                    column.ordens.map((ordem) => (
                      <article className="order-card" key={ordem.id}>
                        <strong>{ordem.clientes?.nome ?? 'Cliente nao informado'}</strong>
                        <span>
                          {ordem.veiculos?.placa ?? 'Sem placa'} -{' '}
                          {ordem.veiculos?.modelo ?? 'Veiculo'}
                        </span>
                        {ordem.descricao && <p>{ordem.descricao}</p>}
                        <small>
                          Criada em {new Date(ordem.criado_em).toLocaleDateString('pt-BR')}
                        </small>
                        <SelectField
                          id={`status-${ordem.id}`}
                          label="Atualizar status"
                          value={ordem.status}
                          disabled={updatingId === ordem.id}
                          onChange={(event) =>
                            handleStatusChange(ordem, event.target.value as StatusOS)
                          }
                        >
                          {STATUS_OPTIONS.map((status) => (
                            <option key={status} value={status}>
                              {formatStatus(status)}
                            </option>
                          ))}
                        </SelectField>
                      </article>
                    ))
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
