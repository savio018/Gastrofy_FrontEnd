import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';

export function AuthenticatedLayout() {
  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)]">
      <Sidebar />
      <div className="ml-[240px] flex min-h-screen flex-col">
        <Topbar />
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
