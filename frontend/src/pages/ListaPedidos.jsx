import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { pedidosAPI } from '../services/api';

export default function ListaPedidos() {
  const navigate = useNavigate();
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filtro, setFiltro] = useState('');
  const [statusFiltro, setStatusFiltro] = useState('TODOS');

  useEffect(() => {
    carregarPedidos();
  }, []);

  const carregarPedidos = async () => {
    try {
      setLoading(true);
      const response = await pedidosAPI.listar();
      setPedidos(response.data);
      setError(null);
    } catch (err) {
      setError('Erro ao carregar pedidos');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const deletarPedido = async (id) => {
    if (!confirm('Tem certeza que deseja excluir este pedido?')) return;

    try {
      await pedidosAPI.deletar(id);
      setPedidos(pedidos.filter(p => p.id !== id));
    } catch (err) {
      alert('Erro ao excluir pedido');
      console.error(err);
    }
  };

  const atualizarStatus = async (id, novoStatus) => {
    try {
      await pedidosAPI.atualizarStatus(id, novoStatus);
      setPedidos(pedidos.map(p => 
        p.id === id ? { ...p, status: novoStatus } : p
      ));
    } catch (err) {
      alert('Erro ao atualizar status');
      console.error(err);
    }
  };

  // NOVO: Função específica para marcar como entregue
  const marcarComoEntregue = async (id) => {
    await atualizarStatus(id, 'ENTREGUE');
  };

  const baixarCSV = async () => {
    try {
      const response = await pedidosAPI.gerarCSV();
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `pedidos_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      alert('Erro ao gerar relatório');
      console.error(err);
    }
  };

  const pedidosFiltrados = pedidos.filter(p => {
    const textoFiltro = filtro.toLowerCase();
    const matchTexto = 
      p.Cliente?.nome.toLowerCase().includes(textoFiltro) ||
      p.descricaoServico.toLowerCase().includes(textoFiltro);
    
    const matchStatus = statusFiltro === 'TODOS' || p.status === statusFiltro;
    
    return matchTexto && matchStatus;
  });

  const getStatusColor = (status) => {
    const cores = {
      PENDENTE: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      EM_ANDAMENTO: 'bg-blue-100 text-blue-800 border-blue-300',
      CONCLUIDO: 'bg-green-100 text-green-800 border-green-300',
      ENTREGUE: 'bg-purple-100 text-purple-800 border-purple-300'
    };
    return cores[status] || 'bg-gray-100 text-gray-800 border-gray-300';
  };

  const getPrioridadeIcon = (prioridade) => {
    const icones = {
      BAIXA: '🟢',
      MEDIA: '🟡',
      ALTA: '🔴'
    };
    return icones[prioridade] || '⚪';
  };

  // NOVO: Badge para tipo de serviço
  const getTipoServicoIcon = (tipo) => {
    return tipo === 'COSTURA' ? '✂️' : '🪡';
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando pedidos...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Cabeçalho */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">📋 Lista de Pedidos</h1>
        <p className="text-gray-600">
          Total de {pedidosFiltrados.length} pedido(s) {filtro && `encontrado(s) para "${filtro}"`}
        </p>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              🔍 Buscar por cliente ou serviço
            </label>
            <input
              type="text"
              value={filtro}
              onChange={(e) => setFiltro(e.target.value)}
              placeholder="Digite para buscar..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              📊 Filtrar por status
            </label>
            <select
              value={statusFiltro}
              onChange={(e) => setStatusFiltro(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="TODOS">Todos</option>
              <option value="PENDENTE">Pendente</option>
              <option value="EM_ANDAMENTO">Em Andamento</option>
              <option value="CONCLUIDO">Concluído</option>
              <option value="ENTREGUE">Entregue</option>
            </select>
          </div>
        </div>

        <div className="mt-4">
          <button
            onClick={baixarCSV}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            📥 Exportar CSV
          </button>
        </div>
      </div>

      {/* Lista de Pedidos */}
      {pedidosFiltrados.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <p className="text-gray-500 text-lg">Nenhum pedido encontrado</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {pedidosFiltrados.map(pedido => (
            <div key={pedido.id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
              {/* Cabeçalho do Card */}
              <div className="p-4 border-b border-gray-200">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center space-x-2">
                    <h3 className="text-lg font-bold text-gray-800">
                      #{pedido.id} - {pedido.Cliente?.nome || 'Cliente não informado'}
                    </h3>
                    {/* NOVO: Badge tipo de serviço */}
                    <span className="text-xl" title={pedido.tipoServico}>
                      {getTipoServicoIcon(pedido.tipoServico)}
                    </span>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(pedido.status)}`}>
                    {pedido.status.replace('_', ' ')}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <p className="text-gray-600">{pedido.descricaoServico}</p>
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl">{getPrioridadeIcon(pedido.prioridade)}</span>
                    <span className="text-xl font-bold text-blue-600">
                      R$ {pedido.total}
                    </span>
                  </div>
                </div>
              </div>

              {/* Informações do Pedido */}
              <div className="p-4 bg-gray-50 space-y-2 text-sm">
                <div className="grid grid-cols-2 gap-2">
                  <p className="text-gray-600">
                    📅 <strong>Pedido:</strong> {new Date(pedido.dataPedido).toLocaleDateString('pt-BR')}
                  </p>
                  <p className="text-gray-600">
                    ⏰ <strong>Prazo:</strong> {pedido.prazoEntrega ? new Date(pedido.prazoEntrega).toLocaleDateString('pt-BR') : 'Não definido'}
                  </p>
                </div>

                {/* NOVO: Adicionar quantidade */}
                <div className="grid grid-cols-2 gap-2">
                  <p className="text-gray-600">
                    📦 <strong>Quantidade:</strong> {pedido.quantidade} un.
                  </p>
                  <p className="text-gray-600">
                    💰 <strong>Preço Unit.:</strong> R$ {parseFloat(pedido.precoUnitario).toFixed(2)}
                  </p>
                </div>

                {pedido.Cliente?.email && (
                  <p className="text-gray-600">
                    📧 {pedido.Cliente.email}
                  </p>
                )}
                {pedido.Cliente?.telefone && (
                  <p className="text-gray-600">
                    📞 {pedido.Cliente.telefone}
                  </p>
                )}

                {pedido.observacoes && (
                  <div className="mt-2 pt-2 border-t border-gray-200">
                    <p className="text-gray-600">
                      💬 <strong>Obs:</strong> {pedido.observacoes}
                    </p>
                  </div>
                )}
              </div>

              {/* Ações */}
              <div className="p-4 border-t border-gray-200 flex flex-wrap gap-2">
                {/* Dropdown Status */}
                <select
                  value={pedido.status}
                  onChange={(e) => atualizarStatus(pedido.id, e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="PENDENTE">Pendente</option>
                  <option value="EM_ANDAMENTO">Em Andamento</option>
                  <option value="CONCLUIDO">Concluído</option>
                  <option value="ENTREGUE">Entregue</option>
                </select>

                {/* NOVO: Botão Verde "Entregue" */}
                {pedido.status !== 'ENTREGUE' && (
                  <button
                    onClick={() => marcarComoEntregue(pedido.id)}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
                  >
                    ✓ Entregue
                  </button>
                )}

                <div className="flex-1"></div>

                <button
                  onClick={() => navigate(`/editar/${pedido.id}`)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm transition-colors"
                >
                  ✏️ Editar
                </button>

                <button
                  onClick={() => deletarPedido(pedido.id)}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm transition-colors"
                >
                  🗑️ Excluir
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}