import { useEffect, useRef, useState } from 'react';
import { PencilIcon, ArrowPathIcon, TrashIcon, ChevronDownIcon, ChevronUpIcon, PencilSquareIcon } from '@heroicons/react/24/outline';
import type { Insumo, Alerta, TipoAlerta, LoteInsumo, DestaqueItem } from '../../types';
import { diasAteData, formatarDataLocal, parseDataLocal } from '../../lib/datas';

interface InsumoCardProps {
  insumo: Insumo;
  alertas: Alerta[];
  destaque: DestaqueItem | null;
  onEditar: (insumo: Insumo) => void;
  onRepor: (insumo: Insumo) => void;
  onCorrigir: (insumo: Insumo) => void;
  onEditarLote: (insumo: Insumo, lote: LoteInsumo) => void;
  onExcluirLote: (insumo: Insumo, lote: LoteInsumo) => void;
  onDeletar: (insumo: Insumo) => void;
}

const textoAlertaLote = (alerta: Alerta, lote: LoteInsumo): string => {
  if (alerta.tipo === 'VENCIDO') return 'Vencido';
  const dias = diasAteData(lote.dataValidade);
  if (dias <= 0) return 'Vence hoje';
  return `Vence em ${dias} ${dias === 1 ? 'dia' : 'dias'}`;
};

