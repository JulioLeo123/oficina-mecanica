import type { StatusOS } from '../types';

const labels: Record<StatusOS, string> = {
  aberta: 'Aberta',
  diagnostico: 'Diagnostico',
  orcamento_pendente: 'Orcamento pendente',
  aprovada: 'Aprovada',
  nao_aprovada: 'Nao aprovada',
  em_execucao: 'Em execucao',
  finalizada: 'Finalizada',
};

export function formatStatus(status: StatusOS) {
  return labels[status];
}
