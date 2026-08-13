import { XMarkIcon } from '@heroicons/react/24/outline';
import type { Alerta, TipoAlerta } from '../types';

const BADGE: Record<TipoAlerta, { label: string; className: string }> = {
  SEM_ESTOQUE: { label: 'Sem estoque', className: 'bg-[#CC0000]/10 text-[#CC0000]' },
  ESTOQUE_CRITICO: { label: 'Estoque crítico', className: 'bg-[#CC0000]/10 text-[#CC0000]' },
  ESTOQUE_BAIXO: { label: 'Estoque baixo', className: 'bg-amber-100 text-amber-700' },
  VENCIDO: { label: 'Vencido', className: 'bg-[#CC0000]/10 text-[#CC0000]' },
  VALIDADE_PROXIMA: { label: 'Validade próxima', className: 'bg-amber-100 text-amber-700' },
};

interface AlertasPanelProps {
  aberto: boolean;
  carregando: boolean;
  alertas: Alerta[];
  onFechar: () => void;
}

export function AlertasPanel({ aberto, carregando, alertas, onFechar }: AlertasPanelProps) {
  if (!aberto) return null;

  return (
    <div className="fixed inset-0 z-30 flex justify-end">
      <button
        type="button"
        aria-label="Fechar alertas"
        onClick={onFechar}
        className="absolute inset-0 bg-black/30"
      />
      <aside className="relative flex h-full w-full max-w-sm flex-col bg-[var(--card)] text-[var(--text)] shadow-xl">
        <div className="flex items-center justify-between border-b border-[var(--border)] px-5 py-4">
          <h2 className="text-base font-semibold">Alertas de estoque</h2>
          <button
            type="button"
            onClick={onFechar}
            className="rounded-full p-1 hover:bg-black/5"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          {carregando && (
            <p className="text-sm text-[var(--text-muted)]">Carregando alertas...</p>
          )}

          {!carregando && alertas.length === 0 && (
            <p className="text-sm text-[var(--text-muted)]">
              Nenhum alerta no momento. Estoque em dia.
            </p>
          )}

          <ul className="space-y-3">
            {alertas.map((alerta, index) => {
              const badge = BADGE[alerta.tipo] ?? {
                label: alerta.tipo,
                className: 'bg-black/5 text-[var(--text-muted)]',
              };
              return (
                <li
                  key={`${alerta.tipo}-${alerta.insumo}-${index}`}
                  className="rounded-lg border border-[var(--border)] p-3"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-medium">{alerta.insumo}</span>
                    <span
                      className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-medium ${badge.className}`}
                    >
                      {badge.label}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-[var(--text-muted)]">
                    {alerta.mensagem}
                  </p>
                </li>
              );
            })}
          </ul>
        </div>
      </aside>
    </div>
  );
}
