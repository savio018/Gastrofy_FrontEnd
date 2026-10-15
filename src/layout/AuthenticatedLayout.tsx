import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';

export function AuthenticatedLayout() {
  const [menuAberto, setMenuAberto] = useState(false);

  useEffect(() => {
    if (!menuAberto) return;

    const fecharComEsc = (evento: KeyboardEvent) => {
      if (evento.key === 'Escape') setMenuAberto(false);
    };
    const overflowAnterior = document.body.style.overflow;

    document.addEventListener('keydown', fecharComEsc);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', fecharComEsc);
      document.body.style.overflow = overflowAnterior;
    };
  }, [menuAberto]);

  return (
    <div className="min-h-dvh bg-[var(--bg)] text-[var(--text)]">
      <Sidebar menuAberto={menuAberto} onFechar={() => setMenuAberto(false)} />

      {menuAberto && (
        <button
          type="button"
          aria-label="Fechar menu"
          onClick={() => setMenuAberto(false)}
          className="fixed inset-0 z-30 bg-black/20 backdrop-blur-sm md:hidden"
        />
      )}

      <div className="flex min-h-dvh min-w-0 flex-col md:ml-[240px]">
        <Topbar onAbrirMenu={() => setMenuAberto(true)} />
        <main className="min-w-0 flex-1 p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
