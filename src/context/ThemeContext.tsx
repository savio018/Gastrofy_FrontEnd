import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';

export type Tema = 'claro' | 'escuro';

interface ThemeContextValue {
  tema: Tema;
  toggleTema: () => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [tema, setTema] = useState<Tema>(() => {
    const salvo = localStorage.getItem('tema');
    return salvo === 'escuro' ? 'escuro' : 'claro';
  });

  useEffect(() => {
    localStorage.setItem('tema', tema);
    document.documentElement.classList.toggle('dark', tema === 'escuro');
  }, [tema]);

  const toggleTema = () => {
    setTema((atual) => (atual === 'claro' ? 'escuro' : 'claro'));
  };

  return (
    <ThemeContext.Provider value={{ tema, toggleTema }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme precisa ser usado dentro de um ThemeProvider');
  }
  return context;
}
