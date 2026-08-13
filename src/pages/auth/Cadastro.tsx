import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { ForkIcon } from '../../components/ForkIcon';
import { api } from '../../lib/api';

export function Cadastro() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [carregando, setCarregando] = useState(false);
  const [sucesso, setSucesso] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setCarregando(true);
    try {
      await api.post('/usuarios', { nome, email, senha });
      setSucesso(true);
    } catch (error: any) {
      const mensagem =
        error?.response?.data?.message ?? 'Não foi possível criar a conta.';
      toast.error(mensagem);
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="grid min-h-screen grid-cols-1 md:grid-cols-2">
      <div className="hidden flex-col items-center justify-center gap-3 bg-[#3D1A1A] p-10 text-white md:flex">
        <ForkIcon className="h-10 w-10" />
        <span className="text-2xl font-semibold">Gastrofy</span>
        <p className="max-w-xs text-center text-sm text-white/70">
          Inteligência e sabor para o seu negócio prosperar.
        </p>
      </div>

      <div className="flex items-center justify-center bg-[#F5F0EB] p-6">
        <div className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-xl">
          {sucesso ? (
            <div className="text-center">
              <div className="mb-4 flex justify-center">
                <ForkIcon className="h-8 w-8 text-[#3D1A1A]" />
              </div>
              <h1 className="text-xl font-semibold text-[#1A1A1A]">
                Verifique seu email para ativar sua conta
              </h1>
              <p className="mt-2 text-sm text-[#6B6B6B]">
                Enviamos um link de confirmação para <strong>{email}</strong>.
                Abra o email e confirme para poder entrar.
              </p>
              <Link
                to="/login"
                className="mt-6 inline-block rounded-lg bg-[#3D1A1A] px-4 py-2.5 text-sm font-medium text-white"
              >
                Ir para o login
              </Link>
            </div>
          ) : (
            <>
              <h1 className="text-center text-xl font-semibold text-[#1A1A1A]">
                Criar conta
              </h1>
              <p className="mt-1 text-center text-sm text-[#6B6B6B]">
                Comece a organizar sua confeitaria hoje mesmo
              </p>

              <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                <div>
                  <label htmlFor="nome" className="mb-1 block text-sm font-medium text-[#1A1A1A]">
                    Nome completo
                  </label>
                  <input
                    id="nome"
                    type="text"
                    required
                    autoComplete="name"
                    value={nome}
                    onChange={(event) => setNome(event.target.value)}
                    className="w-full rounded-lg border border-[#E5E0DA] px-3 py-2.5 text-sm outline-none focus:border-[#3D1A1A]"
                    placeholder="Seu nome"
                  />
                </div>

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
                  <input
                    id="senha"
                    type="password"
                    required
                    minLength={6}
                    autoComplete="new-password"
                    value={senha}
                    onChange={(event) => setSenha(event.target.value)}
                    className="w-full rounded-lg border border-[#E5E0DA] px-3 py-2.5 text-sm outline-none focus:border-[#3D1A1A]"
                    placeholder="Mínimo 6 caracteres"
                  />
                </div>

                <button
                  type="submit"
                  disabled={carregando}
                  className="w-full rounded-lg bg-[#3D1A1A] py-2.5 text-sm font-medium text-white transition-opacity disabled:opacity-60"
                >
                  {carregando ? 'Criando conta...' : 'Criar conta'}
                </button>
              </form>

              <p className="mt-6 text-center text-sm text-[#6B6B6B]">
                Já tem conta?{' '}
                <Link to="/login" className="font-medium text-[#3D1A1A] hover:underline">
                  Entrar
                </Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
