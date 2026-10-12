import { useState, useEffect, type FormEvent } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import type { Embalagem } from '../../types';

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

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErro('');
    setErroGeral('');

    try {
      const qnt = Number(quantidade);
      await onSalvar(qnt);
      onClose();
    } catch (error: any) {
      setErroGeral(
        error?.response?.data?.message || 'Erro ao repor estoque. Tente novamente.'
      );
    }
  };

  // Determina o texto e cor do botão baseado no valor
  const qnt = Number(quantidade);
  const isNegativo = qnt < 0;
  const isvazio = !quantidade || qnt === 0;
  const botaoTexto = carregando
    ? 'Processando...'
    : isvazio
      ? 'Repor Estoque'
      : isNegativo
        ? 'Diminuir Estoque'
        : 'Repor Estoque';
  const botaoCor = isNegativo ? '#CC0000' : '#3D1A1A';
  const botaoCorHover = isNegativo ? '#B30000' : '#2D1515';

  if (!isOpen || !embalagem) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/20">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-[#1A1A1A]">
            Repor Estoque
          </h2>
          <button
            onClick={onClose}
            className="text-[#6B6B6B] hover:text-[#1A1A1A]"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        <div className="mb-4 rounded-lg bg-[#F5F0EB] p-4">
          <p className="text-sm text-[#1A1A1A]">
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
              Quantidade *
            </label>
            <input
              type="number"
              value={quantidade}
              onChange={(e) => setQuantidade(e.target.value)}
              step="1"
              className="mt-1 w-full rounded-lg border border-[#E5E0DA] bg-white px-4 py-2 text-[#1A1A1A] focus:border-[#3D1A1A] focus:outline-none"
              placeholder="Digite a quantidade"
              disabled={carregando}
            />
            <p className="mt-1 text-xs text-[#6B6B6B]">
              Use números negativos para corrigir estoque para menos
            </p>
            {erro && (
              <p className="mt-1 text-xs text-[#CC0000]">{erro}</p>
            )}
          </div>

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
              style={{
                backgroundColor: botaoCor,
              }}
              className="flex-1 rounded-lg px-4 py-2 font-medium text-white transition-colors disabled:opacity-50 hover:opacity-90"
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = botaoCorHover;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = botaoCor;
              }}
              disabled={carregando}
            >
              {botaoTexto}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
