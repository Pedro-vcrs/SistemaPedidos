import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom'; 
import { authAPI } from '../services/auth';

export default function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    senha: ''
  });
  const [erro, setErro] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setErro('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro('');

    // Validação no frontend
    if (!formData.email || !formData.senha) {
      setErro('Por favor, preencha email e senha');
      return;
    }

    setLoading(true);

    try {
      console.log('Enviando login:', formData);
      await authAPI.login(formData.email, formData.senha);
      console.log('Login bem-sucedido!');
      navigate('/');
    } catch (error) {
      console.error('Erro no login:', error);
      setErro(error.response?.data?.error || 'Erro ao fazer login. Verifique suas credenciais.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-2xl p-8">
        {/* Logo/Título */}
        <div className="text-center mb-8">
          <div className="bg-blue-100 w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center">
            <span className="text-4xl">📦</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-800">Sistema de Pedidos</h1>
          <p className="text-gray-600 mt-2">Faça login para continuar</p>
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {erro && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {erro}
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Usuário
            </label>
            <input
              id="email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              autoComplete="email"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e-mail"
            />
          </div>

          <div>
            <label htmlFor="senha" className="block text-sm font-medium text-gray-700 mb-2">
              Senha
            </label>
            <input
              id="senha"
              type="password"
              name="senha"
              value={formData.senha}
              onChange={handleChange}
              required
              autoComplete="current-password"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Digite sua senha"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        {/* Link para consulta pública */}
        <div className="mt-6 text-center">
          <Link 
            to="/consulta" 
            className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium hover:underline transition-colors"
          >
            <span className="mr-2">🔍</span>
            Consultar meus pedidos
          </Link>
        </div>

        <div className="mt-6 text-center text-sm text-gray-600">
          <p>Sistema de Gestão de Pedidos</p>
          <p className="text-xs mt-1">© 2025 - Todos os direitos reservados</p>
        </div>
      </div>
    </div>
  );
}