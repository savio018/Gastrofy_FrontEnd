export interface Usuario {
  id: number;
  nome: string;
  email: string;
  dataCriacao: string;
}

export type TipoAlerta =
  | 'SEM_ESTOQUE'
  | 'ESTOQUE_CRITICO'
  | 'ESTOQUE_BAIXO'
  | 'VENCIDO'
  | 'VALIDADE_PROXIMA';

export interface Alerta {
  tipo: TipoAlerta;
  mensagem: string;
  insumo: string;
}
