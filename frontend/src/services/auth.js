import api from './api';

export const authAPI = {
  login: async (email, senha) => {
    console.log('AuthAPI: Fazendo login com', { email, senha: '***' }); // Debug
    const response = await api.post('/auth/login', { email, senha });
    console.log('AuthAPI: Resposta recebida', response.data); // Debug
    
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('usuario', JSON.stringify(response.data.usuario));
    
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
  },

  getToken: () => localStorage.getItem('token'),

  getUsuario: () => {
    const usuario = localStorage.getItem('usuario');
    return usuario ? JSON.parse(usuario) : null;
  },

  isAutenticado: () => !!authAPI.getToken(),

  isAdmin: () => {
    const usuario = authAPI.getUsuario();
    return usuario?.role === 'ADMIN';
  }
};