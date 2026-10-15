import { useState, useEffect, type FormEvent } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import type { Insumo, LoteInsumo } from '../../types';

interface EditarLoteModalProps {
  isOpen: boolean;
  insumo: Insumo | null;
  lote: LoteInsumo | null;
  onClose: () => void;
  onSalvar: (loteId: number, quantidade: number) => Promise<void>;
  carregando: boolean;
}

export function EditarLoteModal({
  isOpen,
  insumo,
  lote,
  onClose,
  onSalvar,
  carregando,
}: EditarLoteModalProps) {
  const [quantidade, setQuantidade] = useState('');
  const [erro, setErro] = useState('');
  const [erroGeral, setErroGeral] = useState('');
  const [confirmaDelecao, setConfirmaDelecao] = useState(false);

  useEffect(() => {
    if (isOpen && lote) {
      setQuantidade(String(lote.quantidade));
      setErro('');
      setErroGeral('');
      setConfirmaDelecao(false);
    }
  }, [isOpen, lote]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErro('');
    setErroGeral('');

    if (!quantidade) {
      setErro('Quantidade obrigatória');
      return;
    }

    const qtd = Number(quantidade);
    if (qtd < 0) {
      setErro('Quantidade não pode ser negativa');
      return;
    }

    if (qtd === 0 && !confirmaDelecao) {
      setConfirmaDelecao(true);
      return;
    }

    try {
      if (!lote || !insumo) return;
      await onSalvar(lote.id, qtd);
      onClose();
    } catch (error: any) {
      setErroGeral(
        error?.response?.data?.message || 'Erro ao editar lote. Tente novamente.'
      );
    }
  };

  if (!isOpen || !insumo || !lote) return null;

  const formatarData = (data: string) =>
    new Date(data).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });

  return (
    <div className="fixed inset-0 z-50 flex backdrop-blur-sm bg-black/20 sm:items-center sm:justify-center">
      <div className="h-dvh w-full overflow-y-auto overscroll-contain bg-white p-4 shadow-xl sm:h-auto sm:max-h-[90dvh] sm:max-w-md sm:rounded-2xl sm:p-8">
        <div className="sticky top-0 z-10 -mx-4 -mt-4 mb-4 flex items-center justify-between bg-white px-4 pb-3 pt-4 sm:mx-0 sm:mt-0 sm:mb-6 sm:p-0">
          <h2 className="text-2xl font-semibold text-[#1A1A1A]">
            Editar Lote
          </h2>
          <button
            onClick={onClose}
            className="flex h-11 w-11 items-center justify-center text-[#6B6B6B] hover:text-[#1A1A1A]"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        {/* Contexto do lote */}
        <div className="mb-4 rounded-lg bg-[#F5F0EB] p-4 space-y-2">
          <p className="text-sm text-[#1A1A1A]">
            <span className="font-semibold">{insumo.nome}</span>
          </p>
          <p className="text-xs text-[#6B6B6B]">
            Válido: <span className="font-medium">{formatarData(lote.dataValidade)}</span>
          </p>
          <p className="text-xs text-[#6B6B6B]">
            Comprado: <span className="font-medium">{formatarData(lote.dataCompra)}</span>
          </p>
        </div>

        {confirmaDelecao && (
          <div className="mb-4 rounded-lg bg-[#FFFAF0] p-4 border border-[#FFB800]">
            <p className="text-sm text-[#8B6914]">
              Você está definindo a quantidade para 0. Este lote será removido.
            </p>
            <p className="mt-2 text-xs text-[#8B6914]">
              Deseja continuar?
            </p>
          </div>
        )}

        {erroGeral && (
          <div className="mb-4 rounded-lg bg-[#FFF5F5] p-3 text-sm text-[#CC0000]">
            {erroGeral}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#1A1A1A]">
              Nova quantidade ({insumo.unidadeConsumo})
            </label>
            <input
              type="number"
              value={quantidade}
              onChange={(e) => {
                setQuantidade(e.target.value);
                setConfirmaDelecao(false);
              }}
              inputMode="decimal" step="0.01"
              placeholder="Ex: 100"
              className="mt-1 w-full rounded-lg border border-[#E5E0DA] bg-white px-4 py-2 text-[#1A1A1A] focus:border-[#3D1A1A] focus:outline-none"
              disabled={carregando}
            />
            {erro && (
              <p className="mt-1 text-xs text-[#CC0000]">{erro}</p>
            )}
          </div>

          {/* Botões */}
          <div className="sticky bottom-0 z-10 -mx-4 -mb-4 mt-6 flex gap-3 bg-white px-4 pb-4 pt-3 sm:mx-0 sm:mb-0 sm:p-0">
            <button
              type="button"
              onClick={onClose}
              className="min-h-11 flex-1 rounded-lg border border-[#E5E0DA] px-4 py-2 font-medium text-[#1A1A1A] transition-colors hover:bg-[#F5F0EB]"
              disabled={carregando}
            >
              Cancelar
            </button>
            {confirmaDelecao ? (
              <button
                type="submit"
                className="min-h-11 flex-1 rounded-lg bg-[#CC0000] px-4 py-2 font-medium text-white transition-colors hover:bg-[#B30000] disabled:opacity-50"
                disabled={carregando}
              >
                {carregando ? 'Removendo...' : 'Remover lote'}
              </button>
            ) : (
              <button
                type="submit"
                className="min-h-11 flex-1 rounded-lg bg-[#3D1A1A] px-4 py-2 font-medium text-white transition-colors hover:bg-[#2D1515] disabled:opacity-50"
                disabled={carregando}
              >
                {carregando ? 'Salvando...' : 'Salvar'}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
