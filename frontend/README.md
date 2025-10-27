# Sistema de Gestão de Pedidos - Backend

## Requisitos
- Node.js 18+
- npm

## Como executar (desenvolvimento)
1. cd backend
2. npm install
3. npm run seed        # zera e popula o DB com dados de exemplo
4. npm run dev         # inicia servidor em http://localhost:3000

## Endpoints principais
- GET /api/clientes
- POST /api/clientes
- GET /api/pedidos
- POST /api/pedidos
- PATCH /api/pedidos/:id/status
- GET /api/pedidos/relatorio/csv

