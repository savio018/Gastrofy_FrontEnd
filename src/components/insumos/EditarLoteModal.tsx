import { useState, useEffect, type FormEvent } from 'react';
import { XMarkIcon, MinusIcon, PlusIcon } from '@heroicons/react/24/outline';
import type { Insumo, LoteInsumo } from '../../types';
import { formatarDataLocal } from '../../lib/datas';
import { SeletorUnidade } from '../ui/SeletorUnidade';
import {
  arredondar2,
  formatarNumero,
  numeroOuNull,
  paraBase,
  paraCaixas,
  rotuloCaixa,
  type ModoUnidade,
} from '../../utils/unidades';

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
  const [valor, setValor] = useState('');
  const [modo, setModo] = useState<ModoUnidade>('caixa');
  const [erro, setErro] = useState('');
  const [erroGeral, setErroGeral] = useState('');
  const [confirmaDelecao, setConfirmaDelecao] = useState(false);

  const conteudo = insumo?.conteudoUnidadeCompra ?? 0;
  const temConteudo = conteudo > 0;

  useEffect(() => {
    if (isOpen && lote) {
      const modoInicial: ModoUnidade = temConteudo ? 'caixa' : 'consumo';
      setModo(modoInicial);
      setValor(String(modoInicial === 'caixa' ? (paraCaixas(lote.quantidade, conteudo) ?? '') : lote.quantidade));
      setErro('');
      setErroGeral('');
      setConfirmaDelecao(false);
    }
  }, [isOpen, lote, insumo, temConteudo, conteudo]);

  if (!isOpen || !insumo || !lote) return null;

  const unidadeConsumo = insumo.unidadeConsumo;
  const rotulo = rotuloCaixa(insumo.unidadeCompra);
  const numero = numeroOuNull(valor);
  const qtdBase =
    numero === null
      ? null
      : modo === 'consumo'
        ? numero
        : temConteudo
          ? paraBase(numero, conteudo)
          : null;

  const alterarValor = (novo: number) => {
    setValor(String(Math.max(0, arredondar2(novo))));
    setConfirmaDelecao(false);
  };

  const ajustar = (sinal: 1 | -1) => {
    const passo = modo === 'caixa' ? 1 : conteudo || 1;
    alterarValor((numero ?? 0) + sinal * passo);
  };

  const tirarMetade = () => {
    const metadeBase = arredondar2(lote.quantidade / 2);
    setValor(String(modo === 'caixa' && temConteudo ? (paraCaixas(metadeBase, conteudo) ?? '') : metadeBase));
    setConfirmaDelecao(false);
  };

  const trocarModo = (novo: ModoUnidade) => {
    if (novo === modo) return;
    if (numero !== null && temConteudo) {
      setValor(String((novo === 'consumo' ? paraBase(numero, conteudo) : paraCaixas(numero, conteudo)) ?? ''));
    }
    setModo(novo);
    setConfirmaDelecao(false);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErro('');
    setErroGeral('');

    if (numero === null) {
      setErro('Quantidade obrigatória');
      return;
    }
    if (numero < 0) {
      setErro('Quantidade não pode ser negativa');
      return;
    }
    if (qtdBase === null) {
      setErro('Este insumo não tem a quantidade por caixa cadastrada');
      return;
    }

    if (qtdBase === 0 && !confirmaDelecao) {
      setConfirmaDelecao(true);
      return;
    }

    try {
      await onSalvar(lote.id, arredondar2(qtdBase));
      onClose();
    } catch (error: any) {
      setErroGeral(
        error?.response?.data?.message || 'Erro ao editar lote. Tente novamente.'
      );
    }
  };

  const formatarData = (data: string) => formatarDataLocal(data);

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
        <div className="mb-4 space-y-2 rounded-lg bg-[#F5F0EB] p-4">
          <p className="break-words text-sm text-[#1A1A1A]">
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
          <div className="mb-4 rounded-lg border border-[#FFB800] bg-[#FFFAF0] p-4">
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
              {modo === 'caixa' ? `Quantas ${rotulo} tem agora?` : `Quantos ${unidadeConsumo} tem agora?`}
            </label>
            <div className="mt-1 flex items-center gap-2">
              <button
                type="button"
                onClick={() => ajustar(-1)}
                disabled={carregando || (numero ?? 0) <= 0}
                aria-label="Diminuir"
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-[#E5E0DA] text-[#1A1A1A] transition-colors hover:bg-[#F5F0EB] disabled:opacity-50"
              >
                <MinusIcon className="h-5 w-5" />
              </button>
              <input
                type="number"
                inputMode="decimal"
                value={valor}
                onChange={(e) => {
                  setValor(e.target.value);
                  setConfirmaDelecao(false);
                }}
                step="0.01"
                placeholder="Ex: 5"
                className="w-full min-w-0 rounded-lg border border-[#E5E0DA] bg-white px-4 py-2 text-center text-[#1A1A1A] focus:border-[#3D1A1A] focus:outline-none"
                disabled={carregando}
              />
              <button
                type="button"
                onClick={() => ajustar(1)}
                disabled={carregando}
                aria-label="Aumentar"
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-[#E5E0DA] text-[#1A1A1A] transition-colors hover:bg-[#F5F0EB] disabled:opacity-50"
              >
                <PlusIcon className="h-5 w-5" />
              </button>
            </div>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={tirarMetade}
                disabled={carregando || lote.quantidade <= 0}
                className="min-h-11 rounded-lg border border-[#3D1A1A] px-3 py-2 text-sm font-medium text-[#3D1A1A] transition-colors hover:bg-[#F5F0EB] disabled:opacity-50"
              >
                Tirar metade
              </button>
            </div>
            {temConteudo && (
              <div className="mt-3">
                <SeletorUnidade<ModoUnidade>
                  opcoes={[
                    { valor: 'caixa', texto: rotulo },
                    { valor: 'consumo', texto: unidadeConsumo || 'unidade' },
                  ]}
                  valor={modo}
                  onChange={trocarModo}
                  disabled={carregando}
                />
              </div>
            )}
            {qtdBase !== null && (
              <p className="mt-2 text-sm font-medium text-[#1A1A1A]">
                {modo === 'caixa' || !temConteudo
                  ? `= ${formatarNumero(qtdBase)} ${unidadeConsumo}`
                  : `= ${formatarNumero(paraCaixas(qtdBase, conteudo))} ${rotulo}`}
              </p>
            )}
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
