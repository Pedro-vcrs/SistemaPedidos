const { Sequelize, DataTypes } = require('sequelize');
const path = require('path');

const dialect = process.env.DB_DIALECT || 'sqlite';

const sequelize = new Sequelize({
  dialect: 'postgres',
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  port: process.env.DB_PORT || 5432,
  dialectOptions: {
    ssl: process.env.DB_SSL === 'true' ? {
      require: true,
      rejectUnauthorized: false
    } : false
  },
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