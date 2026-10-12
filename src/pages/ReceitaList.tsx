import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { ReceitaCard } from '../components/receitas/ReceitaCard';
import { ReceitaModal } from '../components/receitas/ReceitaModal';
import { VisualizarReceitaModal } from '../components/receitas/VisualizarReceitaModal';
import { ConfirmaDeletearReceitaModal } from '../components/receitas/ConfirmaDeletearReceitaModal';
import {
  listarReceitas,
  criarReceita,
  atualizarReceita,
  deletarReceita,
  type CriarReceitaDTO,
  type AtualizarReceitaDTO,
} from '../api/receitas';
import { listarInsumos } from '../api/insumos';
import type { Receita } from '../types';

export function ReceitaList() {
  const [receitas, setReceitas] = useState<Receita[]>([]);
  const [insumos, setInsumos] = useState<Array<{ id: number; nome: string; unidadeConsumo: string }>>([]);
  const [carregando, setCarregando] = useState(true);
  const [carregandoOperacao, setCarregandoOperacao] = useState(false);
  const [erro, setErro] = useState('');

  // Estados dos modais
  const [modalAberto, setModalAberto] = useState(false);
  const [receitaEditando, setReceitaEditando] = useState<Receita | null>(null);
  const [visualizarModalAberto, setVisualizarModalAberto] = useState(false);
  const [receitaVisualizando, setReceitaVisualizando] = useState<Receita | null>(null);
  const [deletarModalAberto, setDeletarModalAberto] = useState(false);
  const [receitaDeletando, setReceitaDeletando] = useState<Receita | null>(null);

  const carregarDados = async () => {
    setCarregando(true);
    setErro('');
    try {
      const [receitasData, insumosData] = await Promise.all([
        listarReceitas(),
        listarInsumos(),
      ]);
      setReceitas(receitasData);
      setInsumos(
        insumosData.map((i) => ({
          id: i.id,
          nome: i.nome,
          unidadeConsumo: i.unidadeConsumo,
        }))
      );
    } catch (err: any) {
      setErro('Erro ao carregar receitas. Tente novamente.');
      console.error(err);
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    carregarDados();
  }, []);

  const handleAdicionarClick = () => {
    setReceitaEditando(null);
    setModalAberto(true);
  };

  const handleVisualizarClick = (receita: Receita) => {
    setReceitaVisualizando(receita);
    setVisualizarModalAberto(true);
  };

  const handleEditarClick = (receita: Receita) => {
    setReceitaEditando(receita);
    setModalAberto(true);
  };

  const handleDeletarClick = (receita: Receita) => {
    setReceitaDeletando(receita);
    setDeletarModalAberto(true);
  };

  const handleSalvarReceita = async (
    dados: CriarReceitaDTO | AtualizarReceitaDTO,
    forcarCriacao: boolean = false
  ) => {
    setCarregandoOperacao(true);
    try {
      if (receitaEditando) {
        await atualizarReceita(receitaEditando.id, dados as AtualizarReceitaDTO);
      } else {
        await criarReceita(dados as CriarReceitaDTO, forcarCriacao);
      }
      await carregarDados();
      setModalAberto(false);
      setReceitaEditando(null);
    } finally {
      setCarregandoOperacao(false);
    }
  };

  const handleConfirmarDelecao = async () => {
    if (!receitaDeletando) return;

    setCarregandoOperacao(true);
    try {
      await deletarReceita(receitaDeletando.id);
      toast.success('Receita excluída com sucesso!');
      await carregarDados();
      setDeletarModalAberto(false);
      setReceitaDeletando(null);
    } catch (error: any) {
      const mensagem = error?.response?.data?.message ?? 'Erro ao excluir receita. Tente novamente.';
      toast.error(mensagem);
      setErro(mensagem);
    } finally {
      setCarregandoOperacao(false);
    }
  };

  const handleFecharModal = () => {
    setModalAberto(false);
    setReceitaEditando(null);
  };

  const handleFecharVisualizarModal = () => {
    setVisualizarModalAberto(false);
    setReceitaVisualizando(null);
  };

  const handleFecharDeletarModal = () => {
    setDeletarModalAberto(false);
    setReceitaDeletando(null);
  };

  if (carregando) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-[#E5E0DA] border-t-[#3D1A1A] margin-auto"></div>
          <p className="text-[#6B6B6B]">Carregando receitas...</p>
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
            Gerencia suas receitas e custos
          </p>
        </div>
        <button
          onClick={handleAdicionarClick}
          className="rounded-lg bg-[#3D1A1A] px-6 py-3 font-medium text-white transition-colors hover:bg-[#2D1515]"
        >
          + Adicionar Receita
        </button>
      </div>

      {/* Erro Geral */}
      {erro && (
        <div className="rounded-lg bg-[#FFF5F5] p-4 text-sm text-[#CC0000]">
          {erro}
        </div>
      )}

      {/* Lista de Receitas */}
      {receitas.length === 0 ? (
        <div className="rounded-lg bg-white p-12 text-center shadow-sm">
          <h2 className="text-xl font-semibold text-[#1A1A1A]">
            Nenhuma receita cadastrada
          </h2>
          <p className="mt-2 text-[#6B6B6B]">
            Comece cadastrando sua primeira receita
          </p>
          <button
            onClick={handleAdicionarClick}
            className="mt-4 rounded-lg bg-[#3D1A1A] px-6 py-2 font-medium text-white transition-colors hover:bg-[#2D1515]"
          >
            Cadastrar Primeira Receita
          </button>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {receitas.map((receita) => (
            <ReceitaCard
              key={receita.id}
              receita={receita}
              onVisualizar={handleVisualizarClick}
              onEditar={handleEditarClick}
              onDeletar={handleDeletarClick}
            />
          ))}
        </div>
      )}

      {/* Modais */}
      <ReceitaModal
        isOpen={modalAberto}
        receita={receitaEditando}
        insumos={insumos}
        onClose={handleFecharModal}
        onSalvar={handleSalvarReceita}
        carregando={carregandoOperacao}
      />

      <VisualizarReceitaModal
        isOpen={visualizarModalAberto}
        receita={receitaVisualizando}
        onClose={handleFecharVisualizarModal}
        onEditar={handleEditarClick}
      />

      <ConfirmaDeletearReceitaModal
        isOpen={deletarModalAberto}
        receita={receitaDeletando}
        onClose={handleFecharDeletarModal}
        onConfirmar={handleConfirmarDelecao}
        carregando={carregandoOperacao}
      />
    </div>
  );
}
