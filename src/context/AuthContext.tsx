import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../lib/api';
import type { Usuario } from '../types';

interface AuthContextValue {
  token: string | null;
  usuario: Usuario | null;
  carregandoUsuario: boolean;
  login: (email: string, senha: string) => Promise<void>;
  logout: () => void;
  carregarUsuario: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() =>
    localStorage.getItem('token'),
  );
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [carregandoUsuario, setCarregandoUsuario] = useState(false);
  const navigate = useNavigate();

  const carregarUsuario = async () => {
    setCarregandoUsuario(true);
    try {
      const { data } = await api.get<Usuario>('/usuarios/me');
      setUsuario(data);
    } finally {
      setCarregandoUsuario(false);
    }
  };

  useEffect(() => {
    if (token) {
      carregarUsuario();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const login = async (email: string, senha: string) => {
    const { data } = await api.post<{ token: string }>('/auth/login', {
      email,
      senha,
    });
    localStorage.setItem('token', data.token);
    setToken(data.token);
    await carregarUsuario();
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUsuario(null);
    navigate('/login');
  };

  return (
    <AuthContext.Provider
      value={{ token, usuario, carregandoUsuario, login, logout, carregarUsuario }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth precisa ser usado dentro de um AuthProvider');
  }
  return context;
}
