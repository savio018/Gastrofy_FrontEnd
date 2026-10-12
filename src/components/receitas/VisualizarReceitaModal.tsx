import { XMarkIcon } from '@heroicons/react/24/outline';
import type { Receita } from '../../types';

interface VisualizarReceitaModalProps {
  isOpen: boolean;
  receita: Receita | null;
  onClose: () => void;
  onEditar: (receita: Receita) => void;
}

export function VisualizarReceitaModal({
  isOpen,
  receita,
  onClose,
  onEditar,
}: VisualizarReceitaModalProps) {
  if (!isOpen || !receita) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/20">
      <div className="max-h-screen w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-8 shadow-xl">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-[#1A1A1A]">
            {receita.nome}
          </h2>
          <button
            onClick={onClose}
            className="text-[#6B6B6B] hover:text-[#1A1A1A]"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        {/* Rendimento */}
        <div className="mb-6 rounded-lg bg-[#F5F0EB] p-4">
          <p className="text-sm text-[#6B6B6B]">Rendimento</p>
          <p className="mt-1 text-lg font-semibold text-[#1A1A1A]">
            {receita.rendimento} {receita.unidadeRendimento}
          </p>
        </div>

        {/* Custos */}
        <div className="mb-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-lg bg-[#F5F0EB] p-4">
            <p className="text-sm text-[#6B6B6B]">Custo total</p>
            <p className="mt-1 text-lg font-semibold text-[#1A1A1A]">
              R$ {receita.custoTotal.toFixed(2)}
            </p>
          </div>
          <div className="rounded-lg bg-[#F5F0EB] p-4">
            <p className="text-sm text-[#6B6B6B]">Custo por unidade</p>
            <p className="mt-1 text-lg font-semibold text-[#1A1A1A]">
              R$ {receita.custoPorUnidade.toFixed(2)}
            </p>
          </div>
        </div>

        {/* Ingredientes */}
        <div className="mb-6">
          <h3 className="mb-3 font-semibold text-[#1A1A1A]">Ingredientes</h3>
          <div className="space-y-2">
            {receita.insumos.map((insumo, idx) => (
              <div
                key={idx}
                className="rounded-lg bg-[#F5F0EB] p-3"
              >
                <p className="font-medium text-[#1A1A1A]">
                  {insumo.nomeInsumo}
                </p>
                <div className="mt-1 flex justify-between text-sm text-[#6B6B6B]">
                  <span>
                    {insumo.quantidadeUtilizada} {insumo.unidadeConsumo}
                  </span>
                  <span>R$ {insumo.custoInsumo.toFixed(2)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Modo de preparo */}
        {receita.modoPreparo && (
          <div className="mb-6">
            <h3 className="mb-3 font-semibold text-[#1A1A1A]">
              Modo de Preparo
            </h3>
            <div className="rounded-lg bg-[#F5F0EB] p-4">
              <p className="whitespace-pre-wrap text-sm text-[#1A1A1A]">
                {receita.modoPreparo}
              </p>
            </div>
          </div>
        )}

        {/* Botões */}
        <div className="mt-6 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 rounded-lg border border-[#E5E0DA] px-4 py-2 font-medium text-[#1A1A1A] transition-colors hover:bg-[#F5F0EB]"
          >
            Fechar
          </button>
          <button
            onClick={() => {
              onEditar(receita);
              onClose();
            }}
            className="flex-1 rounded-lg bg-[#3D1A1A] px-4 py-2 font-medium text-white transition-colors hover:bg-[#2D1515]"
          >
            Editar
          </button>
        </div>
      </div>
    </div>
  );
}
