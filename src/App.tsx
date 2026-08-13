import { Routes, Route, Navigate } from 'react-router-dom';
import { PrivateRoute } from './routes/PrivateRoute';
import { AuthenticatedLayout } from './layout/AuthenticatedLayout';
import { Login } from './pages/auth/Login';
import { Cadastro } from './pages/auth/Cadastro';
import { EsqueciSenha } from './pages/auth/EsqueciSenha';
import { RedefinirSenha } from './pages/auth/RedefinirSenha';
import { Dashboard } from './pages/Dashboard';
import { Insumos } from './pages/Insumos';
import { Receitas } from './pages/Receitas';
import { Produtos } from './pages/Produtos';
import { Pedidos } from './pages/Pedidos';
import { Clientes } from './pages/Clientes';
import { Perfil } from './pages/Perfil';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />

      <Route path="/login" element={<Login />} />
      <Route path="/cadastro" element={<Cadastro />} />
      <Route path="/esqueci-senha" element={<EsqueciSenha />} />
      <Route path="/redefinir-senha" element={<RedefinirSenha />} />

      <Route
        element={
          <PrivateRoute>
            <AuthenticatedLayout />
          </PrivateRoute>
        }
      >
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/insumos" element={<Insumos />} />
        <Route path="/receitas" element={<Receitas />} />
        <Route path="/produtos" element={<Produtos />} />
        <Route path="/pedidos" element={<Pedidos />} />
        <Route path="/clientes" element={<Clientes />} />
        <Route path="/perfil" element={<Perfil />} />
      </Route>

      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export default App;
