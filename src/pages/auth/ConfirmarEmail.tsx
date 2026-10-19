import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ForkIcon } from '../../components/ForkIcon';
import { confirmarEmail } from '../../api/auth';

type Estado = 'sem-token' | 'verificando' | 'sucesso' | 'token-invalido' | 'falha-tecnica';

const BOTAO_PRINCIPAL =
  'flex min-h-11 w-full items-center justify-center rounded-lg bg-[#3D1A1A] px-4 py-2.5 text-sm font-medium text-white';
const BOTAO_SECUNDARIO =
  'flex min-h-11 w-full items-center justify-center rounded-lg border border-[#3D1A1A] px-4 py-2.5 text-sm font-medium text-[#3D1A1A]';

export function ConfirmarEmail() {
  const [searchParams] = useSearchParams();
  const [token] = useState(() => searchParams.get('token') ?? '');
  const [estado, setEstado] = useState<Estado>(token ? 'verificando' : 'sem-token');
  const [mensagem, setMensagem] = useState('');
  const chamadaIniciada = useRef(false);

  useEffect(() => {
    window.history.replaceState(null, '', window.location.pathname);
  }, []);

  const verificar = useCallback(async () => {
    setEstado('verificando');
    try {
      await confirmarEmail(token);
      setEstado('sucesso');
    } catch (error: any) {
      if (error?.response?.status === 400) {
        setMensagem(error.response.data?.message || 'Este link é inválido ou já foi usado.');
        setEstado('token-invalido');
      } else {
        setEstado('falha-tecnica');
      }
    }
  }, [token]);

  useEffect(() => {
    if (!token || chamadaIniciada.current) return;
    chamadaIniciada.current = true;
    verificar();
  }, [token, verificar]);

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

  if (estado === 'verificando') {
    return cartao(
      <div className="text-center" role="status">
        <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-[#E5E0DA] border-t-[#3D1A1A]" />
        <p className="text-sm text-[#6B6B6B]">Confirmando seu e-mail...</p>
      </div>,
    );
  }

  if (estado === 'sucesso') {
    return cartao(
      <div className="text-center">
        <h1 className="text-xl font-semibold text-[#1A1A1A]">E-mail confirmado!</h1>
        <p className="mt-2 text-sm text-[#6B6B6B]">Agora você já pode entrar.</p>
        <Link to="/login" className={`mt-6 ${BOTAO_PRINCIPAL}`}>
          Entrar
        </Link>
      </div>,
    );
  }

  if (estado === 'token-invalido') {
    return cartao(
      <div className="text-center">
        <h1 className="text-xl font-semibold text-[#1A1A1A]">Não foi possível confirmar</h1>
        <p className="mt-4 break-words rounded-lg bg-[#CC0000]/10 p-3 text-sm text-[#CC0000]">
          {mensagem}
        </p>
        <p className="mt-4 text-sm text-[#6B6B6B]">Se você já confirmou antes, é só entrar.</p>
        <div className="mt-6 space-y-3">
          <Link to="/login" className={BOTAO_PRINCIPAL}>
            Ir para o login
          </Link>
          <Link to="/cadastro" className={BOTAO_SECUNDARIO}>
            Voltar ao cadastro
          </Link>
        </div>
      </div>,
    );
  }

  if (estado === 'falha-tecnica') {
    return cartao(
      <div className="text-center">
        <h1 className="text-xl font-semibold text-[#1A1A1A]">Algo deu errado</h1>
        <p className="mt-2 text-sm text-[#6B6B6B]">
          Não conseguimos confirmar agora. Tente de novo em instantes.
        </p>
        <button type="button" onClick={verificar} className={`mt-6 ${BOTAO_PRINCIPAL}`}>
          Tentar de novo
        </button>
      </div>,
    );
  }

  return cartao(
    <div className="text-center">
      <h1 className="text-xl font-semibold text-[#1A1A1A]">Link inválido ou incompleto</h1>
      <p className="mt-2 text-sm text-[#6B6B6B]">
        Este link de confirmação não está completo. Entre na sua conta ou crie uma nova.
      </p>
      <Link to="/login" className={`mt-6 ${BOTAO_PRINCIPAL}`}>
        Ir para o login
      </Link>
    </div>,
  );
}
