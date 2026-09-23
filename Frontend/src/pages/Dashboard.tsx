import { useEffect, useState } from 'react';
import StatusBadge from '../components/StatusBadge';
import { getClientes, getOrdensServico, getVeiculos } from '../services/api';
import type { Cliente, OrdemServico, Veiculo } from '../types';

interface DashboardState {
  clientes: Cliente[];
  veiculos: Veiculo[];
  ordens: OrdemServico[];
}

const initialState: DashboardState = {
  clientes: [],
  veiculos: [],
  ordens: [],
};

export default function Dashboard() {
  const [data, setData] = useState(initialState);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadDashboard() {
      try {
        setLoading(true);
        const [clientes, veiculos, ordens] = await Promise.all([
          getClientes(),
          getVeiculos(),
          getOrdensServico(),
        ]);
        setData({ clientes, veiculos, ordens });
        setError('');
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao carregar dashboard.');
      } finally {
        setLoading(false);
      }
    }

    void Promise.resolve().then(loadDashboard);
  }, []);

  const abertas = data.ordens.filter((ordem) => ordem.status === 'aberta').length;
  const emAndamento = data.ordens.filter((ordem) =>
    ['diagnostico', 'orcamento_pendente', 'aprovada', 'em_execucao'].includes(ordem.status),
  ).length;
  const finalizadas = data.ordens.filter((ordem) => ordem.status === 'finalizada').length;

  return (
    <div className="page">
      <section className="page-header">
        <p className="eyebrow">Painel interno</p>
        <h1>Dashboard da oficina</h1>
        <p>Acompanhe o volume de clientes, veiculos e ordens de servico em aberto.</p>
      </section>

      {error && <div className="feedback error">{error}</div>}

      <section className="metric-grid" aria-label="Resumo operacional">
        <article className="metric-card">
          <span>Clientes</span>
          <strong>{loading ? '...' : data.clientes.length}</strong>
          <small>cadastros ativos</small>
        </article>
        <article className="metric-card">
          <span>Veiculos</span>
          <strong>{loading ? '...' : data.veiculos.length}</strong>
          <small>vinculados a clientes</small>
        </article>
        <article className="metric-card">
          <span>OS abertas</span>
          <strong>{loading ? '...' : abertas}</strong>
          <small>aguardando atendimento</small>
        </article>
        <article className="metric-card">
          <span>Em andamento</span>
          <strong>{loading ? '...' : emAndamento}</strong>
          <small>diagnostico, orcamento ou execucao</small>
        </article>
      </section>

      <section className="content-panel">
        <div className="section-heading">
          <div>
            <h2>Ultimas ordens</h2>
            <p>Atalhos visuais para o fluxo de atendimento atual.</p>
          </div>
          <span className="panel-count">{finalizadas} finalizadas</span>
        </div>

        {loading ? (
          <div className="state-box">Carregando ordens...</div>
        ) : data.ordens.length === 0 ? (
          <div className="state-box">Nenhuma ordem de servico aberta ainda.</div>
        ) : (
          <div className="recent-list">
            {data.ordens.slice(0, 5).map((ordem) => (
              <article className="recent-item" key={ordem.id}>
                <div>
                  <strong>{ordem.clientes?.nome ?? 'Cliente nao informado'}</strong>
                  <span>
                    {ordem.veiculos?.placa ?? 'Sem placa'} - {ordem.veiculos?.modelo ?? 'Veiculo'}
                  </span>
                </div>
                <StatusBadge status={ordem.status} />
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
