require('dotenv').config();
const { sequelize, Cliente, Pedido, Usuario } = require('./models');

async function seed() {
  try {
    console.log('🔄 Sincronizando banco de dados...');
    
    await sequelize.sync({ force: true });
    
    console.log('✅ Banco sincronizado!\n');

    // 1. Criar usuário admin
    console.log('👤 Criando usuário admin...');
    await Usuario.create({
      nome: 'Administrador',
      email: 'admin@sistema.com',
      senha: 'admin123',
      role: 'ADMIN'
    });
    console.log('✅ Admin criado!\n');

    // 2. Criar usuário comum
    console.log('👤 Criando usuário comum...');
    await Usuario.create({
      nome: 'Operador',
      email: 'operador@sistema.com',
      senha: 'operador123',
      role: 'USER'
    });
    console.log('✅ Usuário criado!\n');

    // 3. Criar clientes
    console.log('👥 Criando clientes...');
    const cliente1 = await Cliente.create({
      nome: 'Ateliê Bom Fio',
      telefone: '41999990000',
      email: 'contato@bomfio.com'
    });

    const cliente2 = await Cliente.create({
      nome: 'Moda & Cia',
      telefone: '41988880000',
      email: 'vendas@modaecia.com'
    });

    const cliente3 = await Cliente.create({
      nome: 'Maria Silva',
      telefone: '41977770000',
      email: 'maria.silva@email.com'
    });

    const cliente4 = await Cliente.create({
      nome: 'João Souza',
      telefone: '41966660000',
      email: 'joao.souza@email.com'
    });

    console.log(`✅ ${await Cliente.count()} clientes criados\n`);

    // 4. Criar pedidos
    console.log('📦 Criando pedidos...');
    
    await Pedido.create({
      clienteId: cliente1.id,
      telefoneCliente: '41999990000',
      tipoServico: 'BORDADO',
      descricaoServico: 'Bordado de logo em 20 camisetas',
      quantidade: 20,
      precoUnitario: 15.00,
      status: 'EM_ANDAMENTO',
      dataPedido: new Date('2025-10-20'),
      prazoEntrega: new Date('2025-10-30'),
      observacoes: 'Logo deve ter 10cm de largura',
      prioridade: 'ALTA'
    });

    await Pedido.create({
      clienteId: cliente2.id,
      telefoneCliente: '41988880000',
      tipoServico: 'COSTURA',
      descricaoServico: 'Ajuste de 10 calças jeans',
      quantidade: 10,
      precoUnitario: 25.00,
      status: 'PENDENTE',
      dataPedido: new Date('2025-10-22'),
      prazoEntrega: new Date('2025-11-05'),
      observacoes: 'Cliente pediu urgência',
      prioridade: 'MEDIA'
    });

    await Pedido.create({
      clienteId: cliente3.id,
      telefoneCliente: '41977770000',
      tipoServico: 'COSTURA',
      descricaoServico: 'Costura de vestido de festa',
      quantidade: 1,
      precoUnitario: 350.00,
      status: 'CONCLUIDO',
      dataPedido: new Date('2025-10-15'),
      prazoEntrega: new Date('2025-10-25'),
      dataEntrega: null,  // Pronto mas não entregue ainda
      observacoes: 'Tecido fornecido pela cliente',
      prioridade: 'ALTA'
    });

    await Pedido.create({
      clienteId: cliente1.id,
      telefoneCliente: '41999990000',
      tipoServico: 'BORDADO',
      descricaoServico: 'Bordado de nome em toalhas',
      quantidade: 5,
      precoUnitario: 12.00,
      status: 'ENTREGUE',
      dataPedido: new Date('2025-10-10'),
      prazoEntrega: new Date('2025-10-20'),
      dataEntrega: new Date('2025-10-22'),  // Entregue
      observacoes: 'Bordado na cor azul',
      prioridade: 'BAIXA'
    });

    await Pedido.create({
      clienteId: cliente4.id,
      telefoneCliente: '41966660000',
      tipoServico: 'COSTURA',
      descricaoServico: 'Costura de cortinas',
      quantidade: 3,
      precoUnitario: 80.00,
      status: 'CONCLUIDO',
      dataPedido: new Date('2025-10-23'),
      prazoEntrega: new Date('2025-11-10'),
      dataEntrega: null,  // Pronto mas não entregue ainda
      observacoes: 'Tecido blackout',
      prioridade: 'BAIXA'
    });

    await Pedido.create({
      clienteId: cliente2.id,
      telefoneCliente: '41988880000',
      tipoServico: 'BORDADO',
      descricaoServico: 'Bordado personalizado em jaquetas',
      quantidade: 15,
      precoUnitario: 35.00,
      status: 'ENTREGUE',
      dataPedido: new Date('2025-10-21'),
      prazoEntrega: new Date('2025-11-01'),
      dataEntrega: new Date('2025-11-03'),  // Entregue
      observacoes: 'Usar linha dourada',
      prioridade: 'ALTA'
    });

    console.log(`✅ ${await Pedido.count()} pedidos criados\n`);

    console.log('✨ Seed concluído com sucesso!\n');
    console.log('📋 Resumo:');
    console.log(`   • Usuários: ${await Usuario.count()}`);
    console.log(`   • Clientes: ${await Cliente.count()}`);
    console.log(`   • Pedidos: ${await Pedido.count()}\n`);
    console.log('🔐 Credenciais de acesso:\n');
    console.log('   👨‍💼 ADMIN:');
    console.log('   Email: admin@sistema.com');
    console.log('   Senha: admin123\n');
    console.log('   👤 OPERADOR:');
    console.log('   Email: operador@sistema.com');
    console.log('   Senha: operador123\n');
    console.log('   👁️ CONSULTA PÚBLICA:');
    console.log('   URL: http://localhost:5173/consulta');
    console.log('   (Não precisa login - mostra pedidos CONCLUÍDO e ENTREGUE)\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Erro ao executar seed:', error);
    console.error('Stack trace:', error.stack);
    process.exit(1);
  }
}

seed();