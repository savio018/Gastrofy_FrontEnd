import { useState, type FormEvent } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { ForkIcon } from '../../components/ForkIcon';
import { api } from '../../lib/api';

export function RedefinirSenha() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') ?? '';
  const [novaSenha, setNovaSenha] = useState('');
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [carregando, setCarregando] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    if (!token) {
      toast.error('Link inválido ou expirado. Solicite um novo.');
      return;
    }

    setCarregando(true);
    try {
      await api.post('/auth/reset-password', { token, novaSenha });
      toast.success('Senha redefinida com sucesso. Faça login.');
      navigate('/login');
    } catch {
      toast.error('Não foi possível redefinir a senha. O link pode ter expirado.');
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F5F0EB] p-6">
      <div className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-xl">
        <div className="mb-6 flex items-center justify-center gap-2">
          <ForkIcon className="h-7 w-7 text-[#3D1A1A]" />
          <span className="text-lg font-semibold text-[#1A1A1A]">Gastrofy</span>
        </div>

        <h1 className="text-center text-xl font-semibold text-[#1A1A1A]">
          Redefinir senha
        </h1>
        <p className="mt-1 text-center text-sm text-[#6B6B6B]">
          Escolha uma nova senha para sua conta
        </p>

        {!token && (
          <p className="mt-4 rounded-lg bg-[#CC0000]/10 p-3 text-center text-sm text-[#CC0000]">
            Link inválido ou incompleto. Solicite um novo link de redefinição.
          </p>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label htmlFor="novaSenha" className="mb-1 block text-sm font-medium text-[#1A1A1A]">
              Nova senha
            </label>
            <div className="relative">
              <input
                id="novaSenha"
                type={mostrarSenha ? 'text' : 'password'}
                required
                minLength={6}
                autoComplete="new-password"
                value={novaSenha}
                onChange={(event) => setNovaSenha(event.target.value)}
                className="w-full rounded-lg border border-[#E5E0DA] px-3 py-2.5 pr-10 text-sm outline-none focus:border-[#3D1A1A]"
                placeholder="Mínimo 6 caracteres"
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

          <button
            type="submit"
            disabled={carregando || !token}
            className="w-full rounded-lg bg-[#3D1A1A] py-2.5 text-sm font-medium text-white transition-opacity disabled:opacity-60"
          >
            {carregando ? 'Salvando...' : 'Redefinir senha'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-[#6B6B6B]">
          <Link to="/login" className="font-medium text-[#3D1A1A] hover:underline">
            Voltar para o login
          </Link>
        </p>
      </div>
    </div>
  );
}
