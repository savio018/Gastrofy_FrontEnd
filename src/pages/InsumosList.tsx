import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { InsumoCard } from '../components/insumos/InsumoCard';
import { InsumoModal } from '../components/insumos/InsumoModal';
import { ReporEstoqueModal } from '../components/insumos/ReporEstoqueModal';
import { CorrigirEstoqueModal } from '../components/insumos/CorrigirEstoqueModal';
import { EditarLoteModal } from '../components/insumos/EditarLoteModal';
import { ConfirmaDeletarLoteModal } from '../components/insumos/ConfirmaDeletarLoteModal';
import { ConfirmaDeletarModal } from '../components/insumos/ConfirmaDeletarModal';
import {
  listarInsumos,
  criarInsumo,
  atualizarInsumo,
  deletarInsumo,
  reporEstoque,
  corrigirEstoque,
  editarLote,
  deletarLote,
  type CriarInsumoDTO,
  type AtualizarInsumoDTO,
} from '../api/insumos';
import { useAlertas } from '../context/AlertasContext';
import { SearchBar } from '../components/ui/SearchBar';
import { matchBusca } from '../utils/busca';
import type { Insumo, LoteInsumo, DestaqueItem } from '../types';

interface InsumosListProps {
  busca: string;
  onBuscaChange: (valor: string) => void;
}

