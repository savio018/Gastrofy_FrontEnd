import { useEffect, useState, type FormEvent, type ReactNode } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { ForkIcon } from '../../components/ForkIcon';
import { ChecklistSenha } from '../../components/ui/ChecklistSenha';
import { redefinirSenha } from '../../api/auth';
import { validarSenha } from '../../utils/senha';

export function RedefinirSenha() {
  const [searchParams] = useSearchParams();
  const [token] = useState(() => searchParams.get('token') ?? '');
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [carregando, setCarregando] = useState(false);
  const [concluido, setConcluido] = useState(false);
  const [erros, setErros] = useState<Record<string, string>>({});
  const [erroGeral, setErroGeral] = useState('');

  useEffect(() => {
    window.history.replaceState(null, '', window.location.pathname);
  }, []);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setErros({});
    setErroGeral('');

    const novosErros: Record<string, string> = {};
    const erroSenha = validarSenha(novaSenha);
    if (erroSenha) novosErros.novaSenha = erroSenha;
    if (novaSenha !== confirmarSenha) novosErros.confirmarSenha = 'As senhas não coincidem';
    if (Object.keys(novosErros).length > 0) {
      setErros(novosErros);
      return;
    }

    setCarregando(true);
    try {
      await redefinirSenha(token, novaSenha);
      setConcluido(true);
    } catch (error: any) {
      if (error?.response?.status === 400) {
        setErroGeral(error?.response?.data?.message || 'O link é inválido ou expirou.');
      } else {
        setErroGeral('Não foi possível redefinir a senha agora. Tente novamente.');
      }
    } finally {
      setCarregando(false);
    }
  };

  const cartao = (conteudo: ReactNode) => (
    <div className="flex min-h-dvh items-center justify-center bg-[#F5F0EB] p-4 sm:p-6">
      <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl sm:p-8">
        <div className="mb-6 flex items-center justify-center gap-2">
          <ForkIcon className="h-7 w-7 text-[#3D1A1A]" />
          <span className="text-lg font-semibold text-[#1A1A1A]">Gastrofy</span>
        </div>
        {conteudo}
      </div>
    </div>
  );

  if (concluido) {
    return cartao(
      <div className="text-center">
        <h1 className="text-xl font-semibold text-[#1A1A1A]">Senha alterada</h1>
        <p className="mt-2 text-sm text-[#6B6B6B]">
          Sua nova senha já está valendo. Entre na sua conta para continuar.
        </p>
        <Link
          to="/login"
          className="mt-6 flex min-h-11 w-full items-center justify-center rounded-lg bg-[#3D1A1A] px-4 py-2.5 text-sm font-medium text-white"
        >
          Entrar
        </Link>
      </div>,
    );
  }

  if (!token) {
    return cartao(
      <div className="text-center">
        <h1 className="text-xl font-semibold text-[#1A1A1A]">Link inválido ou incompleto</h1>
        <p className="mt-2 text-sm text-[#6B6B6B]">
          Este link de redefinição não está completo. Peça um novo link.
        </p>
        <Link
          to="/esqueci-senha"
          className="mt-6 flex min-h-11 w-full items-center justify-center rounded-lg bg-[#3D1A1A] px-4 py-2.5 text-sm font-medium text-white"
        >
          Pedir novo link
        </Link>
      </div>,
    );
  }

  return cartao(
    <>
      <h1 className="text-center text-xl font-semibold text-[#1A1A1A]">Redefinir senha</h1>
      <p className="mt-1 text-center text-sm text-[#6B6B6B]">
        Escolha uma nova senha para sua conta
      </p>

      {erroGeral && (
        <div className="mt-4 space-y-2 rounded-lg bg-[#CC0000]/10 p-3 text-sm text-[#CC0000]">
          <p className="break-words">{erroGeral}</p>
          <Link
            to="/esqueci-senha"
            className="flex min-h-11 items-center justify-center rounded-lg border border-[#CC0000] bg-white px-4 font-medium text-[#CC0000]"
          >
            Pedir novo link
          </Link>
        </div>
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
              autoComplete="new-password"
              value={novaSenha}
              onChange={(event) => setNovaSenha(event.target.value)}
              className={`w-full rounded-lg border bg-white px-3 py-2.5 pr-12 text-sm outline-none focus:border-[#3D1A1A] ${erros.novaSenha ? 'border-red-500' : 'border-[#E5E0DA]'}`}
              placeholder="Mínimo 8 caracteres"
            />
            <button
              type="button"
              onClick={() => setMostrarSenha((valor) => !valor)}
              className="absolute inset-y-0 right-0 flex min-h-11 min-w-11 items-center justify-center text-[#6B6B6B]"
              aria-label={mostrarSenha ? 'Ocultar senha' : 'Mostrar senha'}
            >
              {mostrarSenha ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
            </button>
          </div>
          <ChecklistSenha senha={novaSenha} />
          {erros.novaSenha && <p className="mt-1 text-xs text-red-600">{erros.novaSenha}</p>}
        </div>

        <div>
          <label htmlFor="confirmarSenha" className="mb-1 block text-sm font-medium text-[#1A1A1A]">
            Confirmar senha
          </label>
          <input
            id="confirmarSenha"
            type={mostrarSenha ? 'text' : 'password'}
            required
            autoComplete="new-password"
            value={confirmarSenha}
            onChange={(event) => setConfirmarSenha(event.target.value)}
            className={`w-full rounded-lg border bg-white px-3 py-2.5 text-sm outline-none focus:border-[#3D1A1A] ${erros.confirmarSenha ? 'border-red-500' : 'border-[#E5E0DA]'}`}
            placeholder="Repita a senha"
          />
          {erros.confirmarSenha && (
            <p className="mt-1 text-xs text-red-600">{erros.confirmarSenha}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={carregando}
          className="min-h-11 w-full rounded-lg bg-[#3D1A1A] py-2.5 text-sm font-medium text-white transition-opacity disabled:opacity-60"
        >
          {carregando ? 'Salvando...' : 'Redefinir senha'}
        </button>
      </form>

      <Link
        to="/login"
        className="mt-4 flex min-h-11 items-center justify-center text-sm font-medium text-[#3D1A1A] hover:underline"
      >
        Voltar para o login
      </Link>
    </>,
  );
}
