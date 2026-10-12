import { useState, useEffect, type FormEvent } from 'react';
import { XMarkIcon, XCircleIcon, InformationCircleIcon } from '@heroicons/react/24/outline';
import type { Receita } from '../../types';

interface ReceitaModalProps {
  isOpen: boolean;
  receita?: Receita | null;
  insumos: Array<{ id: number; nome: string; unidadeConsumo: string }>;
  onClose: () => void;
  onSalvar: (dados: any, forcarCriacao?: boolean) => Promise<void>;
  carregando: boolean;
}

interface IngredienteAdicionado {
  insumoId: number;
  nomeInsumo: string;
  quantidadeUtilizada: number;
  unidadeConsumo: string;
}

export function ReceitaModal({
  isOpen,
  receita,
  insumos,
  onClose,
  onSalvar,
  carregando,
}: ReceitaModalProps) {
  const [nome, setNome] = useState('');
  const [rendimento, setRendimento] = useState('');
  const [unidadeRendimento, setUnidadeRendimento] = useState('');
  const [modoPreparo, setModoPreparo] = useState('');
  const [ingredientes, setIngredientes] = useState<IngredienteAdicionado[]>([]);
  const [insumoSelecionado, setInsumoSelecionado] = useState('');
  const [quantidadeInsumo, setQuantidadeInsumo] = useState('');
  const [erros, setErros] = useState<Record<string, string>>({});
  const [erroGeral, setErroGeral] = useState('');
  const [avisoEquipo, setAvisoEquipo] = useState('');

  const isEditing = !!receita;

  useEffect(() => {
    if (isOpen && receita) {
      setNome(receita.nome);
      setRendimento(String(receita.rendimento));
      setUnidadeRendimento(receita.unidadeRendimento);
      setModoPreparo(receita.modoPreparo || '');
      setIngredientes(
        receita.insumos.map((insumo) => ({
          insumoId: insumo.insumoId,
          nomeInsumo: insumo.nomeInsumo,
          quantidadeUtilizada: insumo.quantidadeUtilizada,
          unidadeConsumo: insumo.unidadeConsumo,
        }))
      );
    } else if (isOpen) {
      setNome('');
      setRendimento('');
      setUnidadeRendimento('');
      setModoPreparo('');
      setIngredientes([]);
      setInsumoSelecionado('');
      setQuantidadeInsumo('');
    }
    setErros({});
    setErroGeral('');
    setAvisoEquipo('');
  }, [isOpen, receita]);

  const handleAdicionarIngrediente = (e: FormEvent) => {
    e.preventDefault();

    if (!insumoSelecionado || !quantidadeInsumo) {
      return;
    }

    const insumoId = Number(insumoSelecionado);
    const insumo = insumos.find((i) => i.id === insumoId);
    if (!insumo) return;

    setIngredientes([
      ...ingredientes,
      {
        insumoId,
        nomeInsumo: insumo.nome,
        quantidadeUtilizada: Number(quantidadeInsumo),
        unidadeConsumo: insumo.unidadeConsumo,
      },
    ]);

    setInsumoSelecionado('');
    setQuantidadeInsumo('');
  };

  const handleRemoverIngrediente = (idx: number) => {
    setIngredientes(ingredientes.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e: FormEvent, forcar: boolean = false) => {
    e.preventDefault();
    setErros({});
    setErroGeral('');
    setAvisoEquipo('');

    const novoErros: Record<string, string> = {};
    if (!nome.trim()) novoErros.nome = 'Nome obrigatório';
    if (!rendimento) novoErros.rendimento = 'Obrigatório';
    if (!unidadeRendimento.trim()) novoErros.unidadeRendimento = 'Obrigatório';
    if (ingredientes.length === 0) {
      novoErros.ingredientes = 'Adicione pelo menos um ingrediente';
    }

    if (Object.keys(novoErros).length > 0) {
      setErros(novoErros);
      return;
    }

    try {
      const dados = {
        nome: nome.trim(),
        rendimento: Number(rendimento),
        unidadeRendimento: unidadeRendimento.trim(),
        ...(modoPreparo.trim() && { modoPreparo: modoPreparo.trim() }),
        insumos: ingredientes.map((ing) => ({
          insumoId: ing.insumoId,
          quantidadeUtilizada: ing.quantidadeUtilizada,
        })),
      };

      await onSalvar(dados, forcar);
    } catch (err: any) {
      const mensagem = err?.response?.data?.message || 'Erro ao salvar receita';

      if (
        !forcar &&
        mensagem.includes('Já existe uma receita chamada')
      ) {
        setAvisoEquipo(mensagem);
      } else {
        setErroGeral(mensagem);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/20">
      <div className="max-h-screen w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-8 shadow-xl">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-[#1A1A1A]">
            {isEditing ? 'Editar Receita' : 'Adicionar Receita'}
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

        {avisoEquipo && (
          <div className="mb-4 rounded-lg bg-[#FFFAF0] p-4 border border-[#FFB800]">
            <div className="flex items-start gap-3">
              <XCircleIcon className="h-5 w-5 text-[#FFB800] flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm text-[#8B6914]">{avisoEquipo}</p>
                <p className="mt-2 text-xs text-[#8B6914]">
                  Deseja criar mesmo assim?
                </p>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={(e) => handleSubmit(e, false)} className="space-y-4">
          {/* Nome */}
          <div>
            <label className="block text-sm font-medium text-[#1A1A1A]">
              Nome da receita
            </label>
            <input
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Ex: Bolo de Chocolate"
              className="mt-1 w-full rounded-lg border border-[#E5E0DA] bg-white px-4 py-2 text-[#1A1A1A] focus:border-[#3D1A1A] focus:outline-none"
              disabled={carregando}
            />
            {erros.nome && (
              <p className="mt-1 text-xs text-[#CC0000]">{erros.nome}</p>
            )}
          </div>

          {/* Rendimento */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <div className="relative inline-block group">
                <label className="block text-sm font-medium text-[#1A1A1A]">
                  Rendimento{' '}
                  <span className="inline-flex items-center">
                    <InformationCircleIcon className="h-4 w-4 text-[#6B6B6B] cursor-help" />
                    <div className="absolute bottom-full left-0 mb-2 hidden group-hover:block bg-[#1A1A1A] text-white text-xs rounded-lg px-3 py-2 whitespace-normal w-48 z-10 pointer-events-none shadow-lg">
                      Quantidade que essa receita produz (número). Ex: 40
                    </div>
                  </span>
                </label>
              </div>
              <input
                type="number"
                value={rendimento}
                onChange={(e) => setRendimento(e.target.value)}
                placeholder="Ex: 40"
                step="1"
                className="mt-1 w-full rounded-lg border border-[#E5E0DA] bg-white px-4 py-2 text-[#1A1A1A] focus:border-[#3D1A1A] focus:outline-none"
                disabled={carregando}
              />
              {erros.rendimento && (
                <p className="mt-1 text-xs text-[#CC0000]">{erros.rendimento}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-[#1A1A1A]">
                Unidade
              </label>
              <input
                type="text"
                value={unidadeRendimento}
                onChange={(e) => setUnidadeRendimento(e.target.value)}
                placeholder="Ex: unidades, porções"
                className="mt-1 w-full rounded-lg border border-[#E5E0DA] bg-white px-4 py-2 text-[#1A1A1A] focus:border-[#3D1A1A] focus:outline-none"
                disabled={carregando}
              />
              {erros.unidadeRendimento && (
                <p className="mt-1 text-xs text-[#CC0000]">
                  {erros.unidadeRendimento}
                </p>
              )}
            </div>
          </div>

          {/* Ingredientes */}
          <div className="border-t border-[#E5E0DA] pt-4">
            <h3 className="mb-3 font-semibold text-[#1A1A1A]">Ingredientes</h3>

            {erros.ingredientes && (
              <p className="mb-3 text-xs text-[#CC0000]">{erros.ingredientes}</p>
            )}

            <div className="mb-4 space-y-3">
              <div>
                <label className="block text-sm font-medium text-[#1A1A1A]">
                  Selecione um insumo
                </label>
                <select
                  value={insumoSelecionado}
                  onChange={(e) => setInsumoSelecionado(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-[#E5E0DA] bg-white px-4 py-2 text-[#1A1A1A] focus:border-[#3D1A1A] focus:outline-none"
                  disabled={carregando}
                >
                  <option value="">Escolha um ingrediente...</option>
                  {insumos.map((insumo) => (
                    <option key={insumo.id} value={insumo.id}>
                      {insumo.nome}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#1A1A1A]">
                  Quantidade utilizada
                </label>
                <input
                  type="number"
                  value={quantidadeInsumo}
                  onChange={(e) => setQuantidadeInsumo(e.target.value)}
                  placeholder="Ex: 150"
                  step="0.01"
                  className="mt-1 w-full rounded-lg border border-[#E5E0DA] bg-white px-4 py-2 text-[#1A1A1A] focus:border-[#3D1A1A] focus:outline-none"
                  disabled={carregando}
                />
              </div>

              <button
                type="button"
                onClick={handleAdicionarIngrediente}
                className="w-full rounded-lg border border-[#3D1A1A] px-4 py-2 font-medium text-[#3D1A1A] transition-colors hover:bg-[#F5F0EB]"
                disabled={carregando || !insumoSelecionado || !quantidadeInsumo}
              >
                + Adicionar
              </button>
            </div>

            {ingredientes.length > 0 && (
              <div className="space-y-2">
                {ingredientes.map((ing, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between rounded-lg bg-[#F5F0EB] p-3"
                  >
                    <div>
                      <p className="font-medium text-[#1A1A1A]">
                        {ing.nomeInsumo}
                      </p>
                      <p className="text-sm text-[#6B6B6B]">
                        {ing.quantidadeUtilizada} {ing.unidadeConsumo}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoverIngrediente(idx)}
                      className="text-[#CC0000] hover:text-[#B30000]"
                      disabled={carregando}
                    >
                      <XCircleIcon className="h-5 w-5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Modo de Preparo */}
          <div>
            <label className="block text-sm font-medium text-[#1A1A1A]">
              Modo de Preparo (opcional)
            </label>
            <textarea
              value={modoPreparo}
              onChange={(e) => setModoPreparo(e.target.value)}
              placeholder="Descreva o passo a passo de preparo..."
              rows={6}
              className="mt-1 w-full rounded-lg border border-[#E5E0DA] bg-white px-4 py-2 text-[#1A1A1A] focus:border-[#3D1A1A] focus:outline-none"
              disabled={carregando}
            />
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
              {carregando ? 'Salvando...' : 'Salvar Receita'}
            </button>
            {avisoEquipo && (
              <button
                type="button"
                onClick={(e) => handleSubmit(e, true)}
                className="flex-1 rounded-lg bg-[#FFB800] px-4 py-2 font-medium text-[#8B6914] transition-colors hover:bg-[#FFA500] disabled:opacity-50"
                disabled={carregando}
              >
                {carregando ? 'Criando...' : 'Criar mesmo assim'}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
