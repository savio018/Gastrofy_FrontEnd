import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  HomeIcon,
  ArchiveBoxIcon,
  BookOpenIcon,
  CakeIcon,
  ClipboardDocumentListIcon,
  UsersIcon,
  EllipsisVerticalIcon,
  UserCircleIcon,
  SunIcon,
  MoonIcon,
  ArrowRightOnRectangleIcon,
} from '@heroicons/react/24/outline';
import { ForkIcon } from '../components/ForkIcon';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const MENU = [
  { label: 'Dashboard', path: '/dashboard', icon: HomeIcon },
  { label: 'Insumos', path: '/insumos', icon: ArchiveBoxIcon },
  { label: 'Receitas', path: '/receitas', icon: BookOpenIcon },
  { label: 'Produtos', path: '/produtos', icon: CakeIcon },
  { label: 'Pedidos', path: '/pedidos', icon: ClipboardDocumentListIcon },
  { label: 'Clientes', path: '/clientes', icon: UsersIcon },
];

function iniciais(nome?: string) {
  if (!nome) return '?';
  const partes = nome.trim().split(/\s+/);
  const primeira = partes[0]?.[0] ?? '';
  const ultima = partes.length > 1 ? partes[partes.length - 1][0] : '';
  return (primeira + ultima).toUpperCase();
}

export function Sidebar() {
  const [menuAberto, setMenuAberto] = useState(false);
  const { usuario, logout } = useAuth();
  const { tema, toggleTema } = useTheme();
  const navigate = useNavigate();

  return (
    <aside className="fixed inset-y-0 left-0 z-20 flex h-screen w-[240px] flex-col bg-[#3D1A1A] text-white">
      <div className="flex items-center gap-2 px-6 py-6">
        <ForkIcon className="h-6 w-6 shrink-0" />
        <div className="leading-tight">
          <div className="text-lg font-semibold">Gastrofy</div>
          <div className="text-[10px] tracking-widest text-white/60">
            KITCHEN MANAGEMENT
          </div>
        </div>
      </div>

      <nav className="mt-4 flex-1 space-y-1 px-3">
        {MENU.map(({ label, path, icon: Icon }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
                isActive
                  ? 'bg-white/10 text-white'
                  : 'text-white/70 hover:bg-white/5 hover:text-white'
              }`
            }
          >
            <Icon className="h-5 w-5 shrink-0" />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="relative border-t border-white/10 p-4">
        {menuAberto && (
          <div className="absolute bottom-full left-4 right-4 mb-2 overflow-hidden rounded-lg bg-white text-sm text-[#1A1A1A] shadow-lg">
            <button
              type="button"
              onClick={() => {
                setMenuAberto(false);
                navigate('/perfil');
              }}
              className="flex w-full items-center gap-2 px-4 py-2.5 text-left hover:bg-black/5"
            >
              <UserCircleIcon className="h-4 w-4" />
              Editar perfil
            </button>
            <button
              type="button"
              onClick={() => {
                toggleTema();
                setMenuAberto(false);
              }}
              className="flex w-full items-center gap-2 px-4 py-2.5 text-left hover:bg-black/5"
            >
              {tema === 'claro' ? (
                <MoonIcon className="h-4 w-4" />
              ) : (
                <SunIcon className="h-4 w-4" />
              )}
              Tema {tema === 'claro' ? 'escuro' : 'claro'}
            </button>
            <button
              type="button"
              onClick={() => {
                setMenuAberto(false);
                logout();
              }}
              className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-[#CC0000] hover:bg-black/5"
            >
              <ArrowRightOnRectangleIcon className="h-4 w-4" />
              Sair
            </button>
          </div>
        )}

        <button
          type="button"
          onClick={() => setMenuAberto((aberto) => !aberto)}
          className="flex w-full items-center gap-3 rounded-lg px-1 py-1 text-left hover:bg-white/5"
        >
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/20 text-sm font-semibold">
            {iniciais(usuario?.nome)}
          </div>
          <div className="min-w-0 flex-1">
            <div className="truncate text-sm font-medium">
              {usuario?.nome ?? 'Carregando...'}
            </div>
            <div className="truncate text-xs text-white/60">
              {usuario?.email ?? ''}
            </div>
          </div>
          <EllipsisVerticalIcon className="h-5 w-5 shrink-0 text-white/60" />
        </button>
      </div>
    </aside>
  );
}
