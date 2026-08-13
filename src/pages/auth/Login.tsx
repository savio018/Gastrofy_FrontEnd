import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import { ForkIcon } from '../../components/ForkIcon';
import { useAuth } from '../../context/AuthContext';

export function Login() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [carregando, setCarregando] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setCarregando(true);
    try {
      await login(email, senha);
      navigate('/dashboard');
    } catch {
      toast.error('Email ou senha inválidos.');
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="grid min-h-screen grid-cols-1 md:grid-cols-2">
      <div className="flex items-center justify-center bg-[#F5F0EB] p-6">
        <div className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-xl">
          <div className="mb-6 flex items-center justify-center gap-2">
            <ForkIcon className="h-7 w-7 text-[#3D1A1A]" />
            <span className="text-lg font-semibold text-[#1A1A1A]">Gastrofy</span>
          </div>

          <h1 className="text-center text-xl font-semibold text-[#1A1A1A]">
            Bem-vindo de volta
          </h1>
          <p className="mt-1 text-center text-sm text-[#6B6B6B]">
            Entre para continuar gerenciando sua confeitaria
          </p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label htmlFor="email" className="mb-1 block text-sm font-medium text-[#1A1A1A]">
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="w-full rounded-lg border border-[#E5E0DA] px-3 py-2.5 text-sm outline-none focus:border-[#3D1A1A]"
                placeholder="voce@exemplo.com"
              />
            </div>

            <div>
              <label htmlFor="senha" className="mb-1 block text-sm font-medium text-[#1A1A1A]">
                Senha
              </label>
              <div className="relative">
                <input
                  id="senha"
                  type={mostrarSenha ? 'text' : 'password'}
                  required
                  autoComplete="current-password"
                  value={senha}
                  onChange={(event) => setSenha(event.target.value)}
                  className="w-full rounded-lg border border-[#E5E0DA] px-3 py-2.5 pr-10 text-sm outline-none focus:border-[#3D1A1A]"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setMostrarSenha((valor) => !valor)}
                  className="absolute inset-y-0 right-0 flex items-center px-3 text-[#6B6B6B]"
                  aria-label={mostrarSenha ? 'Ocultar senha' : 'Mostrar senha'}
                >
                  {mostrarSenha ? (
                    <EyeSlashIcon className="h-5 w-5" />
                  ) : (
                    <EyeIcon className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            <div className="text-right">
              <Link
                to="/esqueci-senha"
                className="text-sm font-medium text-[#3D1A1A] hover:underline"
              >
                Esqueci minha senha
              </Link>
            </div>

            <button
              type="submit"
              disabled={carregando}
              className="w-full rounded-lg bg-[#3D1A1A] py-2.5 text-sm font-medium text-white transition-opacity disabled:opacity-60"
            >
              {carregando ? 'Entrando...' : 'Entrar'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-[#6B6B6B]">
            Não tem conta?{' '}
            <Link to="/cadastro" className="font-medium text-[#3D1A1A] hover:underline">
              Criar conta
            </Link>
          </p>
        </div>
      </div>

      <div className="relative hidden overflow-hidden md:block">
        <div className="absolute inset-0 bg-gradient-to-br from-[#3D1A1A] via-[#6B3A2A] to-[#CAA06B]" />
        <div className="absolute inset-0 backdrop-blur-3xl" />
        <div className="absolute inset-0 bg-black/10" />
      </div>
    </div>
  );
}
