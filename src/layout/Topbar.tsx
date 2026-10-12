import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BellIcon } from '@heroicons/react/24/outline';
import { useAlertas } from '../context/AlertasContext';
import type { Alerta } from '../types';
import { AlertasPanel } from './AlertasPanel';

export function Topbar() {
  const { alertas, carregando } = useAlertas();
  const [painelAberto, setPainelAberto] = useState(false);
  const navigate = useNavigate();

  const handleSelecionarAlerta = (alerta: Alerta) => {
    setPainelAberto(false);
    const params = new URLSearchParams({
      aba: alerta.categoria === 'EMBALAGEM' ? 'embalagens' : 'ingredientes',
      item: String(alerta.itemId),
    });
    if (alerta.loteId !== null) {
      params.set('lote', String(alerta.loteId));
    }
    navigate(`/insumos?${params.toString()}`);
  };

  return (
    <>
      <header className="sticky top-0 z-10 flex h-16 items-center justify-end bg-white px-6 shadow-sm">
        <button
          type="button"
          onClick={() => setPainelAberto(true)}
          className="relative rounded-full p-2 hover:bg-black/5"
          aria-label={`Ver alertas (${alertas.length})`}
        >
          <BellIcon className="h-6 w-6 text-[#1A1A1A]" />
          {alertas.length > 0 && (
            <span className="absolute right-0 top-0 flex h-5 w-5 items-center justify-center rounded-full bg-[#CC0000] text-[10px] font-bold text-white">
              {alertas.length > 99 ? '99+' : alertas.length}
            </span>
          )}
        </button>
      </header>

      <AlertasPanel
        aberto={painelAberto}
        carregando={carregando}
        alertas={alertas}
        onFechar={() => setPainelAberto(false)}
        onSelecionarAlerta={handleSelecionarAlerta}
      />
    </>
  );
}
