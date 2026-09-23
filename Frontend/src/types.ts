export interface Cliente {
  id: number | string;
  nome: string;
  telefone: string;
  email?: string | null;
  criado_em?: string;
}

export interface Veiculo {
  id: number | string;
  cliente_id: number | string;
  placa: string;
  marca: string;
  modelo: string;
  ano?: number | null;
  criado_em?: string;
}

export const STATUS_OPTIONS = [
  'aberta',
  'diagnostico',
  'orcamento_pendente',
  'aprovada',
  'nao_aprovada',
  'em_execucao',
  'finalizada',
] as const;

export type StatusOS = (typeof STATUS_OPTIONS)[number];

export interface OrdemServico {
  id: number | string;
  cliente_id?: number | string;
  veiculo_id?: number | string;
  descricao?: string | null;
  status: StatusOS;
  criado_em: string;
  clientes?: {
    id?: number | string;
    nome: string;
    telefone?: string;
  } | null;
  veiculos?: {
    id?: number | string;
    placa: string;
    marca?: string;
    modelo: string;
  } | null;
}

export interface Feedback {
  type: 'success' | 'error';
  text: string;
}
