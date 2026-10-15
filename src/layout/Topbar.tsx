import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BellIcon, Bars3Icon } from '@heroicons/react/24/outline';
import { useAlertas } from '../context/AlertasContext';
import type { Alerta } from '../types';
import { ForkIcon } from '../components/ForkIcon';
import { AlertasPanel } from './AlertasPanel';

interface TopbarProps {
  onAbrirMenu: () => void;
}

export function Topbar({ onAbrirMenu }: TopbarProps) {
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
      <header className="sticky top-0 z-10 flex h-16 items-center bg-white px-4 shadow-sm md:justify-end md:px-6">
        <button
          type="button"
          onClick={onAbrirMenu}
          className="flex h-11 w-11 items-center justify-center rounded-full hover:bg-black/5 md:hidden"
          aria-label="Abrir menu"
        >
          <Bars3Icon className="h-6 w-6 text-[#1A1A1A]" />
        </button>

        <div className="ml-2 flex items-center gap-2 md:hidden">
          <ForkIcon className="h-5 w-5 text-[#3D1A1A]" />
          <span className="text-base font-semibold text-[#1A1A1A]">Gastrofy</span>
        </div>

        <button
          type="button"
          onClick={() => setPainelAberto(true)}
          className="relative ml-auto flex h-11 w-11 items-center justify-center rounded-full hover:bg-black/5"
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
