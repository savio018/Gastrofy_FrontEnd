import { useState, useEffect, type FormEvent } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import type { Embalagem } from '../../types';
import type { CriarEmbalagemDTO } from '../../api/embalagens';

interface EmbalagemModalProps {
  isOpen: boolean;
  embalagem?: Embalagem | null;
  onClose: () => void;
  onSalvar: (dados: any) => Promise<void>;
  carregando: boolean;
}

export function EmbalagemModal({
  isOpen,
  embalagem,
  onClose,
  onSalvar,
  carregando,
}: EmbalagemModalProps) {
  const [nome, setNome] = useState('');
  const [quantidadeCompra, setQuantidadeCompra] = useState('');
  const [unidadeCompra, setUnidadeCompra] = useState('');
  const [conteudoUnidadeCompra, setConteudoUnidadeCompra] = useState('');
  const [precoUnidadeCompra, setPrecoUnidadeCompra] = useState('');
  const [estoqueMinimo, setEstoqueMinimo] = useState('');
  const [estoqueCritico, setEstoqueCritico] = useState('');
  const [erros, setErros] = useState<Record<string, string>>({});
  const [erroGeral, setErroGeral] = useState('');

  const isEditing = !!embalagem;
  const rotuloUnidadeCompra = unidadeCompra.trim() || 'unidade de compra';

  useEffect(() => {
    if (isOpen && embalagem) {
      setNome(embalagem.nome);
      setQuantidadeCompra('');
      setUnidadeCompra(embalagem.unidadeCompra);
      setConteudoUnidadeCompra(String(embalagem.conteudoUnidadeCompra));
      setPrecoUnidadeCompra(String(embalagem.precoUnidadeCompra));
      setEstoqueMinimo(embalagem.estoqueMinimo ? String(embalagem.estoqueMinimo) : '');
      setEstoqueCritico(embalagem.estoqueCritico ? String(embalagem.estoqueCritico) : '');
    } else if (isOpen) {
      setNome('');
      setQuantidadeCompra('');
      setUnidadeCompra('');
      setConteudoUnidadeCompra('');
      setPrecoUnidadeCompra('');
      setEstoqueMinimo('');
      setEstoqueCritico('');
    }
    setErros({});
    setErroGeral('');
  }, [isOpen, embalagem]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErros({});
    setErroGeral('');

    const novoErros: Record<string, string> = {};
    if (!nome.trim()) novoErros.nome = 'Nome obrigatório';
    if (!unidadeCompra.trim()) novoErros.unidadeCompra = 'Obrigatório';
    if (!conteudoUnidadeCompra) novoErros.conteudoUnidadeCompra = 'Obrigatório';
    if (!precoUnidadeCompra) novoErros.precoUnidadeCompra = 'Obrigatório';
    if (!isEditing && !quantidadeCompra) novoErros.quantidadeCompra = 'Obrigatório';

    if (Object.keys(novoErros).length > 0) {
      setErros(novoErros);
      return;
    }

    try {
      const dados = {
        nome: nome.trim(),
        unidadeCompra: unidadeCompra.trim(),
        conteudoUnidadeCompra: Number(conteudoUnidadeCompra),
        precoUnidadeCompra: Number(precoUnidadeCompra),
        ...(estoqueMinimo && { estoqueMinimo: Number(estoqueMinimo) }),
        ...(estoqueCritico && { estoqueCritico: Number(estoqueCritico) }),
      };

      if (!isEditing) {
        (dados as CriarEmbalagemDTO).quantidadeCompra = Number(quantidadeCompra);
      }

      await onSalvar(dados);
    } catch (err: any) {
      setErroGeral(err?.response?.data?.message || 'Erro ao salvar embalagem');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/20">
      <div className="max-h-screen w-full max-w-md overflow-y-auto rounded-2xl bg-white p-8 shadow-xl">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-[#1A1A1A]">
            {isEditing ? 'Editar Embalagem' : 'Adicionar Embalagem'}
          </h2>
          <button
            onClick={onClose}
            className="text-[#6B6B6B] hover:text-[#1A1A1A]"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        {erroGeral && (
          <div className="mb-4 rounded-lg bg-[#FFF5F5] p-3 text-sm text-[#CC0000]">
            {erroGeral}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* 1. Nome */}
          <div>
            <label className="block text-sm font-medium text-[#1A1A1A]">
              Nome da embalagem
            </label>
            <input
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              className="mt-1 w-full rounded-lg border border-[#E5E0DA] bg-white px-4 py-2 text-[#1A1A1A] focus:border-[#3D1A1A] focus:outline-none"
              disabled={carregando}
            />
            {erros.nome && (
              <p className="mt-1 text-xs text-[#CC0000]">{erros.nome}</p>
            )}
          </div>

          {/* 2. Unidade de Compra */}
          <div>
            <label className="block text-sm font-medium text-[#1A1A1A]">
              Como você compra essa embalagem?
            </label>
            <input
              type="text"
              value={unidadeCompra}
              onChange={(e) => setUnidadeCompra(e.target.value)}
              placeholder="Ex: caixa, pacote, kg"
              className="mt-1 w-full rounded-lg border border-[#E5E0DA] bg-white px-4 py-2 text-[#1A1A1A] focus:border-[#3D1A1A] focus:outline-none"
              disabled={carregando}
            />
            {erros.unidadeCompra && (
              <p className="mt-1 text-xs text-[#CC0000]">
                {erros.unidadeCompra}
              </p>
            )}
          </div>

          {/* 3. Conteúdo por Unidade de Compra */}
          <div>
            <label className="block text-sm font-medium text-[#1A1A1A]">
              Quanto vem em cada {rotuloUnidadeCompra}?
            </label>
            <input
              type="number"
              value={conteudoUnidadeCompra}
              onChange={(e) => setConteudoUnidadeCompra(e.target.value)}
              step="1"
              className="mt-1 w-full rounded-lg border border-[#E5E0DA] bg-white px-4 py-2 text-[#1A1A1A] focus:border-[#3D1A1A] focus:outline-none"
              disabled={carregando}
            />
            <p className="mt-1 text-xs text-[#6B6B6B]">
              Ex: se você compra uma caixa, quantas unidades tem dentro dela?
            </p>
            {erros.conteudoUnidadeCompra && (
              <p className="mt-1 text-xs text-[#CC0000]">
                {erros.conteudoUnidadeCompra}
              </p>
            )}
          </div>

          {/* 4. Quantidade de Compra (só no criar) */}
          {!isEditing && (
            <div>
              <label className="block text-sm font-medium text-[#1A1A1A]">
                Quantidade comprada agora (em {rotuloUnidadeCompra})
              </label>
              <input
                type="number"
                value={quantidadeCompra}
                onChange={(e) => setQuantidadeCompra(e.target.value)}
                step="1"
                placeholder="Ex: 5"
                className="mt-1 w-full rounded-lg border border-[#E5E0DA] bg-white px-4 py-2 text-[#1A1A1A] focus:border-[#3D1A1A] focus:outline-none"
                disabled={carregando}
              />
              <p className="mt-1 text-xs text-[#6B6B6B]">
                Ex: comprei 5 pacotes/latas
              </p>
              {erros.quantidadeCompra && (
                <p className="mt-1 text-xs text-[#CC0000]">
                  {erros.quantidadeCompra}
                </p>
              )}
            </div>
          )}

          {/* 5. Preço */}
          <div>
            <label className="block text-sm font-medium text-[#1A1A1A]">
              Quanto custou cada {rotuloUnidadeCompra}?
            </label>
            <input
              type="number"
              value={precoUnidadeCompra}
              onChange={(e) => setPrecoUnidadeCompra(e.target.value)}
              step="0.01"
              placeholder="Ex: 4.50"
              className="mt-1 w-full rounded-lg border border-[#E5E0DA] bg-white px-4 py-2 text-[#1A1A1A] focus:border-[#3D1A1A] focus:outline-none"
              disabled={carregando}
            />
            <p className="mt-1 text-xs text-[#6B6B6B]">
              Ex: cada caixa custou R$ 4,50
            </p>
            {erros.precoUnidadeCompra && (
              <p className="mt-1 text-xs text-[#CC0000]">
                {erros.precoUnidadeCompra}
              </p>
            )}
          </div>

          {/* Seção de Alertas */}
          <div className="border-t border-[#E5E0DA] pt-4">
            <h3 className="text-sm font-semibold text-[#1A1A1A] mb-4">
              Alertas (opcional)
            </h3>

            {/* Estoque Mínimo */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-[#1A1A1A]">
                Me avise quando sobrar pouco
              </label>
              <input
                type="number"
                value={estoqueMinimo}
                onChange={(e) => setEstoqueMinimo(e.target.value)}
                step="1"
                className="mt-1 w-full rounded-lg border border-[#E5E0DA] bg-white px-4 py-2 text-[#1A1A1A] focus:border-[#3D1A1A] focus:outline-none"
                disabled={carregando}
              />
              <p className="mt-1 text-xs text-[#6B6B6B]">
                Quantidade que você considera baixa
              </p>
            </div>

            {/* Estoque Crítico */}
            <div>
              <label className="block text-sm font-medium text-[#1A1A1A]">
                Me avise quando estiver quase acabando
              </label>
              <input
                type="number"
                value={estoqueCritico}
                onChange={(e) => setEstoqueCritico(e.target.value)}
                step="1"
                className="mt-1 w-full rounded-lg border border-[#E5E0DA] bg-white px-4 py-2 text-[#1A1A1A] focus:border-[#3D1A1A] focus:outline-none"
                disabled={carregando}
              />
              <p className="mt-1 text-xs text-[#6B6B6B]">
                Quantidade que você considera urgente
              </p>
            </div>
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
              {carregando ? 'Salvando...' : 'Salvar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
