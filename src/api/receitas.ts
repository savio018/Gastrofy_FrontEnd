import { api } from '../lib/api';
import type { Receita } from '../types';

export interface ReceitaInsumoInput {
  insumoId: number;
  quantidadeUtilizada: number;
}

export interface CriarReceitaDTO {
  nome: string;
  rendimento: number;
  unidadeRendimento: string;
  modoPreparo?: string;
  insumos: ReceitaInsumoInput[];
}

export interface AtualizarReceitaDTO {
  nome: string;
  rendimento: number;
  unidadeRendimento: string;
  modoPreparo?: string;
  insumos: ReceitaInsumoInput[];
}

export async function listarReceitas(): Promise<Receita[]> {
  const { data } = await api.get<Receita[]>('/receitas');
  return data;
}

export async function criarReceita(
  dados: CriarReceitaDTO,
  forcarCriacao: boolean = false
): Promise<Receita> {
  const { data } = await api.post<Receita>(
    `/receitas?forcarCriacao=${forcarCriacao}`,
    dados
  );
  return data;
}

export async function atualizarReceita(
  id: number,
  dados: AtualizarReceitaDTO
): Promise<Receita> {
  const { data } = await api.put<Receita>(`/receitas/${id}`, dados);
  return data;
}

export async function deletarReceita(id: number): Promise<void> {
  await api.delete(`/receitas/${id}`);
}
