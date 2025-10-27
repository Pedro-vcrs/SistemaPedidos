const { Sequelize, DataTypes } = require('sequelize');
const path = require('path');

// Detectar ambiente
const isProduction = process.env.NODE_ENV === 'production';
const dialect = process.env.DB_DIALECT || (isProduction ? 'postgres' : 'sqlite');

// Configuração do banco
const sequelize = isProduction 
  ? new Sequelize(process.env.DATABASE_URL || {
      dialect: 'postgres',
      host: process.env.DB_HOST,
      database: process.env.DB_NAME,
      username: process.env.DB_USER,
      password: process.env.DB_PASS,
      port: process.env.DB_PORT || 5432,
      dialectOptions: {
        ssl: {
          require: true,
          rejectUnauthorized: false
        }
      },
      logging: false
    })
  : new Sequelize({
      dialect: 'sqlite',
      storage: path.join(__dirname, '..', 'database.sqlite'),
      logging: false
    });

// Importar modelos
const Cliente = require('./cliente')(sequelize, DataTypes);
const Pedido = require('./pedido')(sequelize, DataTypes);
const Usuario = require('./usuario')(sequelize, DataTypes);

// Associações
Cliente.hasMany(Pedido, { foreignKey: 'clienteId' });
Pedido.belongsTo(Cliente, { foreignKey: 'clienteId' });

module.exports = { sequelize, Cliente, Pedido, Usuario };