import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import { listarAlertas } from '../api/alertas';
import type { Alerta } from '../types';

interface AlertasContextValue {
  alertas: Alerta[];
  carregando: boolean;
  recarregarAlertas: () => Promise<void>;
}

const AlertasContext = createContext<AlertasContextValue | undefined>(undefined);

export function AlertasProvider({ children }: { children: ReactNode }) {
  const [alertas, setAlertas] = useState<Alerta[]>([]);
  const [carregando, setCarregando] = useState(true);

  const recarregarAlertas = async () => {
    try {
      const data = await listarAlertas();
      setAlertas(data);
    } catch (error) {
      console.error('Erro ao recarregar alertas:', error);
      setAlertas([]);
    }
  };

  useEffect(() => {
    const carregarAlertas = async () => {
      setCarregando(true);
      try {
        const data = await listarAlertas();
        setAlertas(data);
      } catch {
        setAlertas([]);
      } finally {
        setCarregando(false);
      }
    };

    carregarAlertas();
  }, []);

  return (
    <AlertasContext.Provider value={{ alertas, carregando, recarregarAlertas }}>
      {children}
    </AlertasContext.Provider>
  );
}

export function useAlertas() {
  const context = useContext(AlertasContext);
  if (!context) {
    throw new Error('useAlertas precisa ser usado dentro de um AlertasProvider');
  }
  return context;
}
