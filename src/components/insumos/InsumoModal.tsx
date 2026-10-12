import { useState, useEffect, type FormEvent } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import type { Insumo } from '../../types';

const OPCOES_UNIDADE_CONSUMO = [
  { texto: 'Unidade', valor: 'un' },
  { texto: 'Gramas', valor: 'g' },
  { texto: 'Quilos', valor: 'kg' },
  { texto: 'Mililitros', valor: 'ml' },
  { texto: 'Litros', valor: 'l' },
];

interface InsumoModalProps {
  isOpen: boolean;
  insumo?: Insumo | null;
  onClose: () => void;
  onSalvar: (dados: any) => Promise<void>;
  carregando: boolean;
}

export function InsumoModal({
  isOpen,
  insumo,
  onClose,
  onSalvar,
  carregando,
}: InsumoModalProps) {
  const [nome, setNome] = useState('');
  const [dataValidade, setDataValidade] = useState('');
  const [quantidadeCompra, setQuantidadeCompra] = useState('');
  const [unidadeConsumo, setUnidadeConsumo] = useState('');
  const [unidadeCompra, setUnidadeCompra] = useState('');
  const [conteudoUnidadeCompra, setConteudoUnidadeCompra] = useState('');
  const [precoUnidadeCompra, setPrecoUnidadeCompra] = useState('');
  const [estoqueMinimo, setEstoqueMinimo] = useState('');
  const [estoqueCritico, setEstoqueCritico] = useState('');
  const [diasAvisoValidade, setDiasAvisoValidade] = useState('');
  const [erros, setErros] = useState<Record<string, string>>({});
  const [erroGeral, setErroGeral] = useState('');

  const isEditing = !!insumo;
  const rotuloUnidadeCompra = unidadeCompra.trim() || 'unidade de compra';

  useEffect(() => {
    if (isOpen && insumo) {
      setNome(insumo.nome);
      setDataValidade('');
      setQuantidadeCompra('');
      setUnidadeConsumo(
        OPCOES_UNIDADE_CONSUMO.some((o) => o.valor === insumo.unidadeConsumo)
          ? insumo.unidadeConsumo
          : ''
      );
      setUnidadeCompra(insumo.unidadeCompra);
      setConteudoUnidadeCompra(String(insumo.conteudoUnidadeCompra));
      setPrecoUnidadeCompra(String(insumo.precoUnidadeCompra));
      setEstoqueMinimo(insumo.estoqueMinimo ? String(insumo.estoqueMinimo) : '');
      setEstoqueCritico(insumo.estoqueCritico ? String(insumo.estoqueCritico) : '');
      setDiasAvisoValidade(insumo.diasAvisoValidade ? String(insumo.diasAvisoValidade) : '');
    } else if (isOpen) {
      setNome('');
      setDataValidade('');
      setQuantidadeCompra('');
      setUnidadeConsumo('');
      setUnidadeCompra('');
      setConteudoUnidadeCompra('');
      setPrecoUnidadeCompra('');
      setEstoqueMinimo('');
      setEstoqueCritico('');
      setDiasAvisoValidade('');
    }
    setErros({});
    setErroGeral('');
  }, [isOpen, insumo]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErros({});
    setErroGeral('');

    if (!unidadeConsumo) {
      setErros({ unidadeConsumo: 'Obrigatório' });
      return;
    }

    try {
      const dados = isEditing
        ? {
            nome,
            dataValidade,
            unidadeConsumo,
            unidadeCompra,
            conteudoUnidadeCompra: Number(conteudoUnidadeCompra),
            precoUnidadeCompra: Number(precoUnidadeCompra),
            estoqueMinimo: estoqueMinimo ? Number(estoqueMinimo) : null,
            estoqueCritico: estoqueCritico ? Number(estoqueCritico) : null,
            diasAvisoValidade: diasAvisoValidade ? Number(diasAvisoValidade) : null,
          }
        : {
            nome,
            dataValidade,
            quantidadeCompra: Number(quantidadeCompra),
            unidadeConsumo,
            unidadeCompra,
            conteudoUnidadeCompra: Number(conteudoUnidadeCompra),
            precoUnidadeCompra: Number(precoUnidadeCompra),
            estoqueMinimo: estoqueMinimo ? Number(estoqueMinimo) : null,
            estoqueCritico: estoqueCritico ? Number(estoqueCritico) : null,
            diasAvisoValidade: diasAvisoValidade ? Number(diasAvisoValidade) : null,
          };

      await onSalvar(dados);
      onClose();
    } catch (error: any) {
      const errosDoBackend = error?.response?.data?.errors || {};
      if (Object.keys(errosDoBackend).length > 0) {
        setErros(errosDoBackend);
      } else {
        setErroGeral(
          error?.response?.data?.message || 'Erro ao salvar insumo. Tente novamente.'
        );
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/20">
      <div className="max-h-screen w-full max-w-md overflow-y-auto rounded-2xl bg-white p-8 shadow-xl">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-[#1A1A1A]">
            {isEditing ? 'Editar Insumo' : 'Adicionar Insumo'}
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
              Nome do insumo
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
              Como você compra esse insumo?
            </label>
            <input
              type="text"
              value={unidadeCompra}
              onChange={(e) => setUnidadeCompra(e.target.value)}
              placeholder="Ex: lata, pacote, kg, litro"
              className="mt-1 w-full rounded-lg border border-[#E5E0DA] bg-white px-4 py-2 text-[#1A1A1A] focus:border-[#3D1A1A] focus:outline-none"
              disabled={carregando}
            />
            {erros.unidadeCompra && (
              <p className="mt-1 text-xs text-[#CC0000]">
                {erros.unidadeCompra}
              </p>
            )}
          </div>

          {/* 3. Unidade de Consumo (campo isolado: futuramente vira select) */}
          <div>
            <label className="block text-sm font-medium text-[#1A1A1A]">
              Como você usa nas receitas?
            </label>
            <div className="mt-1 flex flex-wrap gap-2">
              {OPCOES_UNIDADE_CONSUMO.map((opcao) => {
                const selecionado = unidadeConsumo === opcao.valor;
                return (
                  <button
                    key={opcao.valor}
                    type="button"
                    onClick={() => setUnidadeConsumo(opcao.valor)}
                    aria-pressed={selecionado}
                    disabled={carregando}
                    className={`rounded-lg border px-3 py-2 text-sm font-medium transition-colors disabled:opacity-50 ${
                      selecionado
                        ? 'border-[#3D1A1A] bg-[#3D1A1A] text-white'
                        : 'border-[#E5E0DA] bg-white text-[#1A1A1A] hover:bg-[#F5F0EB]'
                    }`}
                  >
                    {opcao.texto}
                  </button>
                );
              })}
            </div>
            {erros.unidadeConsumo && (
              <p className="mt-1 text-xs text-[#CC0000]">
                {erros.unidadeConsumo}
              </p>
            )}
          </div>

          {/* 4. Conteúdo por Unidade de Compra */}
          <div>
            <label className="block text-sm font-medium text-[#1A1A1A]">
              Quanto vem em cada {rotuloUnidadeCompra}?
            </label>
            <input
              type="number"
              value={conteudoUnidadeCompra}
              onChange={(e) => setConteudoUnidadeCompra(e.target.value)}
              step="0.01"
              className="mt-1 w-full rounded-lg border border-[#E5E0DA] bg-white px-4 py-2 text-[#1A1A1A] focus:border-[#3D1A1A] focus:outline-none"
              disabled={carregando}
            />
            <p className="mt-1 text-xs text-[#6B6B6B]">
              Ex: se você compra uma lata, quantos ml/g tem dentro dela?
            </p>
            {erros.conteudoUnidadeCompra && (
              <p className="mt-1 text-xs text-[#CC0000]">
                {erros.conteudoUnidadeCompra}
              </p>
            )}
          </div>

          {/* 5. Quantidade de Compra (só no criar) */}
          {!isEditing && (
            <div>
              <label className="block text-sm font-medium text-[#1A1A1A]">
                Quantidade comprada agora (em {rotuloUnidadeCompra})
              </label>
              <input
                type="number"
                value={quantidadeCompra}
                onChange={(e) => setQuantidadeCompra(e.target.value)}
                step="0.01"
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

          {/* 6. Preço por Unidade de Compra */}
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
              Ex: cada lata custou R$ 4,50
            </p>
            {erros.precoUnidadeCompra && (
              <p className="mt-1 text-xs text-[#CC0000]">
                {erros.precoUnidadeCompra}
              </p>
            )}
          </div>

          {/* 7. Validade dessa compra (só no criar) */}
          {!isEditing && (
            <div>
              <label className="block text-sm font-medium text-[#1A1A1A]">
                Validade dessa compra
              </label>
              <input
                type="date"
                value={dataValidade}
                onChange={(e) => setDataValidade(e.target.value)}
                className="mt-1 w-full rounded-lg border border-[#E5E0DA] bg-white px-4 py-2 text-[#1A1A1A] focus:border-[#3D1A1A] focus:outline-none"
                disabled={carregando}
              />
              {erros.dataValidade && (
                <p className="mt-1 text-xs text-[#CC0000]">{erros.dataValidade}</p>
              )}
            </div>
          )}

          {/* 8. Seção de Alertas */}
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
                step="0.01"
                className="mt-1 w-full rounded-lg border border-[#E5E0DA] bg-white px-4 py-2 text-[#1A1A1A] focus:border-[#3D1A1A] focus:outline-none"
                disabled={carregando}
              />
              <p className="mt-1 text-xs text-[#6B6B6B]">
                Quantidade que você considera baixa
              </p>
            </div>

            {/* Estoque Crítico */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-[#1A1A1A]">
                Me avise quando estiver quase acabando
              </label>
              <input
                type="number"
                value={estoqueCritico}
                onChange={(e) => setEstoqueCritico(e.target.value)}
                step="0.01"
                className="mt-1 w-full rounded-lg border border-[#E5E0DA] bg-white px-4 py-2 text-[#1A1A1A] focus:border-[#3D1A1A] focus:outline-none"
                disabled={carregando}
              />
              <p className="mt-1 text-xs text-[#6B6B6B]">
                Quantidade que você considera urgente
              </p>
            </div>

            {/* Dias de Aviso de Validade */}
            <div>
              <label className="block text-sm font-medium text-[#1A1A1A]">
                Me avise quantos dias antes de vencer?
              </label>
              <input
                type="number"
                value={diasAvisoValidade}
                onChange={(e) => setDiasAvisoValidade(e.target.value)}
                step="1"
                className="mt-1 w-full rounded-lg border border-[#E5E0DA] bg-white px-4 py-2 text-[#1A1A1A] focus:border-[#3D1A1A] focus:outline-none"
                disabled={carregando}
              />
              <p className="mt-1 text-xs text-[#6B6B6B]">
                Ex: 7 = avisa 7 dias antes da validade
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