export function InsumosList({ busca, onBuscaChange }: InsumosListProps) {
  const [insumos, setInsumos] = useState<Insumo[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [carregandoOperacao, setCarregandoOperacao] = useState(false);
  const [erro, setErro] = useState('');
  const { alertas, recarregarAlertas } = useAlertas();

  // Estados dos modais
  const [modalAberto, setModalAberto] = useState(false);
  const [insumoEditando, setInsumoEditando] = useState<Insumo | null>(null);
  const [reportModalAberto, setReportModalAberto] = useState(false);
  const [insumoRepondo, setInsumoRepondo] = useState<Insumo | null>(null);
  const [corrigirModalAberto, setCorrigirModalAberto] = useState(false);
  const [insumoCorrigindo, setInsumoCorrigindo] = useState<Insumo | null>(null);
  const [editarLoteModalAberto, setEditarLoteModalAberto] = useState(false);
  const [insumoEditandoLote, setInsumoEditandoLote] = useState<Insumo | null>(null);
  const [loteEditando, setLoteEditando] = useState<LoteInsumo | null>(null);
  const [excluirLoteModalAberto, setExcluirLoteModalAberto] = useState(false);
  const [insumoExcluindoLote, setInsumoExcluindoLote] = useState<Insumo | null>(null);
  const [loteExcluindo, setLoteExcluindo] = useState<LoteInsumo | null>(null);
  const [deletarModalAberto, setDeletarModalAberto] = useState(false);
  const [insumoDeletando, setInsumoDeletando] = useState<Insumo | null>(null);

  const [searchParams, setSearchParams] = useSearchParams();
  const [destaque, setDestaque] = useState<DestaqueItem | null>(null);

  const carregarDados = async () => {
    setCarregando(true);
    setErro('');
    try {
      const insumosData = await listarInsumos();
      setInsumos(insumosData);
    } catch (err: any) {
      setErro('Erro ao carregar ingredientes. Tente novamente.');
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
    const loteParam = searchParams.get('lote');
    const loteId = loteParam === null ? null : Number(loteParam);

    setSearchParams(
      (prev) => {
        prev.delete('item');
        prev.delete('lote');
        return prev;
      },
      { replace: true }
    );

    if (!insumos.some((i) => i.id === itemId)) {
      toast.error('Este item não existe mais');
      recarregarAlertas();
      return;
    }

    onBuscaChange('');
    setDestaque({ itemId, loteId });
  }, [carregando, insumos, searchParams, setSearchParams, recarregarAlertas, onBuscaChange]);

  useEffect(() => {
    if (!destaque) return;
    const timer = setTimeout(() => setDestaque(null), 3000);
    return () => clearTimeout(timer);
  }, [destaque]);

  const insumosFiltrados = insumos.filter((i) => matchBusca(i.nome, busca));

  const atualizarInsumos = async () => {
    const insumosData = await listarInsumos();
    setInsumos(insumosData);
  };

  const handleAdicionarClick = () => {
    setInsumoEditando(null);
    setModalAberto(true);
  };

  const handleEditarClick = (insumo: Insumo) => {
    setInsumoEditando(insumo);
    setModalAberto(true);
  };

  const handleReporClick = (insumo: Insumo) => {
    setInsumoRepondo(insumo);
    setReportModalAberto(true);
  };

  const handleDeletarClick = (insumo: Insumo) => {
    setInsumoDeletando(insumo);
    setDeletarModalAberto(true);
  };

  const handleSalvarInsumo = async (dados: CriarInsumoDTO | AtualizarInsumoDTO) => {
    setCarregandoOperacao(true);
    try {
      if (insumoEditando) {
        await atualizarInsumo(insumoEditando.id, dados as AtualizarInsumoDTO);
      } else {
        await criarInsumo(dados as CriarInsumoDTO);
      }
      await carregarDados();
      await recarregarAlertas();
      setModalAberto(false);
      setInsumoEditando(null);
    } finally {
      setCarregandoOperacao(false);
    }
  };

  const handleReporEstoque = async (lotes: Array<{ quantidade: number; dataValidade: string }>) => {
    if (!insumoRepondo) return;

    setCarregandoOperacao(true);
    try {
      await reporEstoque(insumoRepondo.id, lotes);
      await carregarDados();
      await recarregarAlertas();
      setReportModalAberto(false);
      setInsumoRepondo(null);
    } finally {
      setCarregandoOperacao(false);
    }
  };

  const handleCorrigirClick = (insumo: Insumo) => {
    setInsumoCorrigindo(insumo);
    setCorrigirModalAberto(true);
  };

  const handleCorrigirEstoque = async (quantidade: number) => {
    if (!insumoCorrigindo) return;

    setCarregandoOperacao(true);
    try {
      await corrigirEstoque(insumoCorrigindo.id, quantidade);
      toast.success('Estoque corrigido com sucesso!');
      await carregarDados();
      await recarregarAlertas();
      setCorrigirModalAberto(false);
      setInsumoCorrigindo(null);
    } catch (error: any) {
      const mensagem = error?.response?.data?.message ?? 'Erro ao corrigir estoque. Tente novamente.';
      toast.error(mensagem);
    } finally {
      setCarregandoOperacao(false);
    }
  };

  const handleEditarLoteClick = (insumo: Insumo, lote: LoteInsumo) => {
    setInsumoEditandoLote(insumo);
    setLoteEditando(lote);
    setEditarLoteModalAberto(true);
  };

  const handleEditarLote = async (loteId: number, quantidade: number) => {
    if (!insumoEditandoLote) return;

    setCarregandoOperacao(true);
    try {
      await editarLote(insumoEditandoLote.id, loteId, quantidade);
      toast.success('Lote atualizado com sucesso!');
      await carregarDados();
      await recarregarAlertas();
      setEditarLoteModalAberto(false);
      setInsumoEditandoLote(null);
      setLoteEditando(null);
    } catch (error: any) {
      const mensagem = error?.response?.data?.message ?? 'Erro ao editar lote. Tente novamente.';
      toast.error(mensagem);
    } finally {
      setCarregandoOperacao(false);
    }
  };

  const handleExcluirLoteClick = (insumo: Insumo, lote: LoteInsumo) => {
    setInsumoExcluindoLote(insumo);
    setLoteExcluindo(lote);
    setExcluirLoteModalAberto(true);
  };

  const handleConfirmarExclusaoLote = async () => {
    if (!insumoExcluindoLote || !loteExcluindo) return;

    setCarregandoOperacao(true);
    try {
      await deletarLote(insumoExcluindoLote.id, loteExcluindo.id);
      toast.success('Lote excluído com sucesso!');
      await atualizarInsumos();
      await recarregarAlertas();
      setExcluirLoteModalAberto(false);
      setInsumoExcluindoLote(null);
      setLoteExcluindo(null);
    } finally {
      setCarregandoOperacao(false);
    }
  };

  const handleFecharExcluirLoteModal = () => {
    setExcluirLoteModalAberto(false);
    setInsumoExcluindoLote(null);
    setLoteExcluindo(null);
  };

  const handleConfirmarDelecao = async () => {
    if (!insumoDeletando) return;

    setCarregandoOperacao(true);
    try {
      await deletarInsumo(insumoDeletando.id);
      toast.success('Ingrediente excluído com sucesso!');
      await carregarDados();
      await recarregarAlertas();
      setDeletarModalAberto(false);
      setInsumoDeletando(null);
    } catch (error: any) {
      const mensagem = error?.response?.data?.message ?? 'Erro ao excluir ingrediente. Tente novamente.';
      toast.error(mensagem);
      setErro(mensagem);
    } finally {
      setCarregandoOperacao(false);
    }
  };

  const handleFecharModal = () => {
    setModalAberto(false);
    setInsumoEditando(null);
  };

  const handleFecharReportModal = () => {
    setReportModalAberto(false);
    setInsumoRepondo(null);
  };

  const handleFecharCorrigirModal = () => {
    setCorrigirModalAberto(false);
    setInsumoCorrigindo(null);
  };

  const handleFecharEditarLoteModal = () => {
    setEditarLoteModalAberto(false);
    setInsumoEditandoLote(null);
    setLoteEditando(null);
  };

  const handleFecharDeletarModal = () => {
    setDeletarModalAberto(false);
    setInsumoDeletando(null);
  };

  if (carregando) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-[#E5E0DA] border-t-[#3D1A1A] margin-auto"></div>
          <p className="text-[#6B6B6B]">Carregando ingredientes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[#6B6B6B]">
            Gerencia seus ingredientes e estoque
          </p>
        </div>
        <button
          onClick={handleAdicionarClick}
          className="rounded-lg bg-[#3D1A1A] px-6 py-3 font-medium text-white transition-colors hover:bg-[#2D1515]"
        >
          + Adicionar Ingrediente
        </button>
      </div>

      {/* Erro Geral */}
      {erro && (
        <div className="rounded-lg bg-[#FFF5F5] p-4 text-sm text-[#CC0000]">
          {erro}
        </div>
      )}

      {/* Busca */}
      {insumos.length > 0 && (
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <SearchBar
              value={busca}
              onChange={onBuscaChange}
              placeholder="Buscar ingrediente..."
            />
          </div>
          {busca.trim() !== '' && (
            <span className="whitespace-nowrap text-sm text-[#6B6B6B]">
              {insumosFiltrados.length} de {insumos.length}
            </span>
          )}
        </div>
      )}

      {/* Lista de Ingredientes */}
      {insumos.length === 0 ? (
        <div className="rounded-lg bg-white p-12 text-center shadow-sm">
          <h2 className="text-xl font-semibold text-[#1A1A1A]">
            Nenhum ingrediente cadastrado
          </h2>
          <p className="mt-2 text-[#6B6B6B]">
            Comece cadastrando seu primeiro ingrediente
          </p>
          <button
            onClick={handleAdicionarClick}
            className="mt-4 rounded-lg bg-[#3D1A1A] px-6 py-2 font-medium text-white transition-colors hover:bg-[#2D1515]"
          >
            Cadastrar Primeiro Ingrediente
          </button>
        </div>
      ) : insumosFiltrados.length === 0 ? (
        <div className="rounded-lg bg-white p-12 text-center shadow-sm">
          <p className="text-[#1A1A1A]">
            {`Nenhum ingrediente encontrado para '${busca.trim()}'`}
          </p>
          <button
            onClick={() => onBuscaChange('')}
            className="mt-4 rounded-lg border border-[#3D1A1A] px-6 py-2 font-medium text-[#3D1A1A] transition-colors hover:bg-[#F5F0EB]"
          >
            Limpar busca
          </button>
        </div>
      ) : (
        <div className="grid items-start gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {insumosFiltrados.map((insumo) => (
            <InsumoCard
              key={insumo.id}
              insumo={insumo}
              alertas={alertas}
              destaque={destaque}
              onEditar={handleEditarClick}
              onRepor={handleReporClick}
              onCorrigir={handleCorrigirClick}
              onEditarLote={handleEditarLoteClick}
              onExcluirLote={handleExcluirLoteClick}
              onDeletar={handleDeletarClick}
            />
          ))}
        </div>
      )}

      {/* Modais */}
      <InsumoModal
        isOpen={modalAberto}
        insumo={insumoEditando}
        onClose={handleFecharModal}
        onSalvar={handleSalvarInsumo}
        carregando={carregandoOperacao}
      />

      <ReporEstoqueModal
        isOpen={reportModalAberto}
        insumo={insumoRepondo}
        onClose={handleFecharReportModal}
        onSalvar={handleReporEstoque}
        carregando={carregandoOperacao}
      />

      <CorrigirEstoqueModal
        isOpen={corrigirModalAberto}
        insumo={insumoCorrigindo}
        onClose={handleFecharCorrigirModal}
        onSalvar={handleCorrigirEstoque}
        carregando={carregandoOperacao}
      />

      <EditarLoteModal
        isOpen={editarLoteModalAberto}
        insumo={insumoEditandoLote}
        lote={loteEditando}
        onClose={handleFecharEditarLoteModal}
        onSalvar={handleEditarLote}
        carregando={carregandoOperacao}
      />

      <ConfirmaDeletarLoteModal
        isOpen={excluirLoteModalAberto}
        insumo={insumoExcluindoLote}
        lote={loteExcluindo}
        onClose={handleFecharExcluirLoteModal}
        onConfirmar={handleConfirmarExclusaoLote}
        carregando={carregandoOperacao}
      />

      <ConfirmaDeletarModal
        isOpen={deletarModalAberto}
        insumo={insumoDeletando}
        onClose={handleFecharDeletarModal}
        onConfirmar={handleConfirmarDelecao}
        carregando={carregandoOperacao}
      />
    </div>
  );
}
