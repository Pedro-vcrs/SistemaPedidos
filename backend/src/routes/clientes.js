const express = require('express');
const router = express.Router();
const { Cliente } = require('../models');

router.get('/', async (req, res) => {
  const lista = await Cliente.findAll();
  res.json(lista);
});

router.get('/:id', async (req, res) => {
  const cliente = await Cliente.findByPk(req.params.id);
  if (!cliente) return res.status(404).json({ error: 'Cliente não encontrado' });
  res.json(cliente);
});

router.post('/', async (req, res) => {
  const { nome, telefone, email, endereco } = req.body;
  if (!nome) return res.status(400).json({ error: 'Nome é obrigatório' });
  const novo = await Cliente.create({ nome, telefone, email, endereco });
  res.json(novo);
});

router.put('/:id', async (req, res) => {
  const cliente = await Cliente.findByPk(req.params.id);
  if (!cliente) return res.status(404).json({ error: 'Cliente não encontrado' });
  await cliente.update(req.body);
  res.json(cliente);
});

router.delete('/:id', async (req, res) => {
  const cliente = await Cliente.findByPk(req.params.id);
  if (!cliente) return res.status(404).json({ error: 'Cliente não encontrado' });
  await cliente.destroy();
  res.json({ ok: true });
});

module.exports = router;
