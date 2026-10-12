export interface Usuario {
  id: number;
  nome: string;
  email: string;
  dataCriacao: string;
}

export interface LoteInsumo {
  id: number;
  quantidade: number;
  dataValidade: string;
  dataCompra: string;
}

export interface Insumo {
  id: number;
  nome: string;
  estoqueTotal: number;
  unidadeConsumo: string;
  unidadeCompra: string;
  conteudoUnidadeCompra: number;
  precoUnidadeCompra: number;
  estoqueMinimo: number | null;
  estoqueCritico: number | null;
  diasAvisoValidade: number | null;
  lotes: LoteInsumo[];
}

export interface Embalagem {
  id: number;
  nome: string;
  estoqueTotal: number;
  unidadeCompra: string;
  conteudoUnidadeCompra: number;
  precoUnidadeCompra: number;
  estoqueMinimo: number | null;
  estoqueCritico: number | null;
}

export type TipoAlerta = 'SEM_ESTOQUE' | 'ESTOQUE_CRITICO' | 'ESTOQUE_BAIXO' | 'VENCIDO' | 'VALIDADE_PROXIMA';

export interface Alerta {
  tipo: TipoAlerta;
  mensagem: string;
  insumo: string;
  itemId: number;
  loteId: number | null;
  categoria: 'INSUMO' | 'EMBALAGEM';
}

export interface DestaqueItem {
  itemId: number;
  loteId: number | null;
}

export interface ReceitaInsumo {
  insumoId: number;
  nomeInsumo: string;
  quantidadeUtilizada: number;
  unidadeConsumo: string;
  custoInsumo: number;
}

export interface Receita {
  id: number;
  nome: string;
  rendimento: number;
  unidadeRendimento: string;
  custoTotal: number;
  custoPorUnidade: number;
  modoPreparo: string | null;
  insumos: ReceitaInsumo[];
}
