import { useState, useEffect, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { ForkIcon } from '../../components/ForkIcon';
import { useAuth } from '../../context/AuthContext';
import { reenviarVerificacao } from '../../api/auth';

export function Login() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [carregando, setCarregando] = useState(false);
  const [erroLogin, setErroLogin] = useState('');
  const [emailNaoVerificado, setEmailNaoVerificado] = useState(false);
  const [carregandoReenvio, setCarregandoReenvio] = useState(false);
  const [tempoEsperaReenvio, setTempoEsperaReenvio] = useState(0);
  const [mensagemReenvio, setMensagemReenvio] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (tempoEsperaReenvio > 0) {
      const timer = setTimeout(() => setTempoEsperaReenvio(tempoEsperaReenvio - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [tempoEsperaReenvio]);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setCarregando(true);
    setErroLogin('');
    setEmailNaoVerificado(false);
    setMensagemReenvio('');
    try {
      await login(email, senha);
      navigate('/dashboard');
    } catch (error: any) {
      const mensagem = error?.response?.data?.message ?? '';
      if (mensagem.toLowerCase().includes('verificado')) {
        setErroLogin('Seu e-mail ainda não foi verificado. Verifique sua caixa de entrada e clique no link que enviamos.');
        setEmailNaoVerificado(true);
        setTempoEsperaReenvio(0);
      } else {
        setErroLogin('E-mail ou senha inválidos.');
        setEmailNaoVerificado(false);
      }
    } finally {
      setCarregando(false);
    }
  };

  const handleReenviarVerificacao = async () => {
    if (!email) return;

    setCarregandoReenvio(true);
    try {
      await reenviarVerificacao(email);
      setMensagemReenvio('Email reenviado! Verifique sua caixa de entrada (e spam).');
      setTempoEsperaReenvio(30);
    } catch {
      setMensagemReenvio('Email reenviado! Verifique sua caixa de entrada (e spam).');
      setTempoEsperaReenvio(30);
    } finally {
      setCarregandoReenvio(false);
    }
  };

  return (
    <div className="grid min-h-dvh grid-cols-1 md:grid-cols-2">
      <div className="flex items-center justify-center bg-[#F5F0EB] p-4 sm:p-6">
        <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl sm:p-8">
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
                E-mail
              </label>
              <input
                id="email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(event) => { setEmail(event.target.value); setErroLogin(''); }}
                className="w-full rounded-lg border border-[#E5E0DA] bg-white px-3 py-2.5 text-sm outline-none focus:border-[#3D1A1A]"
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
                  onChange={(event) => { setSenha(event.target.value); setErroLogin(''); }}
                  className="w-full rounded-lg border border-[#E5E0DA] bg-white px-3 py-2.5 pr-10 text-sm outline-none focus:border-[#3D1A1A]"
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

            {erroLogin && (
              <div className="space-y-3">
                <p className="text-center text-sm text-red-600">{erroLogin}</p>
                {emailNaoVerificado && (
                  <div className="space-y-2">
                    {mensagemReenvio && (
                      <p className="text-center text-sm text-green-600">{mensagemReenvio}</p>
                    )}
                    <button
                      type="button"
                      onClick={handleReenviarVerificacao}
                      disabled={carregandoReenvio || tempoEsperaReenvio > 0}
                      className="min-h-11 w-full rounded-lg border border-[#3D1A1A] px-4 py-2 text-sm font-medium text-[#3D1A1A] transition-colors hover:bg-[#3D1A1A]/5 disabled:opacity-60"
                    >
                      {carregandoReenvio ? 'Enviando...' : tempoEsperaReenvio > 0 ? `Reenviar em ${tempoEsperaReenvio}s` : 'Reenviar email de verificação'}
                    </button>
                  </div>
                )}
              </div>
            )}

            <button
              type="submit"
              disabled={carregando}
              className="min-h-11 w-full rounded-lg bg-[#3D1A1A] py-2.5 text-sm font-medium text-white transition-opacity disabled:opacity-60"
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