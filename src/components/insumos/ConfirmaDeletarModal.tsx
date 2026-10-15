import type { Insumo } from '../../types';

interface ConfirmaDeletarModalProps {
  isOpen: boolean;
  insumo: Insumo | null;
  onClose: () => void;
  onConfirmar: () => Promise<void>;
  carregando: boolean;
}

export function ConfirmaDeletarModal({
  isOpen,
  insumo,
  onClose,
  onConfirmar,
  carregando,
}: ConfirmaDeletarModalProps) {
  if (!isOpen || !insumo) return null;

  return (
    <div className="fixed inset-0 z-50 flex backdrop-blur-sm bg-black/20 sm:items-center sm:justify-center">
      <div className="h-dvh w-full overflow-y-auto overscroll-contain bg-white p-4 shadow-xl sm:h-auto sm:max-h-[90dvh] sm:max-w-sm sm:rounded-2xl sm:p-8">
        <h2 className="text-xl font-semibold text-[#1A1A1A]">
          Tem certeza?
        </h2>
        <p className="mt-2 text-sm text-[#6B6B6B]">
          Deseja excluir o insumo <span className="font-semibold text-[#1A1A1A]">{insumo.nome}</span>? Esta ação não pode ser desfeita.
        </p>

        <div className="sticky bottom-0 z-10 -mx-4 -mb-4 mt-6 flex gap-3 bg-white px-4 pb-4 pt-3 sm:mx-0 sm:mb-0 sm:p-0">
          <button
            onClick={onClose}
            className="min-h-11 flex-1 rounded-lg border border-[#E5E0DA] px-4 py-2 font-medium text-[#1A1A1A] transition-colors hover:bg-[#F5F0EB]"
            disabled={carregando}
          >
            Cancelar
          </button>
          <button
            onClick={onConfirmar}
            className="min-h-11 flex-1 rounded-lg bg-[#CC0000] px-4 py-2 font-medium text-white transition-colors hover:bg-[#B30000] disabled:opacity-50"
            disabled={carregando}
          >
            {carregando ? 'Excluindo...' : 'Excluir'}
          </button>
        </div>
      </div>
    </div>
  );
}
