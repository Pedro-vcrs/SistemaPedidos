const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const rateLimit = require('express-rate-limit');
const { Usuario } = require('../models');
const { gerarToken } = require('../middleware/auth');

// Rate limiter para login
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 5, 
  message: { error: 'Muitas tentativas de login. Tente novamente em 15 minutos.' }
});

// Login
router.post('/login', loginLimiter, async (req, res) => {
  try {
    const { email, senha } = req.body;

    if (!email || !senha) {
      return res.status(400).json({ error: 'Email e senha são obrigatórios' });
    }

    const usuario = await Usuario.scope('withPassword').findOne({ where: { email } });

    if (!usuario || !usuario.ativo) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    const senhaValida = await bcrypt.compare(senha, usuario.senha);

    if (!senhaValida) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    const token = gerarToken(usuario);

    res.json({
      token,
      usuario: {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        role: usuario.role
      }
    });
  } catch (error) {
    console.error('Erro no login:', error);
    res.status(500).json({ error: 'Erro ao fazer login' });
  }
});

// Registrar primeiro admin (remover após criar)
router.post('/registrar-admin', async (req, res) => {
  const SENHA_MESTRA = process.env.ADMIN_MASTER_KEY;
  
  if (!SENHA_MESTRA) {
    return res.status(500).json({ error: 'Configuração inválida' });
  }
  
  if (req.body.masterKey !== SENHA_MESTRA) {
    return res.status(403).json({ error: 'Chave mestra inválida' });
  }

  try {
    const { nome, email, senha } = req.body;

    // Verificar se já existe admin
    const adminExistente = await Usuario.findOne({ where: { role: 'ADMIN' } });
    if (adminExistente) {
      return res.status(400).json({ error: 'Já existe um administrador cadastrado' });
    }

    const senhaHash = await bcrypt.hash(senha, 10);

    const usuario = await Usuario.create({
      nome,
      email,
      senha: senhaHash,
      role: 'ADMIN'
    });

    res.json({ message: 'Administrador criado com sucesso', usuario: { id: usuario.id, nome: usuario.nome, email: usuario.email } });
  } catch (error) {
    console.error('Erro ao registrar admin:', error);
    res.status(500).json({ error: 'Erro ao criar administrador' });
  }
});

module.exports = router;