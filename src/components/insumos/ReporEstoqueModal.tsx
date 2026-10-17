import { useState, useEffect, type FormEvent } from 'react';
import { XMarkIcon, XCircleIcon, PlusIcon } from '@heroicons/react/24/outline';
import type { Insumo } from '../../types';
import {
  arredondar2,
  converterParaBase,
  formatarNumero,
  numeroOuNull,
  paraBase,
  paraCaixas,
  rotuloCaixa,
  type ModoUnidade,
} from '../../utils/unidades';

interface LoteForm {
  valor: string;
  modo: ModoUnidade;
  dataValidade: string;
}

interface ReporEstoqueModalProps {
  isOpen: boolean;
  insumo: Insumo | null;
  onClose: () => void;
  onSalvar: (lotes: Array<{ quantidade: number; dataValidade: string }>) => Promise<void>;
  carregando: boolean;
}

function novoLote(temConteudo: boolean): LoteForm {
  return { valor: '', modo: temConteudo ? 'caixa' : 'consumo', dataValidade: '' };
}

export function ReporEstoqueModal({
  isOpen,
  insumo,
  onClose,
  onSalvar,
  carregando,
}: ReporEstoqueModalProps) {
  const conteudo = insumo?.conteudoUnidadeCompra ?? 0;
  const temConteudo = conteudo > 0;
  const unidadeConsumo = insumo?.unidadeConsumo ?? '';
  const rotulo = rotuloCaixa(insumo?.unidadeCompra ?? '');

  const [lotes, setLotes] = useState<LoteForm[]>([novoLote(temConteudo)]);
  const [erros, setErros] = useState<Record<number, string>>({});
  const [erroGeral, setErroGeral] = useState('');

  useEffect(() => {
    if (isOpen) {
      setLotes([novoLote(temConteudo)]);
      setErros({});
      setErroGeral('');
    }
  }, [isOpen, temConteudo]);

  if (!isOpen || !insumo) return null;

  const baseDaLinha = (lote: LoteForm) => converterParaBase(lote.valor, lote.modo, conteudo);

  const atualizarLote = (idx: number, alteracao: Partial<LoteForm>) => {
    setLotes(lotes.map((lote, i) => (i === idx ? { ...lote, ...alteracao } : lote)));
    if (erros[idx]) {
      const novoErros = { ...erros };
      delete novoErros[idx];
      setErros(novoErros);
    }
  };

  const trocarModo = (idx: number, novoModo: ModoUnidade) => {
    const lote = lotes[idx];
    if (lote.modo === novoModo) return;
    const numero = numeroOuNull(lote.valor);
    let valor = lote.valor;
    if (numero !== null && temConteudo) {
      valor = String(novoModo === 'consumo' ? paraBase(numero, conteudo) : paraCaixas(numero, conteudo));
    }
    atualizarLote(idx, { modo: novoModo, valor });
  };

  const adicionarLote = () => {
    setLotes([...lotes, novoLote(temConteudo)]);
  };

  const removerLote = (idx: number) => {
    if (lotes.length > 1) {
      setLotes(lotes.filter((_, i) => i !== idx));
      const novoErros = { ...erros };
      delete novoErros[idx];
      setErros(novoErros);
    }
  };

  const textoConversao = (lote: LoteForm) => {
    const numero = numeroOuNull(lote.valor);
    if (numero === null || numero <= 0) return null;
    if (lote.modo === 'caixa') {
      const base = baseDaLinha(lote);
      return base === null ? null : `= ${formatarNumero(base)} ${unidadeConsumo}`;
    }
    return temConteudo ? `≈ ${formatarNumero(paraCaixas(numero, conteudo))} ${rotulo}` : null;
  };

  const basesValidas = lotes
    .map(baseDaLinha)
    .filter((base): base is number => base !== null && base > 0);
  const totalBase = arredondar2(basesValidas.reduce((soma, base) => soma + base, 0));
  const totalCaixas = temConteudo ? paraCaixas(totalBase, conteudo) : null;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErros({});
    setErroGeral('');

    const novoErros: Record<number, string> = {};

    lotes.forEach((lote, i) => {
      const numero = numeroOuNull(lote.valor);
      const base = baseDaLinha(lote);
      const mensagens: string[] = [];
      if (numero === null) {
        mensagens.push('Quantidade obrigatória');
      } else if (numero <= 0) {
        mensagens.push('Quantidade deve ser maior que 0');
      } else if (base === null) {
        mensagens.push('Este insumo não tem a quantidade por caixa cadastrada');
      }
      if (!lote.dataValidade) {
        mensagens.push('Validade obrigatória');
      }
      if (mensagens.length > 0) {
        novoErros[i] = mensagens.join(' e ');
      }
    });

    if (Object.keys(novoErros).length > 0) {
      setErros(novoErros);
      return;
    }

    try {
      const lotesParaAdicionar = lotes.map((lote) => ({
        quantidade: arredondar2(baseDaLinha(lote) ?? 0),
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
          <p className="break-words text-sm text-[#1A1A1A]">
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

            {lotes.map((lote, idx) => {
              const modoCaixa = lote.modo === 'caixa';
              const conversao = textoConversao(lote);
              return (
                <div key={idx} className="mb-3 rounded-lg border border-[#E5E0DA] p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <span className="text-xs text-[#6B6B6B]">Lote {idx + 1}</span>
                    {lotes.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removerLote(idx)}
                        aria-label="Remover lote"
                        className="flex h-11 w-11 items-center justify-center text-[#CC0000] hover:text-[#B30000]"
                        disabled={carregando}
                      >
                        <XCircleIcon className="h-5 w-5" />
                      </button>
                    )}
                  </div>

                  <div className="space-y-3">
                    {/* Quantidade */}
                    <div>
                      <label className="block text-sm font-medium text-[#1A1A1A]">
                        {modoCaixa ? `Quantas ${rotulo}?` : `Quantos ${unidadeConsumo}?`}
                      </label>
                      <input
                        type="number"
                        inputMode="decimal"
                        step="0.01"
                        value={lote.valor}
                        onChange={(e) => atualizarLote(idx, { valor: e.target.value })}
                        placeholder={modoCaixa ? 'Ex: 2' : 'Ex: 790'}
                        className="mt-1 w-full rounded-lg border border-[#E5E0DA] bg-white px-3 py-2 text-[#1A1A1A] focus:border-[#3D1A1A] focus:outline-none"
                        disabled={carregando}
                      />
                      {conversao && (
                        <p className="mt-1 text-sm text-[#1A1A1A]">{conversao}</p>
                      )}
                      {temConteudo && (
                        <button
                          type="button"
                          onClick={() => trocarModo(idx, modoCaixa ? 'consumo' : 'caixa')}
                          disabled={carregando}
                          className="mt-1 min-h-11 text-xs font-medium text-[#3D1A1A] underline"
                        >
                          {modoCaixa ? `informar em ${unidadeConsumo}` : `informar em ${rotulo}`}
                        </button>
                      )}
                    </div>

                    {/* Validade */}
                    <div>
                      <label className="block text-sm font-medium text-[#1A1A1A]">
                        Data de Validade
                      </label>
                      <input
                        type="date"
                        value={lote.dataValidade}
                        onChange={(e) => atualizarLote(idx, { dataValidade: e.target.value })}
                        className="mt-1 w-full rounded-lg border border-[#E5E0DA] bg-white px-3 py-2 text-[#1A1A1A] focus:border-[#3D1A1A] focus:outline-none"
                        disabled={carregando}
                      />
                    </div>

                    {erros[idx] && (
                      <p className="text-xs text-[#CC0000]">{erros[idx]}</p>
                    )}
                  </div>
                </div>
              );
            })}

            {/* Botão Adicionar outro lote */}
            <button
              type="button"
              onClick={adicionarLote}
              className="min-h-11 w-full rounded-lg border border-dashed border-[#3D1A1A] px-4 py-2 text-sm font-medium text-[#3D1A1A] transition-colors hover:bg-[#F5F0EB]"
              disabled={carregando}
            >
              <PlusIcon className="mr-1 inline h-4 w-4" /> Adicionar outro lote
            </button>

            {basesValidas.length > 0 && (
              <div className="mt-4 rounded-lg bg-[#F5F0EB] p-3">
                <p className="text-sm font-medium text-[#1A1A1A]">
                  {totalCaixas !== null
                    ? `Total: ${formatarNumero(totalCaixas)} ${rotulo} = ${formatarNumero(totalBase)} ${unidadeConsumo}`
                    : `Total: ${formatarNumero(totalBase)} ${unidadeConsumo}`}
                </p>
              </div>
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
