import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { EmbalagemCard } from '../components/embalagens/EmbalagemCard';
import { EmbalagemModal } from '../components/embalagens/EmbalagemModal';
import { ReporEstoqueEmbalagemModal } from '../components/embalagens/ReporEstoqueEmbalagemModal';
import { CorrigirEstoqueEmbalagemModal } from '../components/embalagens/CorrigirEstoqueEmbalagemModal';
import { ConfirmaDeletearEmbalagemModal } from '../components/embalagens/ConfirmaDeletearEmbalagemModal';
import {
  listarEmbalagens,
  criarEmbalagem,
  atualizarEmbalagem,
  deletarEmbalagem,
  reporEstoqueEmbalagem,
  corrigirEstoqueEmbalagem,
  type CriarEmbalagemDTO,
  type AtualizarEmbalagemDTO,
} from '../api/embalagens';
import { useAlertas } from '../context/AlertasContext';
import { SearchBar } from '../components/ui/SearchBar';
import { matchBusca } from '../utils/busca';
import type { Embalagem, DestaqueItem } from '../types';

interface EmbalagemListProps {
  busca: string;
  onBuscaChange: (valor: string) => void;
}

export function EmbalagemList({ busca, onBuscaChange }: EmbalagemListProps) {
  const [embalagens, setEmbalagens] = useState<Embalagem[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [carregandoOperacao, setCarregandoOperacao] = useState(false);
  const [erro, setErro] = useState('');
  const { alertas, recarregarAlertas } = useAlertas();

  // Estados dos modais
  const [modalAberto, setModalAberto] = useState(false);
  const [embalagemEditando, setEmbalagemEditando] = useState<Embalagem | null>(null);
  const [reportModalAberto, setReportModalAberto] = useState(false);
  const [embalagemRepondo, setEmbalagemRepondo] = useState<Embalagem | null>(null);
  const [deletarModalAberto, setDeletarModalAberto] = useState(false);
  const [embalagemDeletando, setEmbalagemDeletando] = useState<Embalagem | null>(null);
  const [corrigirModalAberto, setCorrigirModalAberto] = useState(false);
  const [embalagemCorrigindo, setEmbalagemCorrigindo] = useState<Embalagem | null>(null);

  const [searchParams, setSearchParams] = useSearchParams();
  const [destaque, setDestaque] = useState<DestaqueItem | null>(null);

  const embalagensFiltradas = embalagens.filter((e) => matchBusca(e.nome, busca));

  const carregarDados = async () => {
    setCarregando(true);
    setErro('');
    try {
      const embalagensList = await listarEmbalagens();
      setEmbalagens(embalagensList);
    } catch (err: any) {
      setErro('Erro ao carregar embalagens. Tente novamente.');
      console.error(err);
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    carregarDados();
  }, []);

  useEffect(() => {
    const itemParam = searchParams.get('item');
    if (carregando || itemParam === null) return;

    const itemId = Number(itemParam);

    setSearchParams(
      (prev) => {
        prev.delete('item');
        prev.delete('lote');
        return prev;
      },
      { replace: true }
    );

    if (!embalagens.some((e) => e.id === itemId)) {
      toast.error('Este item não existe mais');
      recarregarAlertas();
      return;
    }

    onBuscaChange('');
    setDestaque({ itemId, loteId: null });
  }, [carregando, embalagens, searchParams, setSearchParams, recarregarAlertas, onBuscaChange]);

  useEffect(() => {
    if (!destaque) return;
    const timer = setTimeout(() => setDestaque(null), 3000);
    return () => clearTimeout(timer);
  }, [destaque]);

  const handleAdicionarClick = () => {
    setEmbalagemEditando(null);
    setModalAberto(true);
  };

  const handleEditarClick = (embalagem: Embalagem) => {
    setEmbalagemEditando(embalagem);
    setModalAberto(true);
  };

  const handleReporClick = (embalagem: Embalagem) => {
    setEmbalagemRepondo(embalagem);
    setReportModalAberto(true);
  };

  const handleDeletarClick = (embalagem: Embalagem) => {
    setEmbalagemDeletando(embalagem);
    setDeletarModalAberto(true);
  };

  const handleSalvarEmbalagem = async (dados: CriarEmbalagemDTO | AtualizarEmbalagemDTO) => {
    setCarregandoOperacao(true);
    try {
      if (embalagemEditando) {
        await atualizarEmbalagem(embalagemEditando.id, dados as AtualizarEmbalagemDTO);
      } else {
        await criarEmbalagem(dados as CriarEmbalagemDTO);
      }
      await carregarDados();
      await recarregarAlertas();
      setModalAberto(false);
      setEmbalagemEditando(null);
    } finally {
      setCarregandoOperacao(false);
    }
  };

  const handleReporEstoque = async (quantidade: number) => {
    if (!embalagemRepondo) return;

    setCarregandoOperacao(true);
    try {
      await reporEstoqueEmbalagem(embalagemRepondo.id, quantidade);
      await carregarDados();
      await recarregarAlertas();
      setReportModalAberto(false);
      setEmbalagemRepondo(null);
    } finally {
      setCarregandoOperacao(false);
    }
  };

  const handleCorrigirClick = (embalagem: Embalagem) => {
    setEmbalagemCorrigindo(embalagem);
    setCorrigirModalAberto(true);
  };

  const handleCorrigirEstoque = async (quantidade: number) => {
    if (!embalagemCorrigindo) return;

    setCarregandoOperacao(true);
    try {
      await corrigirEstoqueEmbalagem(embalagemCorrigindo.id, quantidade);
      toast.success('Estoque corrigido com sucesso!');
      await carregarDados();
      await recarregarAlertas();
      setCorrigirModalAberto(false);
      setEmbalagemCorrigindo(null);
    } finally {
      setCarregandoOperacao(false);
    }
  };

  const handleFecharCorrigirModal = () => {
    setCorrigirModalAberto(false);
    setEmbalagemCorrigindo(null);
  };

  const handleConfirmarDelecao = async () => {
    if (!embalagemDeletando) return;

    setCarregandoOperacao(true);
    try {
      await deletarEmbalagem(embalagemDeletando.id);
      toast.success('Embalagem excluída com sucesso!');
      await carregarDados();
      await recarregarAlertas();
      setDeletarModalAberto(false);
      setEmbalagemDeletando(null);
    } catch (error: any) {
      const mensagem = error?.response?.data?.message ?? 'Erro ao excluir embalagem. Tente novamente.';
      toast.error(mensagem);
      setErro(mensagem);
    } finally {
      setCarregandoOperacao(false);
    }
  };

  const handleFecharModal = () => {
    setModalAberto(false);
    setEmbalagemEditando(null);
  };

  const handleFecharReportModal = () => {
    setReportModalAberto(false);
    setEmbalagemRepondo(null);
  };

  const handleFecharDeletarModal = () => {
    setDeletarModalAberto(false);
    setEmbalagemDeletando(null);
  };

  if (carregando) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-[#E5E0DA] border-t-[#3D1A1A] margin-auto"></div>
          <p className="text-[#6B6B6B]">Carregando embalagens...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-[#6B6B6B]">
            Gerencia suas embalagens e estoque
          </p>
        </div>
        <button
          onClick={handleAdicionarClick}
          className="min-h-11 w-full rounded-lg bg-[#3D1A1A] px-6 py-3 font-medium text-white transition-colors hover:bg-[#2D1515] sm:w-auto"
        >
          + Adicionar Embalagem
        </button>
      </div>

      {/* Erro Geral */}
      {erro && (
        <div className="rounded-lg bg-[#FFF5F5] p-4 text-sm text-[#CC0000]">
          {erro}
        </div>
      )}

      {/* Busca */}
      {embalagens.length > 0 && (
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <SearchBar
              value={busca}
              onChange={onBuscaChange}
              placeholder="Buscar embalagem..."
            />
          </div>
          {busca.trim() !== '' && (
            <span className="whitespace-nowrap text-sm text-[#6B6B6B]">
              {embalagensFiltradas.length} de {embalagens.length}
            </span>
          )}
        </div>
      )}

      {/* Lista de Embalagens */}
      {embalagens.length === 0 ? (
        <div className="rounded-lg bg-white p-6 text-center shadow-sm sm:p-12">
          <h2 className="text-xl font-semibold text-[#1A1A1A]">
            Nenhuma embalagem cadastrada
          </h2>
          <p className="mt-2 text-[#6B6B6B]">
            Comece cadastrando sua primeira embalagem
          </p>
          <button
            onClick={handleAdicionarClick}
            className="mt-4 rounded-lg bg-[#3D1A1A] px-6 py-2 font-medium text-white transition-colors hover:bg-[#2D1515]"
          >
            Cadastrar Primeira Embalagem
          </button>
        </div>
      ) : embalagensFiltradas.length === 0 ? (
        <div className="rounded-lg bg-white p-6 text-center shadow-sm sm:p-12">
          <p className="text-[#1A1A1A]">
            {`Nenhuma embalagem encontrada para '${busca.trim()}'`}
          </p>
          <button
            onClick={() => onBuscaChange('')}
            className="mt-4 rounded-lg border border-[#3D1A1A] px-6 py-2 font-medium text-[#3D1A1A] transition-colors hover:bg-[#F5F0EB]"
          >
            Limpar busca
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 items-start gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4">
          {embalagensFiltradas.map((embalagem) => (
            <EmbalagemCard
              key={embalagem.id}
              embalagem={embalagem}
              alertas={alertas}
              destaque={destaque}
              onEditar={handleEditarClick}
              onRepor={handleReporClick}
              onCorrigir={handleCorrigirClick}
              onDeletar={handleDeletarClick}
            />
          ))}
        </div>
      )}

      {/* Modais */}
      <EmbalagemModal
        isOpen={modalAberto}
        embalagem={embalagemEditando}
        onClose={handleFecharModal}
        onSalvar={handleSalvarEmbalagem}
        carregando={carregandoOperacao}
      />

      <ReporEstoqueEmbalagemModal
        isOpen={reportModalAberto}
        embalagem={embalagemRepondo}
        onClose={handleFecharReportModal}
        onSalvar={handleReporEstoque}
        carregando={carregandoOperacao}
      />

      <CorrigirEstoqueEmbalagemModal
        isOpen={corrigirModalAberto}
        embalagem={embalagemCorrigindo}
        onClose={handleFecharCorrigirModal}
        onSalvar={handleCorrigirEstoque}
        carregando={carregandoOperacao}
      />

      <ConfirmaDeletearEmbalagemModal
        isOpen={deletarModalAberto}
        embalagem={embalagemDeletando}
        onClose={handleFecharDeletarModal}
        onConfirmar={handleConfirmarDelecao}
        carregando={carregandoOperacao}
      />
    </div>
  );
}
