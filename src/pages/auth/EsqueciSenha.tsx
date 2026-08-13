import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { ForkIcon } from '../../components/ForkIcon';
import { api } from '../../lib/api';

export function EsqueciSenha() {
  const [email, setEmail] = useState('');
  const [carregando, setCarregando] = useState(false);
  const [enviado, setEnviado] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setCarregando(true);
    try {
      await api.post('/auth/forgot-password', { email });
      setEnviado(true);
    } catch {
      toast.error('Não foi possível processar o pedido. Tente novamente.');
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

        {enviado ? (
          <div className="text-center">
            <h1 className="text-xl font-semibold text-[#1A1A1A]">Verifique seu email</h1>
            <p className="mt-2 text-sm text-[#6B6B6B]">
              Se existir uma conta com o email <strong>{email}</strong>, enviamos um
              link para redefinir sua senha.
            </p>
            <Link
              to="/login"
              className="mt-6 inline-block rounded-lg bg-[#3D1A1A] px-4 py-2.5 text-sm font-medium text-white"
            >
              Voltar para o login
            </Link>
          </div>
        ) : (
          <>
            <h1 className="text-center text-xl font-semibold text-[#1A1A1A]">
              Esqueci minha senha
            </h1>
            <p className="mt-1 text-center text-sm text-[#6B6B6B]">
              Informe seu email e enviaremos um link de redefinição
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

              <button
                type="submit"
                disabled={carregando}
                className="w-full rounded-lg bg-[#3D1A1A] py-2.5 text-sm font-medium text-white transition-opacity disabled:opacity-60"
              >
                {carregando ? 'Enviando...' : 'Enviar link'}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-[#6B6B6B]">
              <Link to="/login" className="font-medium text-[#3D1A1A] hover:underline">
                Voltar para o login
              </Link>
            </p>
          </>
        )}
      </div>
    </div>
  );
}
