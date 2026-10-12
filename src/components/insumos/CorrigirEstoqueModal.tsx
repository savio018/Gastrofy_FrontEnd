import { useState, useEffect, type FormEvent } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import type { Insumo } from '../../types';

interface CorrigirEstoqueModalProps {
  isOpen: boolean;
  insumo: Insumo | null;
  onClose: () => void;
  onSalvar: (quantidade: number) => Promise<void>;
  carregando: boolean;
}

export function CorrigirEstoqueModal({
  isOpen,
  insumo,
  onClose,
  onSalvar,
  carregando,
}: CorrigirEstoqueModalProps) {
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

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErro('');
    setErroGeral('');

    if (!quantidade) {
      setErro('Quantidade obrigatória');
      return;
    }

    const qtd = Number(quantidade);
    if (qtd <= 0) {
      setErro('Quantidade deve ser maior que 0');
      return;
    }

    if (!insumo || qtd > insumo.estoqueTotal) {
      setErro(`Quantidade não pode ser maior que o estoque total (${insumo?.estoqueTotal})`);
      return;
    }

    try {
      await onSalvar(qtd);
      onClose();
    } catch (error: any) {
      setErroGeral(
        error?.response?.data?.message || 'Erro ao corrigir estoque. Tente novamente.'
      );
    }
  };

  if (!isOpen || !insumo) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/20">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-[#1A1A1A]">
            Corrigir Estoque
          </h2>
          <button
            onClick={onClose}
            className="text-[#6B6B6B] hover:text-[#1A1A1A]"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        {/* Estoque atual */}
        <div className="mb-4 rounded-lg bg-[#F5F0EB] p-4">
          <p className="text-sm text-[#1A1A1A]">
            <span className="font-semibold">{insumo.nome}</span>
          </p>
          <p className="mt-1 text-sm text-[#6B6B6B]">
            Estoque atual: <span className="font-semibold">{insumo.estoqueTotal} {insumo.unidadeConsumo}</span>
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
              Quanto você perdeu/quer remover?
            </label>
            <input
              type="number"
              value={quantidade}
              onChange={(e) => setQuantidade(e.target.value)}
              step="0.01"
              placeholder="Ex: 5"
              className="mt-1 w-full rounded-lg border border-[#E5E0DA] bg-white px-4 py-2 text-[#1A1A1A] focus:border-[#3D1A1A] focus:outline-none"
              disabled={carregando}
            />
            <p className="mt-1 text-xs text-[#6B6B6B]">
              Use para registrar perdas, quebras ou correções - o sistema desconta automaticamente do lote mais próximo de vencer
            </p>
            {erro && (
              <p className="mt-1 text-xs text-[#CC0000]">{erro}</p>
            )}
          </div>

          {/* Botões */}
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
              type="submit"
              className="flex-1 rounded-lg bg-[#3D1A1A] px-4 py-2 font-medium text-white transition-colors hover:bg-[#2D1515] disabled:opacity-50"
              disabled={carregando}
            >
              {carregando ? 'Corrigindo...' : 'Confirmar correção'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
