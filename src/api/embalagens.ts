import { api } from '../lib/api';
import type { Embalagem } from '../types';

export interface CriarEmbalagemDTO {
  nome: string;
  quantidadeCompra: number;
  unidadeCompra: string;
  conteudoUnidadeCompra: number;
  precoUnidadeCompra: number;
  estoqueMinimo?: number;
  estoqueCritico?: number;
}

export interface AtualizarEmbalagemDTO {
  nome: string;
  unidadeCompra: string;
  conteudoUnidadeCompra: number;
  precoUnidadeCompra: number;
  estoqueMinimo?: number;
  estoqueCritico?: number;
}

export async function listarEmbalagens(): Promise<Embalagem[]> {
  const { data } = await api.get<Embalagem[]>('/embalagens');
  return data;
}

export async function criarEmbalagem(dados: CriarEmbalagemDTO): Promise<Embalagem> {
  const { data } = await api.post<Embalagem>('/embalagens', dados);
  return data;
}

export async function atualizarEmbalagem(
  id: number,
  dados: AtualizarEmbalagemDTO
): Promise<Embalagem> {
  const { data } = await api.put<Embalagem>(`/embalagens/${id}`, dados);
  return data;
}

export async function deletarEmbalagem(id: number): Promise<void> {
  await api.delete(`/embalagens/${id}`);
}

export async function reporEstoqueEmbalagem(id: number, quantidade: number): Promise<void> {
  await api.patch(`/embalagens/${id}/estoque?quantidade=${quantidade}`);
}

export async function corrigirEstoqueEmbalagem(id: number, quantidade: number): Promise<void> {
  await api.patch(`/embalagens/${id}/estoque?quantidade=-${quantidade}`);
}
