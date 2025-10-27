const express = require('express');
const router = express.Router();
const { Pedido, Cliente } = require('../models');
const { Parser } = require('json2csv');
const { Op } = require('sequelize');

// ========== ROTA PÚBLICA (SEM AUTENTICAÇÃO) ==========
// Listar TODOS os pedidos CONCLUÍDOS ou ENTREGUES
router.get('/publico/listar', async (req, res) => {
  try {
    const pedidos = await Pedido.findAll({
      include: [{
        model: Cliente,
        required: true
      }],
      where: {
        status: {
          [Op.in]: ['CONCLUIDO', 'ENTREGUE']
        }
      },
      order: [
        ['status', 'ASC'],
        ['createdAt', 'DESC']
      ]
    });

    // Remover informações sensíveis e formatar
    const pedidosPublicos = pedidos.map(p => ({
      id: p.id,
      descricaoServico: p.descricaoServico,
      tipoServico: p.tipoServico,
      quantidade: p.quantidade,
      status: p.status,
      dataPedido: p.dataPedido,
      prazoEntrega: p.prazoEntrega,
      clienteNome: p.Cliente.nome
    }));

    res.json(pedidosPublicos);
  } catch (error) {
    console.error('Erro na listagem pública:', error);
    res.status(500).json({ error: 'Erro ao buscar pedidos' });
  }
});

// Buscar por nome (mantida para compatibilidade)
router.get('/publico/buscar', async (req, res) => {
  try {
    const { nome } = req.query;

    if (!nome || nome.trim().length < 3) {
      return res.status(400).json({
        error: 'Digite pelo menos 3 caracteres do nome'
      });
    }

    const pedidos = await Pedido.findAll({
      include: [{
        model: Cliente,
        where: {
          nome: {
            [Op.like]: `%${nome}%`
          }
        },
        required: true
      }],
      where: {
        status: {
          type: DataTypes.ENUM('PENDENTE', 'EM_ANDAMENTO', 'CONCLUIDO', 'ENTREGUE', 'CANCELADO'),
          defaultValue: 'PENDENTE'
        }
      },
      order: [['createdAt', 'DESC']]
    });

    const pedidosPublicos = pedidos.map(p => ({
      id: p.id,
      descricaoServico: p.descricaoServico,
      tipoServico: p.tipoServico,
      quantidade: p.quantidade,
      status: p.status,
      dataPedido: p.dataPedido,
      prazoEntrega: p.prazoEntrega,
      clienteNome: p.Cliente.nome
    }));

    res.json(pedidosPublicos);
  } catch (error) {
    console.error('Erro na busca pública:', error);
    res.status(500).json({ error: 'Erro ao buscar pedidos' });
  }
});

// ========== ROTAS PROTEGIDAS (COM AUTENTICAÇÃO) ==========
// listar todos (com cliente)
router.get('/', async (req, res) => {
  const lista = await Pedido.findAll({ include: Cliente, order: [['createdAt', 'DESC']] });
  res.json(lista);
});

router.get('/:id', async (req, res) => {
  const p = await Pedido.findByPk(req.params.id, { include: Cliente });
  if (!p) return res.status(404).json({ error: 'Pedido não encontrado' });
  res.json(p);
});

router.post('/', async (req, res) => {
  try {
    const {
      clienteNome,
      telefoneCliente, 
      tipoServico,
      descricaoServico,
      quantidade,
      precoUnitario,
      prazoEntrega,
      dataEntrega, 
      observacoes,
      prioridade
    } = req.body;

    // Validações
    if (!clienteNome || !descricaoServico) {
      return res.status(400).json({
        error: 'Nome do cliente e descrição são obrigatórios'
      });
    }

    if (tipoServico && !['COSTURA', 'BORDADO'].includes(tipoServico)) {
      return res.status(400).json({
        error: 'Tipo de serviço deve ser COSTURA ou BORDADO'
      });
    }

    // Buscar ou criar cliente
    let cliente = await Cliente.findOne({
      where: { nome: clienteNome.trim() }
    });

    if (!cliente) {
      cliente = await Cliente.create({
        nome: clienteNome.trim(),
        telefone: telefoneCliente || '00000000000',  
        email: null
      });
    }

    // Criar pedido
    const novo = await Pedido.create({
      clienteId: cliente.id,
      telefoneCliente: telefoneCliente || null,  
      tipoServico: tipoServico || 'COSTURA',
      descricaoServico,
      quantidade: quantidade || 1,
      precoUnitario: precoUnitario || 0,
      prazoEntrega,
      dataEntrega: dataEntrega || null, 
      observacoes,
      prioridade: prioridade || 'MEDIA'
    });

    // Retornar com dados do cliente
    const pedidoCompleto = await Pedido.findByPk(novo.id, { include: Cliente });
    res.json(pedidoCompleto);
  } catch (error) {
    console.error('Erro ao criar pedido:', error);
    res.status(500).json({ error: 'Erro ao criar pedido' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const p = await Pedido.findByPk(req.params.id);
    if (!p) return res.status(404).json({ error: 'Pedido não encontrado' });

    const { clienteNome, telefoneCliente, ...outrosDados } = req.body;

    // Se mudou o nome do cliente
    if (clienteNome) {
      let cliente = await Cliente.findOne({
        where: { nome: clienteNome.trim() }
      });

      if (!cliente) {
        cliente = await Cliente.create({
          nome: clienteNome.trim(),
          telefone: telefoneCliente || '00000000000',
          email: null
        });
      } else if (telefoneCliente) {
        // Atualizar telefone do cliente se fornecido
        await cliente.update({ telefone: telefoneCliente });
      }

      outrosDados.clienteId = cliente.id;
    }

    // Adicionar telefoneCliente aos dados a atualizar
    if (telefoneCliente) {
      outrosDados.telefoneCliente = telefoneCliente;
    }

    await p.update(outrosDados);
    const atualizado = await Pedido.findByPk(p.id, { include: Cliente });
    res.json(atualizado);
  } catch (error) {
    console.error('Erro ao atualizar pedido:', error);
    res.status(500).json({ error: 'Erro ao atualizar pedido' });
  }
});

router.delete('/:id', async (req, res) => {
  const p = await Pedido.findByPk(req.params.id);
  if (!p) return res.status(404).json({ error: 'Pedido não encontrado' });
  await p.destroy();
  res.json({ ok: true });
});

// atualizar status
router.patch('/:id/status', async (req, res) => {
  const { status } = req.body;
  const p = await Pedido.findByPk(req.params.id);
  if (!p) return res.status(404).json({ error: 'Pedido não encontrado' });
  await p.update({ status });
  res.json(p);
});

// relatório CSV
router.get('/relatorio/csv', async (req, res) => {
  const pedidos = await Pedido.findAll({ include: Cliente });
  const data = pedidos.map(p => ({
    id: p.id,
    cliente: p.Cliente ? p.Cliente.nome : '',
    descricaoServico: p.descricaoServico,
    quantidade: p.quantidade,
    precoUnitario: p.precoUnitario,
    total: (p.quantidade * parseFloat(p.precoUnitario)).toFixed(2),
    status: p.status,
    prazoEntrega: p.prazoEntrega
  }));
  const fields = ['id', 'cliente', 'descricaoServico', 'quantidade', 'precoUnitario', 'total', 'status', 'prazoEntrega'];
  const parser = new Parser({ fields });
  const csv = parser.parse(data);
  res.header('Content-Type', 'text/csv');
  res.attachment('relatorio_pedidos.csv');
  res.send(csv);
});

module.exports = router;