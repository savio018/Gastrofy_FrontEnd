interface PaginaEmConstrucaoProps {
  titulo: string;
  descricao: string;
}

export function PaginaEmConstrucao({ titulo, descricao }: PaginaEmConstrucaoProps) {
  return (
    <div>
      <h1 className="text-2xl font-semibold text-[var(--text)]">{titulo}</h1>
      <div className="mt-4 rounded-xl border border-dashed border-[var(--border)] bg-[var(--card)] p-8 text-center">
        <p className="text-sm text-[var(--text-muted)]">{descricao}</p>
        <p className="mt-1 text-xs text-[var(--text-muted)]">
          Em construção — próxima etapa do desenvolvimento do frontend.
        </p>
      </div>
    </div>
  );
}
