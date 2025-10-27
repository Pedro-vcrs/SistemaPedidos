require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');

const { sequelize } = require('./models');
const { verificarToken } = require('./middleware/auth');

const authRouter = require('./routes/auth');
const clientesRouter = require('./routes/clientes');
const pedidosRouter = require('./routes/pedidos');

const app = express();

// Segurança
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(bodyParser.json());

// ========== ROTAS PÚBLICAS ==========
app.use('/api/auth', authRouter);

// Rotas públicas de pedidos (SEM verificarToken)
const { Pedido, Cliente } = require('./models');
const { Op } = require('sequelize');

app.get('/api/pedidos/publico/listar', async (req, res) => {
  try {
    const pedidos = await Pedido.findAll({
      include: [{
        model: Cliente,
        required: true
      }],
      // ✅ REMOVIDO O FILTRO DE STATUS - agora mostra TODOS
      order: [
        ['status', 'ASC'],
        ['createdAt', 'DESC']
      ]
    });

    const pedidosPublicos = pedidos.map(p => ({
      id: p.id,
      descricaoServico: p.descricaoServico,
      tipoServico: p.tipoServico,
      quantidade: p.quantidade,
      status: p.status,
      dataPedido: p.dataPedido,
      prazoEntrega: p.prazoEntrega,
      dataEntrega: p.dataEntrega,
      clienteNome: p.Cliente.nome
    }));

    res.json(pedidosPublicos);
  } catch (error) {
    console.error('Erro na listagem pública:', error);
    res.status(500).json({ error: 'Erro ao buscar pedidos' });
  }
});

// ========== ROTAS PROTEGIDAS ==========
app.use('/api/clientes', verificarToken, clientesRouter);
app.use('/api/pedidos', verificarToken, pedidosRouter);

const PORT = process.env.PORT || 3000;

sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Backend rodando em http://localhost:${PORT}`);
    console.log(`✅ Rota pública: http://localhost:${PORT}/api/pedidos/publico/listar`);
  });
}).catch(err => console.error('❌ Erro ao sincronizar DB:', err));