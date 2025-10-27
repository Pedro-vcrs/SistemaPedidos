import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Interceptor para adicionar token em todas as requisições
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// Interceptor para tratamento de erros
api.interceptors.response.use(
  response => response,
  error => {
    // Se token inválido/expirado, redireciona para login
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('usuario');
      window.location.href = '/login';
    }
    
    const errorMessage = error.response?.data?.error || error.message || 'Erro desconhecido';
    console.error('Erro na requisição:', errorMessage);
    return Promise.reject(error);
  }
);

// ========== CLIENTES ==========
export const clientesAPI = {
  listar: () => api.get('/clientes'),
  buscar: (id) => api.get(`/clientes/${id}`),
  criar: (dados) => api.post('/clientes', dados),
  atualizar: (id, dados) => api.put(`/clientes/${id}`, dados),
  deletar: (id) => api.delete(`/clientes/${id}`),
};

// ========== PEDIDOS ==========
export const pedidosAPI = {
  listar: () => api.get('/pedidos'),
  buscar: (id) => api.get(`/pedidos/${id}`),
  criar: (dados) => api.post('/pedidos', dados),
  atualizar: (id, dados) => api.put(`/pedidos/${id}`, dados),
  deletar: (id) => api.delete(`/pedidos/${id}`),
  atualizarStatus: (id, status) => api.patch(`/pedidos/${id}/status`, { status }),
  gerarCSV: () => api.get('/pedidos/relatorio/csv', { responseType: 'blob' }),
};

export default api;