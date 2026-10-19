import { useEffect, useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { ForkIcon } from '../../components/ForkIcon';
import { esqueciSenha } from '../../api/auth';

const INTERVALO_REENVIO_SEGUNDOS = 60;

export function EsqueciSenha() {
  const [email, setEmail] = useState('');
  const [carregando, setCarregando] = useState(false);
  const [enviado, setEnviado] = useState(false);
  const [segundosRestantes, setSegundosRestantes] = useState(0);

  useEffect(() => {
    if (segundosRestantes <= 0) return;
    const timer = setTimeout(() => setSegundosRestantes((s) => s - 1), 1000);
    return () => clearTimeout(timer);
  }, [segundosRestantes]);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setCarregando(true);
    try {
      await esqueciSenha(email);
      setEnviado(true);
      setSegundosRestantes(INTERVALO_REENVIO_SEGUNDOS);
    } catch {
      toast.error('Não foi possível processar o pedido agora. Tente novamente em instantes.');
    } finally {
      setCarregando(false);
    }
  };

  const textoBotao = carregando
    ? 'Enviando...'
    : segundosRestantes > 0
      ? `Reenviar em ${segundosRestantes}s`
      : 'Enviar link';

  return (
    <div className="flex min-h-dvh items-center justify-center bg-[#F5F0EB] p-4 sm:p-6">
      <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl sm:p-8">
        <div className="mb-6 flex items-center justify-center gap-2">
          <ForkIcon className="h-7 w-7 text-[#3D1A1A]" />
          <span className="text-lg font-semibold text-[#1A1A1A]">Gastrofy</span>
        </div>

        <h1 className="text-center text-xl font-semibold text-[#1A1A1A]">
          Esqueci minha senha
        </h1>
        <p className="mt-1 text-center text-sm text-[#6B6B6B]">
          Informe seu e-mail e enviaremos um link para criar uma nova senha
        </p>

        {enviado && (
          <p
            role="status"
            className="mt-4 rounded-lg bg-[#F5F0EB] p-3 text-sm text-[#1A1A1A]"
          >
            Se esse e-mail estiver cadastrado, enviamos um link para redefinir a senha.
            Ele vale por 1 hora. Olhe também o spam.
          </p>
        )}

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
              inputMode="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full rounded-lg border border-[#E5E0DA] bg-white px-3 py-2.5 text-sm outline-none focus:border-[#3D1A1A]"
              placeholder="voce@exemplo.com"
            />
          </div>

          <button
            type="submit"
            disabled={carregando || segundosRestantes > 0}
            className="min-h-11 w-full rounded-lg bg-[#3D1A1A] py-2.5 text-sm font-medium text-white transition-opacity disabled:opacity-60"
          >
            {textoBotao}
          </button>
        </form>

        <Link
          to="/login"
          className="mt-4 flex min-h-11 items-center justify-center text-sm font-medium text-[#3D1A1A] hover:underline"
        >
          Voltar para o login
        </Link>
      </div>
    </div>
  );
}
