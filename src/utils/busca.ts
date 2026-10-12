export function normalizarTexto(texto: string): string {
  return texto
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .trim();
}

export function matchBusca(texto: string, termo: string): boolean {
  const termoNormalizado = normalizarTexto(termo);
  if (termoNormalizado === '') return true;
  return normalizarTexto(texto).includes(termoNormalizado);
}
