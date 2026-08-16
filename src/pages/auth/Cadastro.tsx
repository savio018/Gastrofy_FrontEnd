import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { ForkIcon } from '../../components/ForkIcon';
import { api } from '../../lib/api';

export function Cadastro() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [carregando, setCarregando] = useState(false);
  const [sucesso, setSucesso] = useState(false);
  const [erroEmail, setErroEmail] = useState('');
  const [erroSenha, setErroSenha] = useState('');
  const [erroNome, setErroNome] = useState('');
  const [erroConfirmar, setErroConfirmar] = useState('');

  const validarSenha = (s: string) => {
    if (s.length < 8) return 'A senha deve ter pelo menos 8 caracteres';
    if (!/[A-Z]/.test(s)) return 'A senha deve ter pelo menos uma letra maiúscula';
    if (!/[a-z]/.test(s)) return 'A senha deve ter pelo menos uma letra minúscula';
    if (!/[0-9]/.test(s)) return 'A senha deve ter pelo menos um número';
    return '';
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    setErroNome('');
    setErroEmail('');
    setErroSenha('');
    setErroConfirmar('');

    let valido = true;

    if (nome.length < 4) {
      setErroNome('O nome deve ter pelo menos 4 caracteres. Pode ser seu primeiro nome, nome completo ou nome da confeitaria.');
      valido = false;
    }

    const erroSenhaMsg = validarSenha(senha);
    if (erroSenhaMsg) {
      setErroSenha(erroSenhaMsg);
      valido = false;
    }

    if (senha !== confirmarSenha) {
      setErroConfirmar('As senhas não coincidem');
      valido = false;
    }

    if (!valido) return;

    setCarregando(true);

    try {
      await api.post('/usuarios', { nome, email, senha });
      setSucesso(true);
    } catch (error: any) {
      const data = error?.response?.data;

      if (data?.erros) {
        data.erros.forEach((e: any) => {
          if (e.campo === 'email') setErroEmail(e.mensagem);
          if (e.campo === 'senha') setErroSenha(e.mensagem);
          if (e.campo === 'nome') setErroNome(e.mensagem);
        });
      } else if (data?.message) {
        if (data.message.toLowerCase().includes('email')) {
          setErroEmail(data.message);
        } else {
          toast.error(data.message);
        }
      } else {
        toast.error('Não foi possível criar a conta. Tente novamente.');
      }
    } finally {
      setCarregando(false);
    }
  };

  if (sucesso) {
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
          <div className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-xl text-center">
            <ForkIcon className="h-8 w-8 text-[#3D1A1A] mx-auto mb-4" />
            <h1 className="text-xl font-semibold text-[#1A1A1A]">
              Verifique seu e-mail para ativar sua conta
            </h1>
            <p className="mt-2 text-sm text-[#6B6B6B]">
              Enviamos um link de confirmação para <strong>{email}</strong>. Abra o e-mail e confirme para poder entrar.
            </p>
            <Link
              to="/login"
              className="mt-6 inline-block rounded-lg bg-[#3D1A1A] px-4 py-2.5 text-sm font-medium text-white"
            >
              Ir para o login
            </Link>
          </div>
        </div>
      </div>
    );
  }

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
                onChange={(e) => setNome(e.target.value)}
                className={`w-full rounded-lg border px-3 py-2.5 text-sm outline-none focus:border-[#3D1A1A] ${erroNome ? 'border-red-500' : 'border-[#E5E0DA]'}`}
                placeholder="Seu nome ou nome da confeitaria"
              />
              {erroNome && <p className="mt-1 text-xs text-red-600">{erroNome}</p>}
            </div>

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
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full rounded-lg border px-3 py-2.5 text-sm outline-none focus:border-[#3D1A1A] ${erroEmail ? 'border-red-500' : 'border-[#E5E0DA]'}`}
                placeholder="voce@exemplo.com"
              />
              {erroEmail && <p
