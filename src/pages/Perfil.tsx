import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useAuth } from '../context/AuthContext';

export function Perfil() {
  const { usuario, carregandoUsuario, logout } = useAuth();

  return (
    <div>
      <h1 className="text-2xl font-semibold text-[var(--text)]">Meu perfil</h1>

      <div className="mt-4 max-w-md rounded-xl border border-[var(--border)] bg-[var(--card)] p-6">
        {carregandoUsuario && !usuario && (
          <p className="text-sm text-[var(--text-muted)]">Carregando...</p>
        )}

        {usuario && (
          <dl className="space-y-4 text-sm">
            <div>
              <dt className="text-[var(--text-muted)]">Nome</dt>
              <dd className="font-medium text-[var(--text)]">{usuario.nome}</dd>
            </div>
            <div>
              <dt className="text-[var(--text-muted)]">Email</dt>
              <dd className="font-medium text-[var(--text)]">{usuario.email}</dd>
            </div>
            <div>
              <dt className="text-[var(--text-muted)]">Membro desde</dt>
              <dd className="font-medium text-[var(--text)]">
                {format(parseISO(usuario.dataCriacao), "d 'de' MMMM 'de' yyyy", {
                  locale: ptBR,
                })}
              </dd>
            </div>
          </dl>
        )}

        <button
          type="button"
          onClick={logout}
          className="mt-6 rounded-lg border border-[#CC0000] px-4 py-2 text-sm font-medium text-[#CC0000] hover:bg-[#CC0000]/5"
        >
          Sair da conta
        </button>
      </div>
    </div>
  );
}
