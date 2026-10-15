import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import type { Receita } from '../../types';

interface ReceitaCardProps {
  receita: Receita;
  onVisualizar: (receita: Receita) => void;
  onEditar: (receita: Receita) => void;
  onDeletar: (receita: Receita) => void;
}

export function ReceitaCard({
  receita,
  onVisualizar,
  onEditar,
  onDeletar,
}: ReceitaCardProps) {
  return (
    <div
      onClick={() => onVisualizar(receita)}
      className="cursor-pointer rounded-lg border border-[#E5E0DA] bg-white p-4 shadow-sm transition-shadow hover:shadow-md sm:p-6"
    >
      <div className="mb-4 flex items-start justify-between">
        <div className="flex-1">
          <h3 className="break-words text-lg font-semibold text-[#1A1A1A]">
            {receita.nome}
          </h3>
          <p className="mt-1 text-sm text-[#6B6B6B]">
            {receita.rendimento} {receita.unidadeRendimento}
          </p>
        </div>
      </div>

      <div className="mb-6 space-y-2 border-t border-[#E5E0DA] pt-4">
        <div className="flex justify-between">
          <span className="text-sm text-[#6B6B6B]">Custo total:</span>
          <span className="font-medium text-[#1A1A1A]">
            R$ {receita.custoTotal.toFixed(2)}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm text-[#6B6B6B]">Custo por unidade:</span>
          <span className="font-medium text-[#1A1A1A]">
            R$ {receita.custoPorUnidade.toFixed(2)}
          </span>
        </div>
      </div>

      <div className="flex gap-2">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onEditar(receita);
          }}
          className="flex-1 rounded-lg border border-[#E5E0DA] min-h-11 px-3 py-2 text-sm font-medium text-[#1A1A1A] transition-colors hover:bg-[#F5F0EB]"
          title="Editar receita"
        >
          <PencilIcon className="h-4 w-4" />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDeletar(receita);
          }}
          className="flex-1 rounded-lg border border-[#CC0000] min-h-11 px-3 py-2 text-sm font-medium text-[#CC0000] transition-colors hover:bg-[#FFF5F5]"
          title="Deletar receita"
        >
          <TrashIcon className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
