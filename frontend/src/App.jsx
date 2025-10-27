import { BrowserRouter, Routes, Route, Link, Navigate, useLocation } from 'react-router-dom';
import ListaPedidos from './pages/ListaPedidos';
import FormPedido from './pages/FormPedido';
import Login from './pages/Login';
import ConsultaPublica from './pages/ConsultaPublica';
import { authAPI } from './services/auth';

// Componente para proteger rotas
function RotaProtegida({ children }) {
  if (!authAPI.isAutenticado()) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

function Navigation() {
  const location = useLocation();
  const usuario = authAPI.getUsuario();

  const handleLogout = () => {
    if (confirm('Deseja realmente sair?')) {
      authAPI.logout();
      window.location.href = '/login';
    }
  };

  return (
    <nav className="bg-gradient-to-r from-blue-600 to-blue-700 shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <div className="flex space-x-1">
            <Link
              to="/"
              className={`px-6 py-2 rounded-t-lg transition-colors ${
                location.pathname === '/'
                  ? 'bg-white text-blue-600 font-semibold'
                  : 'text-white hover:bg-blue-500'
              }`}
            >
              📋 Pedidos
            </Link>
            <Link
              to="/novo"
              className={`px-6 py-2 rounded-t-lg transition-colors ${
                location.pathname === '/novo'
                  ? 'bg-white text-blue-600 font-semibold'
                  : 'text-white hover:bg-blue-500'
              }`}
            >
              ➕ Novo Pedido
            </Link>
            <Link
              to="/consulta"
              className={`px-6 py-2 rounded-t-lg transition-colors ${
                location.pathname === '/consulta'
                  ? 'bg-white text-blue-600 font-semibold'
                  : 'text-white hover:bg-blue-500'
              }`}
            >
              👁️ Consulta Pública
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <span className="text-white text-sm">
              👤 {usuario?.nome}
            </span>
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition-colors"
            >
              Sair
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ========== ROTAS PÚBLICAS (SEM PROTEÇÃO) ========== */}
        <Route path="/login" element={<Login />} />
        <Route path="/consulta" element={<ConsultaPublica />} />

        {/* ========== ROTAS PROTEGIDAS (COM AUTENTICAÇÃO) ========== */}
        <Route
          path="/"
          element={
            <RotaProtegida>
              <div className="min-h-screen bg-gray-50">
                <Navigation />
                <ListaPedidos />
                <footer className="bg-gray-800 text-white text-center py-4 mt-12">
                  <p>© 2025 Sistema de Gestão de Pedidos - Todos os direitos reservados</p>
                </footer>
              </div>
            </RotaProtegida>
          }
        />

        <Route
          path="/novo"
          element={
            <RotaProtegida>
              <div className="min-h-screen bg-gray-50">
                <Navigation />
                <FormPedido />
                <footer className="bg-gray-800 text-white text-center py-4 mt-12">
                  <p>© 2025 Sistema de Gestão de Pedidos - Todos os direitos reservados</p>
                </footer>
              </div>
            </RotaProtegida>
          }
        />

        <Route
          path="/editar/:id"
          element={
            <RotaProtegida>
              <div className="min-h-screen bg-gray-50">
                <Navigation />
                <FormPedido />
                <footer className="bg-gray-800 text-white text-center py-4 mt-12">
                  <p>© 2025 Sistema de Gestão de Pedidos - Todos os direitos reservados</p>
                </footer>
              </div>
            </RotaProtegida>
          }
        />

        {/* Rota padrão - redireciona para login se não autenticado */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;