import { useState, useEffect, type FormEvent } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import type { Embalagem } from '../../types';
import { numeroOuNull } from '../../utils/unidades';

interface ReporEstoqueEmbalagemModalProps {
  isOpen: boolean;
  embalagem: Embalagem | null;
  onClose: () => void;
  onSalvar: (quantidade: number) => Promise<void>;
  carregando: boolean;
}

export function ReporEstoqueEmbalagemModal({
  isOpen,
  embalagem,
  onClose,
  onSalvar,
  carregando,
}: ReporEstoqueEmbalagemModalProps) {
  const [quantidade, setQuantidade] = useState('');
  const [erro, setErro] = useState('');
  const [erroGeral, setErroGeral] = useState('');

  useEffect(() => {
    if (isOpen) {
      setQuantidade('');
      setErro('');
      setErroGeral('');
    }
  }, [isOpen]);

  if (!isOpen || !embalagem) return null;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErro('');
    setErroGeral('');

    const qnt = numeroOuNull(quantidade);
    if (qnt === null || qnt <= 0) {
      setErro('Informe uma quantidade maior que 0');
      return;
    }
    if (!Number.isInteger(qnt)) {
      setErro('Informe um número inteiro de unidades');
      return;
    }

    try {
      await onSalvar(qnt);
      onClose();
    } catch (error: any) {
      setErroGeral(
        error?.response?.data?.message || 'Erro ao repor estoque. Tente novamente.'
      );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex backdrop-blur-sm bg-black/20 sm:items-center sm:justify-center">
      <div className="h-dvh w-full overflow-y-auto overscroll-contain bg-white p-4 shadow-xl sm:h-auto sm:max-h-[90dvh] sm:max-w-md sm:rounded-2xl sm:p-8">
        <div className="sticky top-0 z-10 -mx-4 -mt-4 mb-4 flex items-center justify-between bg-white px-4 pb-3 pt-4 sm:mx-0 sm:mt-0 sm:mb-6 sm:p-0">
          <h2 className="text-2xl font-semibold text-[#1A1A1A]">
            Repor Estoque
          </h2>
          <button
            onClick={onClose}
            className="flex h-11 w-11 items-center justify-center text-[#6B6B6B] hover:text-[#1A1A1A]"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        <div className="mb-4 rounded-lg bg-[#F5F0EB] p-4">
          <p className="break-words text-sm text-[#1A1A1A]">
            <span className="font-semibold">{embalagem.nome}</span>
          </p>
          <p className="mt-1 text-sm text-[#6B6B6B]">
            Estoque atual: <span className="font-semibold">{embalagem.estoqueTotal} unidade{embalagem.estoqueTotal !== 1 ? 's' : ''}</span>
          </p>
        </div>

        {erroGeral && (
          <div className="mb-4 rounded-lg bg-[#FFF5F5] p-3 text-sm text-[#CC0000]">
            {erroGeral}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#1A1A1A]">
              Quantidade
            </label>
            <input
              type="number"
              value={quantidade}
              onChange={(e) => setQuantidade(e.target.value)}
              inputMode="numeric"
              step="1"
              min="1"
              className="mt-1 w-full rounded-lg border border-[#E5E0DA] bg-white px-4 py-2 text-[#1A1A1A] focus:border-[#3D1A1A] focus:outline-none"
              placeholder="Digite a quantidade"
              disabled={carregando}
            />
            {erro && (
              <p className="mt-1 text-xs text-[#CC0000]">{erro}</p>
            )}
          </div>

          <div className="sticky bottom-0 z-10 -mx-4 -mb-4 mt-6 flex gap-3 bg-white px-4 pb-4 pt-3 sm:mx-0 sm:mb-0 sm:p-0">
            <button
              type="button"
              onClick={onClose}
              className="min-h-11 flex-1 rounded-lg border border-[#E5E0DA] px-4 py-2 font-medium text-[#1A1A1A] transition-colors hover:bg-[#F5F0EB]"
              disabled={carregando}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="min-h-11 flex-1 rounded-lg bg-[#3D1A1A] px-4 py-2 font-medium text-white transition-colors hover:bg-[#2D1515] disabled:opacity-50"
              disabled={carregando}
            >
              {carregando ? 'Processando...' : 'Repor Estoque'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
