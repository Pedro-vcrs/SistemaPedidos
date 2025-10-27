import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { pedidosAPI } from '../services/api';

export default function FormPedido() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdicao = !!id;

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    clienteNome: '',
    telefoneCliente: '',  // ❌ ERRO: estava "telefoneCLiente" com L maiúsculo
    tipoServico: 'COSTURA',
    descricaoServico: '',
    quantidade: 1,
    precoUnitario: '',
    prazoEntrega: '',
    dataEntrega: '',  // ❌ FALTAVA este campo
    observacoes: '',
    prioridade: 'MEDIA',
    status: 'PENDENTE'
  });

  useEffect(() => {
    if (isEdicao) {
      carregarPedido();
    }
  }, [id]);

  const carregarPedido = async () => {
    try {
      const response = await pedidosAPI.buscar(id);
      const pedido = response.data;
      setFormData({
        clienteNome: pedido.Cliente?.nome || '',
        telefoneCliente: pedido.telefoneCliente || '',  // ✅ Corrigido
        tipoServico: pedido.tipoServico || 'COSTURA',
        descricaoServico: pedido.descricaoServico,
        quantidade: pedido.quantidade,
        precoUnitario: pedido.precoUnitario,
        prazoEntrega: pedido.prazoEntrega || '',
        dataEntrega: pedido.dataEntrega || '',  // ✅ Adicionado
        observacoes: pedido.observacoes || '',
        prioridade: pedido.prioridade,
        status: pedido.status
      });
    } catch (err) {
      alert('Erro ao carregar pedido');
      navigate('/');
    }
  };

  const validarForm = () => {
    const novosErros = {};

    if (!formData.clienteNome || formData.clienteNome.trim().length < 3) {
      novosErros.clienteNome = 'Nome do cliente deve ter pelo menos 3 caracteres';
    }

    // ✅ Telefone é OPCIONAL - não validar se vazio
    if (formData.telefoneCliente && formData.telefoneCliente.replace(/\D/g, '').length < 10) {
      novosErros.telefoneCliente = 'Telefone deve ter pelo menos 10 dígitos';
    }

    if (!formData.tipoServico) {
      novosErros.tipoServico = 'Selecione o tipo de serviço';
    }

    if (!formData.descricaoServico.trim()) {
      novosErros.descricaoServico = 'Descrição é obrigatória';
    }

    if (formData.quantidade <= 0) {
      novosErros.quantidade = 'Quantidade deve ser maior que 0';
    }

    if (!formData.precoUnitario || parseFloat(formData.precoUnitario) <= 0) {
      novosErros.precoUnitario = 'Preço deve ser maior que 0';
    }

    if (!formData.prazoEntrega) {
      novosErros.prazoEntrega = 'Prazo de entrega é obrigatório';
    }

    setErrors(novosErros);
    return Object.keys(novosErros).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validarForm()) {
      return;
    }

    setLoading(true);

    try {
      if (isEdicao) {
        await pedidosAPI.atualizar(id, formData);
      } else {
        await pedidosAPI.criar(formData);
      }
      navigate('/');
    } catch (err) {
      alert('Erro ao salvar pedido');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    if (errors[name]) {
      setErrors({ ...errors, [name]: null });
    }
  };

  const calcularTotal = () => {
    const qtd = parseInt(formData.quantidade) || 0;
    const preco = parseFloat(formData.precoUnitario) || 0;
    return (qtd * preco).toFixed(2);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          {isEdicao ? '✏️ Editar Pedido' : '➕ Novo Pedido'}
        </h1>
        <p className="text-gray-600">
          {isEdicao ? 'Atualize as informações do pedido' : 'Preencha os dados do novo pedido'}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm p-6">
            
            {/* Nome do Cliente */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                👤 Nome do Cliente *
              </label>
              <input
                type="text"
                name="clienteNome"
                value={formData.clienteNome}
                onChange={handleChange}
                placeholder="Digite o nome do cliente"
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.clienteNome ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.clienteNome && (
                <p className="text-red-500 text-sm mt-1">{errors.clienteNome}</p>
              )}
              <p className="text-gray-500 text-xs mt-1">
                💡 Se o cliente já existe, será vinculado automaticamente
              </p>
            </div>

            {/* Telefone do Cliente */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                📞 Telefone do Cliente
              </label>
              <input
                type="tel"
                name="telefoneCliente"  // ✅ Nome correto
                value={formData.telefoneCliente}
                onChange={handleChange}
                placeholder="(41) 99999-9999"
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.telefoneCliente ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.telefoneCliente && (
                <p className="text-red-500 text-sm mt-1">{errors.telefoneCliente}</p>
              )}
              <p className="text-gray-500 text-xs mt-1">
                📱 Opcional - para contato sobre o pedido
              </p>
            </div>

            {/* Tipo de Serviço */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                🔧 Tipo de Serviço *
              </label>
              <div className="grid grid-cols-2 gap-4">
                <label className={`flex items-center justify-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  formData.tipoServico === 'COSTURA' 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-300 hover:border-blue-300'
                }`}>
                  <input
                    type="radio"
                    name="tipoServico"
                    value="COSTURA"
                    checked={formData.tipoServico === 'COSTURA'}
                    onChange={handleChange}
                    className="mr-3"
                  />
                  <span className="text-2xl mr-2">✂️</span>
                  <span className="font-semibold">Costura</span>
                </label>

                <label className={`flex items-center justify-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  formData.tipoServico === 'BORDADO' 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-300 hover:border-blue-300'
                }`}>
                  <input
                    type="radio"
                    name="tipoServico"
                    value="BORDADO"
                    checked={formData.tipoServico === 'BORDADO'}
                    onChange={handleChange}
                    className="mr-3"
                  />
                  <span className="text-2xl mr-2">🪡</span>
                  <span className="font-semibold">Bordado</span>
                </label>
              </div>
              {errors.tipoServico && (
                <p className="text-red-500 text-sm mt-1">{errors.tipoServico}</p>
              )}
            </div>

            {/* Descrição do Serviço */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                📝 Descrição do Serviço *
              </label>
              <textarea
                name="descricaoServico"
                value={formData.descricaoServico}
                onChange={handleChange}
                rows="3"
                placeholder="Ex: Costura de vestido de festa, Bordado de logo em camisetas..."
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.descricaoServico ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.descricaoServico && (
                <p className="text-red-500 text-sm mt-1">{errors.descricaoServico}</p>
              )}
            </div>

            {/* Quantidade, Preço e Total */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  📊 Quantidade *
                </label>
                <input
                  type="number"
                  name="quantidade"
                  value={formData.quantidade}
                  onChange={handleChange}
                  min="1"
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.quantidade ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.quantidade && (
                  <p className="text-red-500 text-sm mt-1">{errors.quantidade}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  💰 Preço Unitário *
                </label>
                <input
                  type="number"
                  name="precoUnitario"
                  value={formData.precoUnitario}
                  onChange={handleChange}
                  step="0.01"
                  min="0.01"
                  placeholder="0.00"
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.precoUnitario ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.precoUnitario && (
                  <p className="text-red-500 text-sm mt-1">{errors.precoUnitario}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  💵 Total
                </label>
                <div className="w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-lg font-bold text-blue-600 text-lg">
                  R$ {calcularTotal()}
                </div>
              </div>
            </div>

            {/* Prazo e Data de Entrega */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  📅 Prazo de Entrega *
                </label>
                <input
                  type="date"
                  name="prazoEntrega"
                  value={formData.prazoEntrega}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.prazoEntrega ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.prazoEntrega && (
                  <p className="text-red-500 text-sm mt-1">{errors.prazoEntrega}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ✅ Data de Entrega Real
                </label>
                <input
                  type="date"
                  name="dataEntrega"
                  value={formData.dataEntrega}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <p className="text-gray-500 text-xs mt-1">
                  📆 Quando foi/será entregue ao cliente
                </p>
              </div>
            </div>

            {/* Prioridade e Status */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  🎯 Prioridade
                </label>
                <select
                  name="prioridade"
                  value={formData.prioridade}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="BAIXA">🟢 Baixa</option>
                  <option value="MEDIA">🟡 Média</option>
                  <option value="ALTA">🔴 Alta</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  📊 Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="PENDENTE">Pendente</option>
                  <option value="EM_ANDAMENTO">Em Andamento</option>
                  <option value="CONCLUIDO">Concluído</option>
                  <option value="ENTREGUE">Entregue</option>
                </select>
              </div>
            </div>

            {/* Observações */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                💬 Observações
              </label>
              <textarea
                name="observacoes"
                value={formData.observacoes}
                onChange={handleChange}
                rows="3"
                placeholder="Observações adicionais sobre o pedido..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Botões */}
            <div className="flex gap-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Salvando...' : (isEdicao ? '💾 Atualizar Pedido' : '💾 Criar Pedido')}
              </button>

              <button
                type="button"
                onClick={() => navigate('/')}
                className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-3 px-6 rounded-lg transition-colors"
              >
                ❌ Cancelar
              </button>
            </div>
          </form>
        </div>

        {/* Resumo do Pedido */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm p-6 sticky top-4">
            <h3 className="text-xl font-bold text-gray-800 mb-4">📋 Resumo do Pedido</h3>
            
            <div className="space-y-3 text-sm">
              <div>
                <p className="text-gray-600 font-medium">Cliente</p>
                <p className="text-gray-800">
                  {formData.clienteNome || 'Não informado'}
                </p>
                {formData.telefoneCliente && (
                  <p className="text-gray-600 text-xs mt-1">
                    📞 {formData.telefoneCliente}
                  </p>
                )}
              </div>

              <div>
                <p className="text-gray-600 font-medium">Tipo de Serviço</p>
                <p className="text-gray-800">
                  {formData.tipoServico === 'COSTURA' ? '✂️ Costura' : '🪡 Bordado'}
                </p>
              </div>

              <div>
                <p className="text-gray-600 font-medium">Serviço</p>
                <p className="text-gray-800">
                  {formData.descricaoServico || 'Não informado'}
                </p>
              </div>

              <div>
                <p className="text-gray-600 font-medium">Quantidade</p>
                <p className="text-gray-800">{formData.quantidade} un.</p>
              </div>

              <div>
                <p className="text-gray-600 font-medium">Valor Total</p>
                <p className="text-2xl font-bold text-blue-600">R$ {calcularTotal()}</p>
              </div>

              <div>
                <p className="text-gray-600 font-medium">Prioridade</p>
                <p className="text-gray-800">
                  {formData.prioridade === 'BAIXA' && '🟢 Baixa'}
                  {formData.prioridade === 'MEDIA' && '🟡 Média'}
                  {formData.prioridade === 'ALTA' && '🔴 Alta'}
                </p>
              </div>

              <div>
                <p className="text-gray-600 font-medium">Prazo de Entrega</p>
                <p className="text-gray-800">
                  {formData.prazoEntrega 
                    ? new Date(formData.prazoEntrega + 'T00:00:00').toLocaleDateString('pt-BR')
                    : 'Não definido'}
                </p>
              </div>

              {formData.dataEntrega && (
                <div>
                  <p className="text-gray-600 font-medium">Data de Entrega</p>
                  <p className="text-green-600 font-semibold">
                    ✅ {new Date(formData.dataEntrega + 'T00:00:00').toLocaleDateString('pt-BR')}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}