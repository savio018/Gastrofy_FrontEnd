import { useEffect, useRef } from 'react';
import { PencilIcon, ArrowPathIcon, TrashIcon } from '@heroicons/react/24/outline';
import type { Embalagem, Alerta, TipoAlerta, DestaqueItem } from '../../types';

interface EmbalagemCardProps {
  embalagem: Embalagem;
  alertas: Alerta[];
  destaque: DestaqueItem | null;
  onEditar: (embalagem: Embalagem) => void;
  onRepor: (embalagem: Embalagem) => void;
  onDeletar: (embalagem: Embalagem) => void;
}

export function EmbalagemCard({
  embalagem,
  alertas,
  destaque,
  onEditar,
  onRepor,
  onDeletar,
}: EmbalagemCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const destacadoAqui = destaque?.itemId === embalagem.id;

  useEffect(() => {
    if (destacadoAqui) {
      cardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [destacadoAqui]);

  const alertasDaEmbalagem = alertas.filter(
    (a) => a.categoria === 'EMBALAGEM' && a.itemId === embalagem.id
  );

  const getAlertaTipo = (): TipoAlerta | null => {
    for (const alerta of alertasDaEmbalagem) {
      if (['SEM_ESTOQUE', 'ESTOQUE_CRITICO', 'VENCIDO'].includes(alerta.tipo)) {
        return alerta.tipo as TipoAlerta;
      }
    }
    for (const alerta of alertasDaEmbalagem) {
      if (['ESTOQUE_BAIXO', 'VALIDADE_PROXIMA'].includes(alerta.tipo)) {
        return alerta.tipo as TipoAlerta;
      }
    }
    return null;
  };

  const alertaTipo = getAlertaTipo();

  let borderColor = '#E5E0DA';
  let bgColor = '#FFFFFF';

  if (['SEM_ESTOQUE', 'ESTOQUE_CRITICO', 'VENCIDO'].includes(alertaTipo || '')) {
    borderColor = '#CC0000';
    bgColor = '#FFF5F5';
  } else if (['ESTOQUE_BAIXO', 'VALIDADE_PROXIMA'].includes(alertaTipo || '')) {
    borderColor = '#FF8C00';
    bgColor = '#FFFAF0';
  }

  // Calcula quantas unidades de compra o estoque representa
  const calcularUnidadesCompra = () => {
    if (!embalagem.conteudoUnidadeCompra || embalagem.conteudoUnidadeCompra === 0) {
      return null;
    }
    const unidades = embalagem.estoqueTotal / embalagem.conteudoUnidadeCompra;
    return unidades.toLocaleString('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
  };

  const unidadesCompra = calcularUnidadesCompra();
  const unidadeCompraPlural = embalagem.unidadeCompra + 's';

  return (
    <div
      id={`embalagem-${embalagem.id}`}
      ref={cardRef}
      className={`rounded-lg p-6 shadow-sm transition-all hover:shadow-md ${
        destacadoAqui ? 'ring-4 ring-[#FF8C00]/60' : ''
      }`}
      style={{
        backgroundColor: bgColor,
        border: `2px solid ${borderColor}`,
      }}
    >
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-[#1A1A1A]">{embalagem.nome}</h3>
        <div className="mt-1">
          <p className="text-sm text-[#6B6B6B]">
            {embalagem.estoqueTotal} unidade{embalagem.estoqueTotal !== 1 ? 's' : ''}
            {unidadesCompra && (
              <span className="text-xs text-[#6B6B6B] ml-1">
                (≈ {unidadesCompra} {unidadeCompraPlural})
              </span>
            )}
          </p>
        </div>
      </div>

      {alertasDaEmbalagem.length > 0 && (
        <div className="mb-4 rounded bg-opacity-10 p-2">
          {alertasDaEmbalagem.map((alerta, idx) => (
            <p key={idx} className="text-xs text-[#CC0000]">
              ⚠️ {alerta.mensagem}
            </p>
          ))}
        </div>
      )}

      <div className="flex gap-2">
        <button
          onClick={() => onEditar(embalagem)}
          className="flex-1 rounded-lg bg-[#3D1A1A] px-3 py-2 text-xs font-medium text-white transition-colors hover:bg-[#2D1515]"
          title="Editar embalagem"
        >
          <PencilIcon className="h-4 w-4" />
        </button>
        <button
          onClick={() => onRepor(embalagem)}
          className="flex-1 rounded-lg bg-[#3D1A1A] px-3 py-2 text-xs font-medium text-white transition-colors hover:bg-[#2D1515]"
          title="Repor estoque"
        >
          <ArrowPathIcon className="h-4 w-4" />
        </button>
        <button
          onClick={() => onDeletar(embalagem)}
          className="flex-1 rounded-lg bg-[#CC0000] px-3 py-2 text-xs font-medium text-white transition-colors hover:bg-[#B30000]"
          title="Deletar embalagem"
        >
          <TrashIcon className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
