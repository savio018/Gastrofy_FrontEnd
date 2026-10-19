import { useState, useEffect, type FormEvent } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import type { Insumo } from '../../types';
import { SeletorUnidade } from '../ui/SeletorUnidade';
import {
  converterParaBase,
  formatarNumero,
  paraCaixas,
  rotuloCaixa,
  type ModoUnidade,
} from '../../utils/unidades';

const OPCOES_UNIDADE_CONSUMO = [
  { texto: 'Unidade', valor: 'un' },
  { texto: 'Gramas', valor: 'g' },
  { texto: 'Quilos', valor: 'kg' },
  { texto: 'Mililitros', valor: 'ml' },
  { texto: 'Litros', valor: 'l' },
];

function limiteInicial(valor: number | null, conteudo: number): { texto: string; modo: ModoUnidade } {
  if (!valor) return { texto: '', modo: 'caixa' };
  if (conteudo > 0) return { texto: String(paraCaixas(valor, conteudo) ?? ''), modo: 'caixa' };
  return { texto: String(valor), modo: 'consumo' };
}

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
  const [modoMinimo, setModoMinimo] = useState<ModoUnidade>('caixa');
  const [modoCritico, setModoCritico] = useState<ModoUnidade>('caixa');
  const [erros, setErros] = useState<Record<string, string>>({});
  const [erroGeral, setErroGeral] = useState('');

  const isEditing = !!insumo;
  const rotulo = rotuloCaixa(unidadeCompra);
  const conteudoNum = Number(conteudoUnidadeCompra);
  const opcoesLimite: Array<{ valor: ModoUnidade; texto: string }> = [
    { valor: 'caixa', texto: rotulo },
    { valor: 'consumo', texto: unidadeConsumo || 'unidade' },
  ];

  const textoConversao = (valor: string, modo: ModoUnidade) => {
    const base = converterParaBase(valor, modo, conteudoNum);
    if (base === null) return '';
    if (modo === 'consumo') {
      return conteudoNum > 0
        ? `≈ ${formatarNumero(paraCaixas(base, conteudoNum))} ${rotulo}`
        : '';
    }
    return `= ${formatarNumero(base)} ${unidadeConsumo}`;
  };

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
      const minimo = limiteInicial(insumo.estoqueMinimo, insumo.conteudoUnidadeCompra);
      const critico = limiteInicial(insumo.estoqueCritico, insumo.conteudoUnidadeCompra);
      setEstoqueMinimo(minimo.texto);
      setModoMinimo(minimo.modo);
      setEstoqueCritico(critico.texto);
      setModoCritico(critico.modo);
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
      setModoMinimo('caixa');
      setEstoqueCritico('');
      setModoCritico('caixa');
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

    if (!isEditing && !(Number.isFinite(conteudoNum) && conteudoNum > 0)) {
      setErros({ conteudoUnidadeCompra: 'Informe um valor maior que 0' });
      return;
    }

    const errosLimite: Record<string, string> = {};
    const mensagemSemConteudo = `Informe quanto vem em cada ${rotulo} para converter`;
    if (estoqueMinimo.trim() !== '' && modoMinimo === 'caixa' && !(conteudoNum > 0)) {
      errosLimite.estoqueMinimo = mensagemSemConteudo;
    }
    if (estoqueCritico.trim() !== '' && modoCritico === 'caixa' && !(conteudoNum > 0)) {
      errosLimite.estoqueCritico = mensagemSemConteudo;
    }
    if (Object.keys(errosLimite).length > 0) {
      setErros(errosLimite);
      return;
    }

    const minimoBase = converterParaBase(estoqueMinimo, modoMinimo, conteudoNum);
    const criticoBase = converterParaBase(estoqueCritico, modoCritico, conteudoNum);

    try {
      const dados = isEditing
        ? {
            nome,
            dataValidade,
            unidadeConsumo,
            unidadeCompra,
            conteudoUnidadeCompra: Number(conteudoUnidadeCompra),
            precoUnidadeCompra: Number(precoUnidadeCompra),
            estoqueMinimo: minimoBase,
            estoqueCritico: criticoBase,
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
            estoqueMinimo: minimoBase,
            estoqueCritico: criticoBase,
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

  const campoTexto = "mt-1 w-full rounded-lg border border-[#E5E0DA] bg-white px-4 py-2 text-[#1A1A1A] focus:border-[#3D1A1A] focus:outline-none";
  const perguntaClasse = "block text-base font-medium text-[#1A1A1A]";

  return (
    <div className="fixed inset-0 z-50 flex backdrop-blur-sm bg-black/20 sm:items-center sm:justify-center">
      <div className="h-dvh w-full overflow-y-auto overscroll-contain bg-white p-4 shadow-xl sm:h-auto sm:max-h-[90dvh] sm:max-w-md sm:rounded-2xl sm:p-8">
        <div className="sticky top-0 z-10 -mx-4 -mt-4 mb-4 flex items-center justify-between bg-white px-4 pb-3 pt-4 sm:mx-0 sm:mt-0 sm:mb-6 sm:p-0">
          <h2 className="text-2xl font-semibold text-[#1A1A1A]">
            {isEditing ? 'Editar Insumo' : 'Adicionar Insumo'}
          </h2>
          <button
            onClick={onClose}
            className="flex h-11 w-11 items-center justify-center text-[#6B6B6B] hover:text-[#1A1A1A]"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        {erroGeral && (
          <div className="mb-4 rounded-lg bg-[#FFF5F5] p-3 text-sm text-[#CC0000]">
            {erroGeral}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 1. Nome */}
          <div>
            <label className={perguntaClasse}>Qual o nome do insumo?</label>
            <input
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              className={campoTexto}
              disabled={carregando}
            />
            {erros.nome && <p className="mt-1 text-xs text-[#CC0000]">{erros.nome}</p>}
          </div>

          {/* 2. Unidade de compra */}
          <div>
            <label className={perguntaClasse}>Eu compro em...</label>
            <input
              type="text"
              value={unidadeCompra}
              onChange={(e) => setUnidadeCompra(e.target.value)}
              placeholder="lata, cartela, pacote, saco"
              className={campoTexto}
              disabled={carregando}
            />
            {erros.unidadeCompra && (
              <p className="mt-1 text-xs text-[#CC0000]">{erros.unidadeCompra}</p>
            )}
          </div>

          {/* 3. Conteúdo de cada caixa + unidade de consumo (campo isolado: futuramente vira select) */}
          <div>
            <label className={perguntaClasse}>Cada {rotulo} tem...</label>
            <input
              type="number"
              value={conteudoUnidadeCompra}
              onChange={(e) => setConteudoUnidadeCompra(e.target.value)}
              min={isEditing ? undefined : '0.01'}
              inputMode="decimal"
              step="0.01"
              className={campoTexto}
              disabled={carregando}
            />
            <div className="mt-2">
              <SeletorUnidade<string>
                opcoes={OPCOES_UNIDADE_CONSUMO.map((o) => ({ valor: o.valor, texto: o.texto }))}
                valor={unidadeConsumo}
                onChange={setUnidadeConsumo}
                disabled={carregando}
              />
            </div>
            {erros.unidadeConsumo && (
              <p className="mt-1 text-xs text-[#CC0000]">{erros.unidadeConsumo}</p>
            )}
            {erros.conteudoUnidadeCompra && (
              <p className="mt-1 text-xs text-[#CC0000]">{erros.conteudoUnidadeCompra}</p>
            )}
          </div>

          {/* 4. Quantidade comprada (só no criar) */}
          {!isEditing && (
            <div>
              <label className={perguntaClasse}>Quantas {rotulo} você comprou?</label>
              <input
                type="number"
                value={quantidadeCompra}
                onChange={(e) => setQuantidadeCompra(e.target.value)}
                inputMode="decimal"
                step="0.01"
                placeholder="Ex: 5"
                className={campoTexto}
                disabled={carregando}
              />
              {erros.quantidadeCompra && (
                <p className="mt-1 text-xs text-[#CC0000]">{erros.quantidadeCompra}</p>
              )}
            </div>
          )}

          {/* 5. Preço por caixa */}
          <div>
            <label className={perguntaClasse}>Quanto custou cada {rotulo}?</label>
            <input
              type="number"
              value={precoUnidadeCompra}
              onChange={(e) => setPrecoUnidadeCompra(e.target.value)}
              inputMode="decimal"
              step="0.01"
              placeholder="Ex: 4.50"
              className={campoTexto}
              disabled={carregando}
            />
            {erros.precoUnidadeCompra && (
              <p className="mt-1 text-xs text-[#CC0000]">{erros.precoUnidadeCompra}</p>
            )}
          </div>

          {/* 6. Validade (só no criar) */}
          {!isEditing && (
            <div>
              <label className={perguntaClasse}>Até quando vale?</label>
              <input
                type="date"
                value={dataValidade}
                onChange={(e) => setDataValidade(e.target.value)}
                className={campoTexto}
                disabled={carregando}
              />
              {erros.dataValidade && (
                <p className="mt-1 text-xs text-[#CC0000]">{erros.dataValidade}</p>
              )}
            </div>
          )}

          {/* 7. Avisos */}
          <div className="border-t border-[#E5E0DA] pt-4">
            <h3 className="mb-4 text-base font-semibold text-[#1A1A1A]">
              Avisos (opcional)
            </h3>

            <div className="mb-5">
              <label className={perguntaClasse}>Me avise quando sobrar menos de</label>
              <input
                type="number"
                value={estoqueMinimo}
                onChange={(e) => setEstoqueMinimo(e.target.value)}
                inputMode="decimal"
                step="0.01"
                className={campoTexto}
                disabled={carregando}
              />
              <div className="mt-2">
                <SeletorUnidade<ModoUnidade>
                  opcoes={opcoesLimite}
                  valor={modoMinimo}
                  onChange={setModoMinimo}
                  disabled={carregando}
                />
              </div>
              {textoConversao(estoqueMinimo, modoMinimo) && (
                <p className="mt-1 text-sm text-[#1A1A1A]">{textoConversao(estoqueMinimo, modoMinimo)}</p>
              )}
              {erros.estoqueMinimo && (
                <p className="mt-1 text-xs text-[#CC0000]">{erros.estoqueMinimo}</p>
              )}
            </div>

            <div className="mb-5">
              <label className={perguntaClasse}>
                Me avise quando estiver quase acabando, menos de
              </label>
              <input
                type="number"
                value={estoqueCritico}
                onChange={(e) => setEstoqueCritico(e.target.value)}
                inputMode="decimal"
                step="0.01"
                className={campoTexto}
                disabled={carregando}
              />
              <div className="mt-2">
                <SeletorUnidade<ModoUnidade>
                  opcoes={opcoesLimite}
                  valor={modoCritico}
                  onChange={setModoCritico}
                  disabled={carregando}
                />
              </div>
              {textoConversao(estoqueCritico, modoCritico) && (
                <p className="mt-1 text-sm text-[#1A1A1A]">{textoConversao(estoqueCritico, modoCritico)}</p>
              )}
              {erros.estoqueCritico && (
                <p className="mt-1 text-xs text-[#CC0000]">{erros.estoqueCritico}</p>
              )}
            </div>

            <div>
              <label className={perguntaClasse}>Me avise quantos dias antes de vencer?</label>
              <input
                type="number"
                value={diasAvisoValidade}
                onChange={(e) => setDiasAvisoValidade(e.target.value)}
                inputMode="numeric"
                step="1"
                className={campoTexto}
                disabled={carregando}
              />
              <p className="mt-1 text-xs text-[#6B6B6B]">
                Ex: 7 = avisa 7 dias antes da validade
              </p>
            </div>
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
              {carregando ? 'Salvando...' : 'Salvar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
