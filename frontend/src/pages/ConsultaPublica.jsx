import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

export default function ConsultaPublica() {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState('');
  const [filtroStatus, setFiltroStatus] = useState('TODOS');
  const [busca, setBusca] = useState('');

  useEffect(() => {
    carregarPedidos();
  }, []);

  const carregarPedidos = async () => {
    try {
      setLoading(true);
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
      const response = await axios.get(`${API_URL}/pedidos/publico/listar`);
      setPedidos(response.data);
      setErro('');
    } catch (error) {
      console.error('Erro ao carregar pedidos:', error);
      setErro('Erro ao carregar pedidos. Tente novamente mais tarde.');
    } finally {
      setLoading(false);
    }
  };

  const pedidosFiltrados = pedidos.filter(p => {
    const matchStatus = filtroStatus === 'TODOS' || p.status === filtroStatus;
    const matchBusca = busca === '' || 
      p.clienteNome.toLowerCase().includes(busca.toLowerCase()) ||
      p.descricaoServico.toLowerCase().includes(busca.toLowerCase());
    
    return matchStatus && matchBusca;
  });

  const getStatusColor = (status) => {
    const cores = {
      PENDENTE: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      EM_ANDAMENTO: 'bg-blue-100 text-blue-800 border-blue-300',
      CONCLUIDO: 'bg-green-100 text-green-800 border-green-300',
      ENTREGUE: 'bg-purple-100 text-purple-800 border-purple-300',
      CANCELADO: 'bg-red-100 text-red-800 border-red-300'
    };
    return cores[status] || 'bg-gray-100 text-gray-800 border-gray-300';
  };

  const getStatusLabel = (status) => {
    const labels = {
      PENDENTE: '⏳ PENDENTE',
      EM_ANDAMENTO: '🔄 EM ANDAMENTO',
      CONCLUIDO: '✅ PRONTO',
      ENTREGUE: '🎉 ENTREGUE',
      CANCELADO: '❌ CANCELADO'
    };
    return labels[status] || status;
  };

  const getStatusMessage = (status) => {
    const messages = {
      PENDENTE: '⏳ Aguardando início',
      EM_ANDAMENTO: '🔄 Em produção',
      CONCLUIDO: '✅ Pronto para retirada!',
      ENTREGUE: '🎉 Obrigado pela preferência!',
      CANCELADO: '❌ Pedido cancelado'
    };
    return messages[status] || '';
  };

  const getTipoServicoIcon = (tipo) => {
    return tipo === 'COSTURA' ? '✂️' : '🪡';
  };

  // Estatísticas com todos os status
  const estatisticas = {
    total: pedidos.length,
    pendentes: pedidos.filter(p => p.status === 'PENDENTE').length,
    emAndamento: pedidos.filter(p => p.status === 'EM_ANDAMENTO').length,
    prontos: pedidos.filter(p => p.status === 'CONCLUIDO').length,
    entregues: pedidos.filter(p => p.status === 'ENTREGUE').length,
    cancelados: pedidos.filter(p => p.status === 'CANCELADO').length
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 shadow-lg">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-white">📦 Consulta de Pedidos</h1>
              <p className="text-blue-100 mt-2">Acompanhe o status do seu pedido em tempo real</p>
            </div>
            <Link 
              to="/login" 
              className="bg-white text-blue-600 hover:bg-blue-50 px-6 py-2 rounded-lg font-semibold transition-colors"
            >
              🔐 Área Administrativa
            </Link>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Estatísticas */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="text-center">
              <div className="bg-blue-100 p-3 rounded-full w-12 h-12 mx-auto mb-2 flex items-center justify-center">
                <span className="text-2xl">📦</span>
              </div>
              <p className="text-gray-600 text-xs font-medium">Total</p>
              <p className="text-2xl font-bold text-blue-600">{estatisticas.total}</p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="text-center">
              <div className="bg-yellow-100 p-3 rounded-full w-12 h-12 mx-auto mb-2 flex items-center justify-center">
                <span className="text-2xl">⏳</span>
              </div>
              <p className="text-gray-600 text-xs font-medium">Pendentes</p>
              <p className="text-2xl font-bold text-yellow-600">{estatisticas.pendentes}</p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="text-center">
              <div className="bg-blue-100 p-3 rounded-full w-12 h-12 mx-auto mb-2 flex items-center justify-center">
                <span className="text-2xl">🔄</span>
              </div>
              <p className="text-gray-600 text-xs font-medium">Em Produção</p>
              <p className="text-2xl font-bold text-blue-600">{estatisticas.emAndamento}</p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="text-center">
              <div className="bg-green-100 p-3 rounded-full w-12 h-12 mx-auto mb-2 flex items-center justify-center">
                <span className="text-2xl">✅</span>
              </div>
              <p className="text-gray-600 text-xs font-medium">Prontos</p>
              <p className="text-2xl font-bold text-green-600">{estatisticas.prontos}</p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="text-center">
              <div className="bg-purple-100 p-3 rounded-full w-12 h-12 mx-auto mb-2 flex items-center justify-center">
                <span className="text-2xl">🎉</span>
              </div>
              <p className="text-gray-600 text-xs font-medium">Entregues</p>
              <p className="text-2xl font-bold text-purple-600">{estatisticas.entregues}</p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="text-center">
              <div className="bg-red-100 p-3 rounded-full w-12 h-12 mx-auto mb-2 flex items-center justify-center">
                <span className="text-2xl">❌</span>
              </div>
              <p className="text-gray-600 text-xs font-medium">Cancelados</p>
              <p className="text-2xl font-bold text-red-600">{estatisticas.cancelados}</p>
            </div>
          </div>
        </div>

        {/* Filtros */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                🔍 Buscar por cliente ou serviço
              </label>
              <input
                type="text"
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                placeholder="Digite para buscar..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                📊 Filtrar por status
              </label>
              <select
                value={filtroStatus}
                onChange={(e) => setFiltroStatus(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="TODOS">Todos os Status</option>
                <option value="PENDENTE">⏳ Pendentes</option>
                <option value="EM_ANDAMENTO">🔄 Em Andamento</option>
                <option value="CONCLUIDO">✅ Prontos para Retirar</option>
                <option value="ENTREGUE">🎉 Já Entregues</option>
                <option value="CANCELADO">❌ Cancelados</option>
              </select>
            </div>
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600 text-lg">Carregando pedidos...</p>
          </div>
        )}

        {/* Erro */}
        {erro && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg mb-8">
            {erro}
          </div>
        )}

        {/* Lista vazia */}
        {!loading && !erro && pedidosFiltrados.length === 0 && (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <span className="text-6xl mb-4 block">🔭</span>
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              Nenhum pedido encontrado
            </h3>
            <p className="text-gray-600">
              {busca || filtroStatus !== 'TODOS' 
                ? 'Tente ajustar os filtros de busca'
                : 'Não há pedidos cadastrados no momento'}
            </p>
          </div>
        )}

        {/* Lista de Pedidos */}
        {!loading && !erro && pedidosFiltrados.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pedidosFiltrados.map(pedido => (
              <div key={pedido.id} className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow">
                {/* Cabeçalho */}
                <div className="p-6 border-b border-gray-200">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center space-x-3">
                      <span className="text-3xl">{getTipoServicoIcon(pedido.tipoServico)}</span>
                      <div>
                        <h3 className="text-lg font-bold text-gray-800">
                          #{pedido.id}
                        </h3>
                        <p className="text-sm text-gray-600">{pedido.tipoServico}</p>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(pedido.status)}`}>
                      {getStatusLabel(pedido.status)}
                    </span>
                  </div>
                </div>

                {/* Informações */}
                <div className="p-6 space-y-3">
                  <div>
                    <p className="text-gray-600 text-sm">Cliente</p>
                    <p className="text-gray-800 font-bold text-lg">{pedido.clienteNome}</p>
                  </div>

                  <div>
                    <p className="text-gray-600 text-sm">Serviço</p>
                    <p className="text-gray-800">{pedido.descricaoServico}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-2 border-t">
                    <div>
                      <p className="text-gray-600 text-xs">Quantidade</p>
                      <p className="text-gray-800 font-semibold">{pedido.quantidade} un.</p>
                    </div>
                    <div>
                      <p className="text-gray-600 text-xs">Data Pedido</p>
                      <p className="text-gray-800 font-semibold">
                        {new Date(pedido.dataPedido).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                  </div>

                  {pedido.prazoEntrega && (
                    <div className="pt-2 border-t">
                      <p className="text-gray-600 text-xs">Prazo de Entrega</p>
                      <p className="text-gray-800 font-semibold">
                        {new Date(pedido.prazoEntrega).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                  )}
                </div>

                {/* Rodapé com destaque */}
                <div className={`p-4 border-t ${
                  pedido.status === 'CONCLUIDO' ? 'bg-gradient-to-r from-green-50 to-emerald-50' :
                  pedido.status === 'ENTREGUE' ? 'bg-gradient-to-r from-purple-50 to-pink-50' :
                  pedido.status === 'EM_ANDAMENTO' ? 'bg-gradient-to-r from-blue-50 to-cyan-50' :
                  pedido.status === 'PENDENTE' ? 'bg-gradient-to-r from-yellow-50 to-amber-50' :
                  pedido.status === 'CANCELADO' ? 'bg-gradient-to-r from-red-50 to-orange-50' :
                  'bg-gray-50'
                }`}>
                  <p className={`text-center font-bold text-sm ${
                    pedido.status === 'CONCLUIDO' ? 'text-green-700' :
                    pedido.status === 'ENTREGUE' ? 'text-purple-700' :
                    pedido.status === 'EM_ANDAMENTO' ? 'text-blue-700' :
                    pedido.status === 'PENDENTE' ? 'text-yellow-700' :
                    pedido.status === 'CANCELADO' ? 'text-red-700' :
                    'text-gray-700'
                  }`}>
                    {getStatusMessage(pedido.status)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Informação adicional */}
        {!loading && !erro && pedidosFiltrados.length > 0 && (
          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
            <p className="text-blue-800 font-medium">
              💡 <strong>Dica:</strong> Use a busca acima para encontrar seu pedido pelo seu nome
            </p>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-white text-center py-6 mt-12">
        <p>© 2025 Sistema de Gestão de Pedidos</p>
        <p className="text-sm text-gray-400 mt-1">Consulta Pública de Pedidos</p>
      </footer>
    </div>
  );
}