export function InsumoCard({
  insumo,
  alertas,
  destaque,
  onEditar,
  onRepor,
  onCorrigir,
  onEditarLote,
  onExcluirLote,
  onDeletar,
}: InsumoCardProps) {
  const [lotesExpandidos, setLotesExpandidos] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const destacadoAqui = destaque?.itemId === insumo.id;
  const loteDestacadoId = destacadoAqui ? destaque.loteId : null;
  const expandido = lotesExpandidos || loteDestacadoId !== null;

  const alertasDoInsumo = alertas.filter((a) => a.categoria === 'INSUMO' && a.itemId === insumo.id);
  const alertasDoItem = alertasDoInsumo.filter((a) => a.loteId === null);

  useEffect(() => {
    if (!destacadoAqui) return;
    const alvo = loteDestacadoId !== null
      ? document.getElementById(`lote-${loteDestacadoId}`)
      : cardRef.current;
    (alvo ?? cardRef.current)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, [destacadoAqui, loteDestacadoId]);

  const getAleraTipo = (): TipoAlerta | null => {
    for (const alerta of alertasDoInsumo) {
      if (['SEM_ESTOQUE', 'ESTOQUE_CRITICO', 'VENCIDO'].includes(alerta.tipo)) {
        return alerta.tipo as TipoAlerta;
      }
    }
    for (const alerta of alertasDoInsumo) {
      if (['ESTOQUE_BAIXO', 'VALIDADE_PROXIMA'].includes(alerta.tipo)) {
        return alerta.tipo as TipoAlerta;
      }
    }
    return null;
  };

  const alertaTipo = getAleraTipo();

  let borderColor = '#E5E0DA';
  let bgColor = '#FFFFFF';

  if (['SEM_ESTOQUE', 'ESTOQUE_CRITICO', 'VENCIDO'].includes(alertaTipo || '')) {
    borderColor = '#CC0000';
    bgColor = '#FFF5F5';
  } else if (['ESTOQUE_BAIXO', 'VALIDADE_PROXIMA'].includes(alertaTipo || '')) {
    borderColor = '#FF8C00';
    bgColor = '#FFFAF0';
  }

  const alertaDoLote = (loteId: number): Alerta | null => {
    const doLote = alertas.filter((a) => a.loteId === loteId);
    return doLote.find((a) => a.tipo === 'VENCIDO') ?? doLote.find((a) => a.tipo === 'VALIDADE_PROXIMA') ?? null;
  };

  // Calcula quantas unidades de compra o estoque representa
  const calcularUnidadesCompra = () => {
    if (!insumo.conteudoUnidadeCompra || insumo.conteudoUnidadeCompra === 0) {
      return null;
    }
    const unidades = insumo.estoqueTotal / insumo.conteudoUnidadeCompra;
    // Formata com 1 casa decimal usando vírgula (padrão brasileiro)
    return unidades.toLocaleString('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
  };

  const unidadesCompra = calcularUnidadesCompra();
  // Pluraliza a unidade de compra adicionando "s"
  const unidadeCompraPlural = insumo.unidadeCompra + 's';

  // Ordena lotes por validade mais próxima primeiro
  const lotesOrdenados = [...insumo.lotes].sort((a, b) =>
    parseDataLocal(a.dataValidade).getTime() - parseDataLocal(b.dataValidade).getTime()
  );

  return (
    <div
      id={`insumo-${insumo.id}`}
      ref={cardRef}
      className={`rounded-lg p-6 shadow-sm transition-all hover:shadow-md ${
        destacadoAqui && loteDestacadoId === null ? 'ring-4 ring-[#FF8C00]/60' : ''
      }`}
      style={{
        backgroundColor: bgColor,
        border: `2px solid ${borderColor}`,
      }}
    >
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-[#1A1A1A]">{insumo.nome}</h3>
        <div className="mt-1">
          <p className="text-sm text-[#6B6B6B]">
            {insumo.estoqueTotal} {insumo.unidadeConsumo}
            {unidadesCompra && (
              <span className="text-xs text-[#6B6B6B] ml-1">
                (≈ {unidadesCompra} {unidadeCompraPlural})
              </span>
            )}
          </p>
        </div>
        <button
          onClick={() => setLotesExpandidos(!expandido)}
          className="mt-2 text-xs text-[#3D1A1A] font-medium hover:underline inline-flex items-center gap-1"
        >
          {expandido ? (
            <>
              <ChevronUpIcon className="h-3 w-3" /> Ocultar lotes
            </>
          ) : (
            <>
              <ChevronDownIcon className="h-3 w-3" /> Ver lotes ({insumo.lotes.length})
            </>
          )}
        </button>

        {/* Lotes expandidos */}
        {expandido && (
          <div className="mt-3 space-y-2">
            {lotesOrdenados.length === 0 ? (
              <p className="text-xs text-[#6B6B6B] italic">Nenhum lote registrado</p>
            ) : (
              lotesOrdenados.map((lote) => {
                const alertaLote = alertaDoLote(lote.id);
                const destacadoLote = loteDestacadoId === lote.id;
                const vencido = alertaLote?.tipo === 'VENCIDO';

                let corLote = 'bg-[#F5F0EB] border-[#E5E0DA]';
                if (alertaLote) {
                  corLote = vencido ? 'bg-[#FFF5F5] border-[#CC0000]' : 'bg-[#FFFAF0] border-[#FF8C00]';
                }

                return (
                  <div
                    key={lote.id}
                    id={`lote-${lote.id}`}
                    className={`rounded p-2 text-xs border-l-2 ${corLote} ${
                      destacadoLote ? 'ring-2 ring-[#FF8C00]' : ''
                    }`}
                  >
                    <div className="flex justify-between items-start gap-2">
                      <div className="flex-1">
                        <p className="font-medium text-[#1A1A1A]">
                          {lote.quantidade} {insumo.unidadeConsumo}
                        </p>
                        <p className="text-[#6B6B6B]">
                          Válido: {formatarDataLocal(lote.dataValidade)}
                        </p>
                        <p className="text-[#6B6B6B]">
                          Comprado: {formatarDataLocal(lote.dataCompra)}
                        </p>
                        {alertaLote && (
                          <p className={`mt-1 font-medium ${vencido ? 'text-[#CC0000]' : 'text-[#B76E00]'}`}>
                            {textoAlertaLote(alertaLote, lote)}
                          </p>
                        )}
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => onEditarLote(insumo, lote)}
                            className="text-[#3D1A1A] hover:text-[#2D1515]"
                            title="Editar lote"
                          >
                            <PencilSquareIcon className="h-4 w-4" />
                          </button>
                          {!alertaLote && (
                            <button
                              onClick={() => onExcluirLote(insumo, lote)}
                              className="text-[#CC0000] hover:text-[#B30000]"
                              title="Excluir lote"
                            >
                              <TrashIcon className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                        {alertaLote && (
                          <button
                            onClick={() => onExcluirLote(insumo, lote)}
                            className="inline-flex items-center gap-1 rounded-md bg-[#CC0000] px-2 py-1 text-[11px] font-medium text-white transition-colors hover:bg-[#B30000]"
                          >
                            <TrashIcon className="h-3 w-3" /> Descartar lote
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>

      {alertasDoItem.length > 0 && (
        <div className="mb-4 rounded bg-opacity-10 p-2">
          {alertasDoItem.map((alerta, idx) => (
            <p key={idx} className="text-xs text-[#CC0000]">
              ⚠️ {alerta.mensagem}
            </p>
          ))}
        </div>
      )}

      <div className="flex gap-2">
        <button
          onClick={() => onEditar(insumo)}
          className="flex-1 rounded-lg bg-[#3D1A1A] px-3 py-2 text-xs font-medium text-white transition-colors hover:bg-[#2D1515]"
          title="Editar insumo"
        >
          <PencilIcon className="h-4 w-4" />
        </button>
        <button
          onClick={() => onRepor(insumo)}
          className="flex-1 rounded-lg bg-[#3D1A1A] px-3 py-2 text-xs font-medium text-white transition-colors hover:bg-[#2D1515]"
          title="Repor estoque"
        >
          <ArrowPathIcon className="h-4 w-4" />
        </button>
        <button
          onClick={() => onCorrigir(insumo)}
          className="flex-1 rounded-lg bg-[#FF8C00] px-3 py-2 text-xs font-medium text-white transition-colors hover:bg-[#E67E00]"
          title="Corrigir estoque"
        >
          <PencilSquareIcon className="h-4 w-4" />
        </button>
        <button
          onClick={() => onDeletar(insumo)}
          className="flex-1 rounded-lg bg-[#CC0000] px-3 py-2 text-xs font-medium text-white transition-colors hover:bg-[#B30000]"
          title="Deletar insumo"
        >
          <TrashIcon className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
