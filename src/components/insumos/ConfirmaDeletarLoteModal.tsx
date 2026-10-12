import { useEffect, useState } from 'react';
import type { Insumo, LoteInsumo } from '../../types';
import { formatarDataLocal } from '../../lib/datas';

interface ConfirmaDeletarLoteModalProps {
  isOpen: boolean;
  insumo: Insumo | null;
  lote: LoteInsumo | null;
  onClose: () => void;
  onConfirmar: () => Promise<void>;
  carregando: boolean;
}

export function ConfirmaDeletarLoteModal({
  isOpen,
  insumo,
  lote,
  onClose,
  onConfirmar,
  carregando,
}: ConfirmaDeletarLoteModalProps) {
  const [erro, setErro] = useState('');

  useEffect(() => {
    setErro('');
  }, [isOpen, lote]);

  if (!isOpen || !insumo || !lote) return null;

  const ultimoLote = insumo.lotes.length === 1;

  const handleConfirmar = async () => {
    setErro('');
    try {
      await onConfirmar();
    } catch (error: any) {
      setErro(error?.response?.data?.message ?? 'Erro ao excluir lote. Tente novamente.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/20">
      <div className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-xl">
        <h2 className="text-xl font-semibold text-[#1A1A1A]">
          Tem certeza?
        </h2>
        <p className="mt-2 text-sm text-[#6B6B6B]">
          Excluir o lote com{' '}
          <span className="font-semibold text-[#1A1A1A]">
            {lote.quantidade} {insumo.unidadeConsumo}
          </span>
          , validade{' '}
          <span className="font-semibold text-[#1A1A1A]">
            {formatarDataLocal(lote.dataValidade)}
          </span>
          ?
        </p>

        {ultimoLote && (
          <div className="mt-4 rounded-lg border border-[#FFB800] bg-[#FFFAF0] p-3">
            <p className="text-sm text-[#8B6914]">
              Este é o último lote. O insumo ficará sem estoque.
            </p>
          </div>
        )}

        {erro && (
          <div className="mt-4 rounded-lg bg-[#FFF5F5] p-3 text-sm text-[#CC0000]">
            {erro}
          </div>
        )}

        <div className="mt-6 flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-lg border border-[#E5E0DA] px-4 py-2 font-medium text-[#1A1A1A] transition-colors hover:bg-[#F5F0EB]"
            disabled={carregando}
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleConfirmar}
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
