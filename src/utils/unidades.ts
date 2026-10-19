export type ModoUnidade = 'caixa' | 'consumo';

export function arredondar2(valor: number): number {
  return Math.round(valor * 100) / 100;
}

function conteudoValido(conteudo: number): boolean {
  return Number.isFinite(conteudo) && conteudo > 0;
}

export function paraBase(caixas: number, conteudo: number): number | null {
  if (!conteudoValido(conteudo)) return null;
  return arredondar2(caixas * conteudo);
}

export function paraCaixas(base: number, conteudo: number): number | null {
  if (!conteudoValido(conteudo)) return null;
  return arredondar2(base / conteudo);
}

export function rotuloCaixa(unidadeCompra: string): string {
  return unidadeCompra.trim() || 'caixa';
}

export function formatarNumero(valor: number | null): string {
  if (valor === null) return '—';
  return valor.toLocaleString('pt-BR', { maximumFractionDigits: 2, useGrouping: false });
}

export function numeroOuNull(valor: string): number | null {
  if (valor.trim() === '') return null;
  const numero = Number(valor);
  return Number.isFinite(numero) ? numero : null;
}

export function converterParaBase(
  valor: string,
  modo: ModoUnidade,
  conteudo: number,
  inteiro = false,
): number | null {
  const numero = numeroOuNull(valor);
  if (numero === null) return null;
  if (modo === 'consumo') return numero;
  const base = paraBase(numero, conteudo);
  if (base === null) return null;
  return inteiro ? Math.round(base) : base;
}
