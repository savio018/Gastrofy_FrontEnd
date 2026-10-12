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
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/20">
      <div className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-xl">
        <h2 className="text-xl font-semibold text-[#1A1A1A]">
          Tem certeza?
        </h2>
        <p className="mt-2 text-sm text-[#6B6B6B]">
          Deseja excluir o insumo <span className="font-semibold text-[#1A1A1A]">{insumo.nome}</span>? Esta ação não pode ser desfeita.
        </p>

        <div className="mt-6 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 rounded-lg border border-[#E5E0DA] px-4 py-2 font-medium text-[#1A1A1A] transition-colors hover:bg-[#F5F0EB]"
            disabled={carregando}
          >
            Cancelar
          </button>
          <button
            onClick={onConfirmar}
            className="flex-1 rounded-lg bg-[#CC0000] px-4 py-2 font-medium text-white transition-colors hover:bg-[#B30000] disabled:opacity-50"
            disabled={carregando}
          >
            {carregando ? 'Excluindo...' : 'Excluir'}
          </button>
        </div>
      </div>
    </div>
  );
}
