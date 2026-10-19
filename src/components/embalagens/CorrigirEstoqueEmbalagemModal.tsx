import { useState, useEffect, type FormEvent } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import type { Embalagem } from '../../types';
import { SeletorUnidade } from '../ui/SeletorUnidade';
import {
  formatarNumero,
  numeroOuNull,
  paraBase,
  paraCaixas,
  rotuloCaixa,
  type ModoUnidade,
} from '../../utils/unidades';

interface CorrigirEstoqueEmbalagemModalProps {
  isOpen: boolean;
  embalagem: Embalagem | null;
  onClose: () => void;
  onSalvar: (quantidade: number) => Promise<void>;
  carregando: boolean;
}

export function CorrigirEstoqueEmbalagemModal({
  isOpen,
  embalagem,
  onClose,
  onSalvar,
  carregando,
}: CorrigirEstoqueEmbalagemModalProps) {
  const conteudo = embalagem?.conteudoUnidadeCompra ?? 0;
  const temConteudo = conteudo > 0;

  const [quantidade, setQuantidade] = useState('');
  const [modo, setModo] = useState<ModoUnidade>('caixa');
  const [erro, setErro] = useState('');
  const [erroGeral, setErroGeral] = useState('');

  useEffect(() => {
    if (isOpen) {
      setQuantidade('');
      setModo(temConteudo ? 'caixa' : 'consumo');
      setErro('');
      setErroGeral('');
    }
  }, [isOpen, temConteudo]);

  if (!isOpen || !embalagem) return null;

  const rotulo = rotuloCaixa(embalagem.unidadeCompra);
  const estoque = embalagem.estoqueTotal;
  const numero = numeroOuNull(quantidade);
  const base =
    numero === null
      ? null
      : modo === 'consumo'
        ? numero
        : temConteudo
          ? paraBase(numero, conteudo)
          : null;
  const naoInteiro = base !== null && !Number.isInteger(base);
  const excede = base !== null && Number.isInteger(base) && base > estoque;

  const trocarModo = (novo: ModoUnidade) => {
    if (novo === modo) return;
    if (numero !== null && temConteudo) {
      setQuantidade(String((novo === 'consumo' ? paraBase(numero, conteudo) : paraCaixas(numero, conteudo)) ?? ''));
    }
    setModo(novo);
    setErro('');
  };

  const handleTirarTudo = () => {
    setModo('consumo');
    setQuantidade(String(estoque));
    setErro('');
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErro('');
    setErroGeral('');

    if (numero === null) {
      setErro('Quantidade obrigatória');
      return;
    }
    if (numero <= 0) {
      setErro('Quantidade deve ser maior que 0');
      return;
    }
    if (base === null) {
      setErro('Esta embalagem não tem a quantidade por caixa cadastrada');
      return;
    }
    if (naoInteiro || excede) return;

    try {
      await onSalvar(base);
      onClose();
    } catch (error: any) {
      setErroGeral(
        error?.response?.data?.message || 'Erro ao corrigir estoque. Tente novamente.'
      );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex backdrop-blur-sm bg-black/20 sm:items-center sm:justify-center">
      <div className="h-dvh w-full overflow-y-auto overscroll-contain bg-white p-4 shadow-xl sm:h-auto sm:max-h-[90dvh] sm:max-w-md sm:rounded-2xl sm:p-8">
        <div className="sticky top-0 z-10 -mx-4 -mt-4 mb-4 flex items-center justify-between bg-white px-4 pb-3 pt-4 sm:mx-0 sm:mt-0 sm:mb-6 sm:p-0">
          <h2 className="text-2xl font-semibold text-[#1A1A1A]">
            Corrigir Estoque
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
            Estoque atual: <span className="font-semibold">{formatarNumero(estoque)} unidades</span>
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
              Quanto você perdeu ou tirou?
            </label>
            <input
              type="number"
              inputMode={modo === 'caixa' ? 'decimal' : 'numeric'}
              value={quantidade}
              onChange={(e) => setQuantidade(e.target.value)}
              step={modo === 'caixa' ? '0.01' : '1'}
              placeholder="Ex: 1"
              className="mt-1 w-full rounded-lg border border-[#E5E0DA] bg-white px-4 py-2 text-[#1A1A1A] focus:border-[#3D1A1A] focus:outline-none"
              disabled={carregando}
            />
            {temConteudo && (
              <div className="mt-2">
                <SeletorUnidade<ModoUnidade>
                  opcoes={[
                    { valor: 'caixa', texto: rotulo },
                    { valor: 'consumo', texto: 'unidades' },
                  ]}
                  valor={modo}
                  onChange={trocarModo}
                  disabled={carregando}
                />
              </div>
            )}
            {temConteudo && modo === 'caixa' && (
              <p className="mt-2 text-sm text-[#6B6B6B]">
                1 {rotulo} = {formatarNumero(conteudo)} unidades.
              </p>
            )}
            {naoInteiro && (
              <p className="mt-2 rounded-lg border border-[#FFB800] bg-[#FFFAF0] p-2 text-sm text-[#8B6914]">
                Isso dá {formatarNumero(base)} unidades. Informe um valor inteiro de unidades.
              </p>
            )}
            {!naoInteiro && base !== null && numero !== null && numero > 0 && (
              <p className="mt-1 text-sm font-medium text-[#1A1A1A]">
                Vão sair {formatarNumero(base)} unidades.
              </p>
            )}
            {erro && (
              <p className="mt-1 text-xs text-[#CC0000]">{erro}</p>
            )}
          </div>

          {excede && (
            <div className="rounded-lg border border-[#FFB800] bg-[#FFFAF0] p-3">
              <p className="text-sm text-[#8B6914]">Você só tem {formatarNumero(estoque)} unidades.</p>
              <button
                type="button"
                onClick={handleTirarTudo}
                disabled={carregando}
                className="mt-2 min-h-11 w-full rounded-lg border border-[#8B6914] px-4 py-2 text-sm font-medium text-[#8B6914] transition-colors hover:bg-[#FFF3D6]"
              >
                Tirar tudo ({formatarNumero(estoque)} unidades)
              </button>
            </div>
          )}

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
              disabled={carregando || naoInteiro || excede || base === null}
            >
              {carregando ? 'Corrigindo...' : 'Confirmar correção'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
