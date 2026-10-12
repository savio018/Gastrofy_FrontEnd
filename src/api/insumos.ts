import { api } from '../lib/api';
import type { Insumo } from '../types';

export interface CriarInsumoDTO {
  nome: string;
  dataValidade: string;
  quantidadeCompra: number;
  unidadeConsumo: string;
  unidadeCompra: string;
  conteudoUnidadeCompra: number;
  precoUnidadeCompra: number;
  estoqueMinimo?: number | null;
  estoqueCritico?: number | null;
  diasAvisoValidade?: number | null;
}

export interface AtualizarInsumoDTO {
  nome: string;
  dataValidade: string;
  unidadeConsumo: string;
  unidadeCompra: string;
  conteudoUnidadeCompra: number;
  precoUnidadeCompra: number;
  estoqueMinimo?: number | null;
  estoqueCritico?: number | null;
  diasAvisoValidade?: number | null;
}

export async function listarInsumos(): Promise<Insumo[]> {
  const response = await api.get<Insumo[]>('/insumos');
  return response.data;
}

export async function criarInsumo(dados: CriarInsumoDTO): Promise<Insumo> {
  const response = await api.post<Insumo>('/insumos', dados);
  return response.data;
}

export async function atualizarInsumo(id: number, dados: AtualizarInsumoDTO): Promise<Insumo> {
  const response = await api.put<Insumo>(`/insumos/${id}`, dados);
  return response.data;
}

export async function deletarInsumo(id: number): Promise<void> {
  await api.delete(`/insumos/${id}`);
}

export async function reporEstoque(
  id: number,
  lotes: Array<{ quantidade: number; dataValidade: string }>
): Promise<Insumo> {
  const response = await api.patch<Insumo>(`/insumos/${id}/estoque`, { lotes });
  return response.data;
}

export async function corrigirEstoque(id: number, quantidade: number): Promise<Insumo> {
  const response = await api.post<Insumo>(`/insumos/${id}/corrigir-estoque?quantidade=${quantidade}`);
  return response.data;
}

export async function editarLote(id: number, loteId: number, quantidade: number): Promise<Insumo> {
  const response = await api.patch<Insumo>(`/insumos/${id}/lotes/${loteId}?quantidade=${quantidade}`);
  return response.data;
}

export async function deletarLote(id: number, loteId: number): Promise<Insumo> {
  const response = await api.delete<Insumo>(`/insumos/${id}/lotes/${loteId}`);
  return response.data;
}
