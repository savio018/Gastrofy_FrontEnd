export function parseDataLocal(data: string): Date {
  const [ano, mes, dia] = data.slice(0, 10).split('-').map(Number);
  return new Date(ano, mes - 1, dia);
}

export function formatarDataLocal(data: string): string {
  return parseDataLocal(data).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

export function diasAteData(data: string): number {
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);
  const diffMs = parseDataLocal(data).getTime() - hoje.getTime();
  return Math.round(diffMs / 86_400_000);
}
