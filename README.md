# 📦 Sistema de Gestão de Pedidos

Sistema completo para gerenciamento de pedidos de costura e bordado.

## 🚀 Tecnologias

**Backend:**
- Node.js + Express
- Sequelize ORM
- PostgreSQL
- JWT Authentication

**Frontend:**
- React + Vite
- Tailwind CSS
- Axios

## 📋 Pré-requisitos

- Node.js 18+
- PostgreSQL (produção) ou SQLite (desenvolvimento)

## 🔧 Instalação

### Backend
```bash
cd backend
npm install
cp .env.example .env
# Configure as variáveis no .env
npm run dev
```

### Frontend
```bash
cd frontend
npm install
cp .env.example .env
# Configure VITE_API_URL no .env
npm run dev
```

## 🗄️ Banco de Dados
```bash
cd backend
node seed.js
```

## 🔐 Credenciais Padrão (desenvolvimento)

**Admin:**
- Email: admin@sistema.com
- Senha: admin123

**Usuário:**
- Email: operador@sistema.com
- Senha: operador123

⚠️ **IMPORTANTE:** Troque as senhas em produção!

## 🌐 Deploy

### Backend (Railway)
1. Conecte o repositório no Railway
2. Configure as variáveis de ambiente
3. Deploy automático

### Frontend (Vercel)
1. Conecte o repositório no Vercel
2. Configure `VITE_API_URL`
3. Deploy automático

## 📄 Licença

MIT