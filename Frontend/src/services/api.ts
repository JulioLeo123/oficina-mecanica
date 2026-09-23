import type { Cliente, OrdemServico, StatusOS, Veiculo } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3001/api';

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...init?.headers,
    },
    ...init,
  });

  const isJson = response.headers.get('content-type')?.includes('application/json');
  const data = isJson ? await response.json() : null;

  if (!response.ok) {
    const message = data?.erro ?? 'Nao foi possivel concluir a operacao.';
    throw new Error(message);
  }

  return data as T;
}

export function getClientes() {
  return request<Cliente[]>('/clientes');
}

export function criarCliente(dados: Pick<Cliente, 'nome' | 'telefone' | 'email'>) {
  return request<Cliente>('/clientes', {
    method: 'POST',
    body: JSON.stringify(dados),
  });
}

export function getVeiculos(clienteId?: string | number) {
  const query = clienteId ? `?cliente_id=${encodeURIComponent(String(clienteId))}` : '';
  return request<Veiculo[]>(`/veiculos${query}`);
}

export function criarVeiculo(dados: {
  cliente_id: string;
  placa: string;
  marca: string;
  modelo: string;
  ano: number | null;
}) {
  return request<Veiculo>('/veiculos', {
    method: 'POST',
    body: JSON.stringify(dados),
  });
}

export function getOrdensServico() {
  return request<OrdemServico[]>('/ordens-servico');
}

export function criarOS(dados: { cliente_id: string; veiculo_id: string; descricao: string }) {
  return request<OrdemServico>('/ordens-servico', {
    method: 'POST',
    body: JSON.stringify(dados),
  });
}

export function atualizarStatusOS(id: string | number, status: StatusOS) {
  return request<OrdemServico>(`/ordens-servico/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  });
}
