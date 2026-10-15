import { useState, useEffect, type FormEvent } from 'react';
import { XMarkIcon, XCircleIcon, PlusIcon } from '@heroicons/react/24/outline';
import type { Insumo } from '../../types';

interface NovoLote {
  quantidade: string;
  dataValidade: string;
}

interface ReporEstoqueModalProps {
  isOpen: boolean;
  insumo: Insumo | null;
  onClose: () => void;
  onSalvar: (lotes: Array<{ quantidade: number; dataValidade: string }>) => Promise<void>;
  carregando: boolean;
}

export function ReporEstoqueModal({
  isOpen,
  insumo,
  onClose,
  onSalvar,
  carregando,
}: ReporEstoqueModalProps) {
  const [novosLotes, setNovosLotes] = useState<NovoLote[]>([
    { quantidade: '', dataValidade: '' },
  ]);
  const [erros, setErros] = useState<Record<number, string>>({});
  const [erroGeral, setErroGeral] = useState('');

  useEffect(() => {
    if (isOpen) {
      setNovosLotes([{ quantidade: '', dataValidade: '' }]);
      setErros({});
      setErroGeral('');
    }
  }, [isOpen]);

  const handleAdicionarLote = () => {
    setNovosLotes([...novosLotes, { quantidade: '', dataValidade: '' }]);
  };

  const handleRemoverLote = (idx: number) => {
    if (novosLotes.length > 1) {
      setNovosLotes(novosLotes.filter((_, i) => i !== idx));
      const novoErros = { ...erros };
      delete novoErros[idx];
      setErros(novoErros);
    }
  };

  const handleAtualizarLote = (idx: number, field: 'quantidade' | 'dataValidade', value: string) => {
    const novoLotes = [...novosLotes];
    novoLotes[idx][field] = value;
    setNovosLotes(novoLotes);

    // Limpa erro do campo ao editar
    if (erros[idx]) {
      const novoErros = { ...erros };
      delete novoErros[idx];
      setErros(novoErros);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErros({});
    setErroGeral('');

    const novoErros: Record<number, string> = {};

    for (let i = 0; i < novosLotes.length; i++) {
      const lote = novosLotes[i];
      if (!lote.quantidade) {
        novoErros[i] = 'Quantidade obrigatória';
      } else if (Number(lote.quantidade) <= 0) {
        novoErros[i] = 'Quantidade deve ser maior que 0';
      }
      if (!lote.dataValidade) {
        novoErros[i] = novoErros[i] ? novoErros[i] + ' e validade obrigatória' : 'Validade obrigatória';
      }
    }

    if (Object.keys(novoErros).length > 0) {
      setErros(novoErros);
      return;
    }

    try {
      const lotesParaAdicionar = novosLotes.map((lote) => ({
        quantidade: Number(lote.quantidade),
        dataValidade: lote.dataValidade,
      }));
      await onSalvar(lotesParaAdicionar);
      onClose();
    } catch (error: any) {
      setErroGeral(
        error?.response?.data?.message || 'Erro ao repor estoque. Tente novamente.'
      );
    }
  };

  if (!isOpen || !insumo) return null;

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
            <h3 className="mb-3 font-semibold text-[#1A1A1A]">Lotes a adicionar</h3>

            {novosLotes.map((lote, idx) => (
              <div key={idx} className="mb-3 rounded-lg border border-[#E5E0DA] p-4">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-xs text-[#6B6B6B]">Lote {idx + 1}</span>
                  {novosLotes.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoverLote(idx)}
                      aria-label="Remover lote" className="flex h-11 w-11 items-center justify-center text-[#CC0000] hover:text-[#B30000]"
                      disabled={carregando}
                    >
                      <XCircleIcon className="h-4 w-4" />
                    </button>
                  )}
                </div>

                <div className="space-y-3">
                  {/* Quantidade */}
                  <div>
                    <label className="block text-xs font-medium text-[#1A1A1A]">
                      Quantidade
                    </label>
                    <input
                      type="number"
                      value={lote.quantidade}
                      onChange={(e) => handleAtualizarLote(idx, 'quantidade', e.target.value)}
                      inputMode="decimal" step="0.01"
                      placeholder="Ex: 24"
                      className="mt-1 w-full rounded-lg border border-[#E5E0DA] bg-white px-3 py-2 text-sm text-[#1A1A1A] focus:border-[#3D1A1A] focus:outline-none"
                      disabled={carregando}
                    />
                  </div>

                  {/* Validade */}
                  <div>
                    <label className="block text-xs font-medium text-[#1A1A1A]">
                      Data de Validade
                    </label>
                    <input
                      type="date"
                      value={lote.dataValidade}
                      onChange={(e) => handleAtualizarLote(idx, 'dataValidade', e.target.value)}
                      className="mt-1 w-full rounded-lg border border-[#E5E0DA] bg-white px-3 py-2 text-sm text-[#1A1A1A] focus:border-[#3D1A1A] focus:outline-none"
                      disabled={carregando}
                    />
                  </div>

                  {erros[idx] && (
                    <p className="text-xs text-[#CC0000]">{erros[idx]}</p>
                  )}
                </div>
              </div>
            ))}

            {/* Botão Adicionar outro lote */}
            <button
              type="button"
              onClick={handleAdicionarLote}
              className="min-h-11 w-full rounded-lg border border-dashed border-[#3D1A1A] px-4 py-2 text-sm font-medium text-[#3D1A1A] transition-colors hover:bg-[#F5F0EB]"
              disabled={carregando}
            >
              <PlusIcon className="inline h-4 w-4 mr-1" /> Adicionar outro lote
            </button>
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
            <button
              type="submit"
              className="min-h-11 flex-1 rounded-lg bg-[#3D1A1A] px-4 py-2 font-medium text-white transition-colors hover:bg-[#2D1515] disabled:opacity-50"
              disabled={carregando}
            >
              {carregando ? 'Salvando...' : 'Repor Estoque'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
