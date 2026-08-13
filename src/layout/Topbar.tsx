import { useEffect, useState } from 'react';
import { BellIcon } from '@heroicons/react/24/outline';
import { api } from '../lib/api';
import type { Alerta } from '../types';
import { AlertasPanel } from './AlertasPanel';

export function Topbar() {
  const [alertas, setAlertas] = useState<Alerta[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [painelAberto, setPainelAberto] = useState(false);

  useEffect(() => {
    api
      .get<Alerta[]>('/alertas')
      .then(({ data }) => setAlertas(data))
      .catch(() => setAlertas([]))
      .finally(() => setCarregando(false));
  }, []);

  return (
    <>
      <header className="sticky top-0 z-10 flex h-16 items-center justify-end bg-white px-6 shadow-sm">
        <button
          type="button"
          onClick={() => setPainelAberto(true)}
          className="relative rounded-full p-2 hover:bg-black/5"
          aria-label="Ver alertas"
        >
          <BellIcon className="h-6 w-6 text-[#1A1A1A]" />
          {alertas.length > 0 && (
            <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-[#CC0000]" />
          )}
        </button>
      </header>

      <AlertasPanel
        aberto={painelAberto}
        carregando={carregando}
        alertas={alertas}
        onFechar={() => setPainelAberto(false)}
      />
    </>
  );
}
