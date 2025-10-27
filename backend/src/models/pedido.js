module.exports = (sequelize, DataTypes) => {
  return sequelize.define('Pedido', {
    tipoServico: { 
      type: DataTypes.ENUM('COSTURA', 'BORDADO'), 
      allowNull: false,
      defaultValue: 'COSTURA',
      validate: {
        isIn: {
          args: [['COSTURA', 'BORDADO']],
          msg: 'Tipo de serviço deve ser COSTURA ou BORDADO'
        }
      }
    },
    descricaoServico: { 
      type: DataTypes.STRING, 
      allowNull: false,
      validate: {
        notEmpty: { msg: 'Descrição do serviço é obrigatória' },
        len: { args: [5, 255], msg: 'Descrição deve ter entre 5 e 255 caracteres' }
      }
    },
    quantidade: { 
      type: DataTypes.INTEGER, 
      allowNull: false, 
      defaultValue: 1,
      validate: {
        min: { args: [1], msg: 'Quantidade mínima é 1' }
      }
    },
    precoUnitario: { 
      type: DataTypes.DECIMAL(10,2), 
      allowNull: false, 
      defaultValue: 0.00,
      validate: {
        min: { args: [0], msg: 'Preço não pode ser negativo' }
      }
    },
    status: { 
      type: DataTypes.ENUM('PENDENTE','EM_ANDAMENTO','CONCLUIDO','ENTREGUE'), 
      defaultValue: 'PENDENTE' 
    },
    dataPedido: { 
      type: DataTypes.DATEONLY, 
      defaultValue: DataTypes.NOW 
    },
    prazoEntrega: { 
      type: DataTypes.DATEONLY,
      validate: {
        isDate: { msg: 'Prazo de entrega deve ser uma data válida' }
      }
    },
    // ✅ NOVO CAMPO
    dataEntrega: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      comment: 'Data em que o pedido foi efetivamente entregue ao cliente'
    },
    // ✅ NOVO CAMPO
    telefoneCliente: {
      type: DataTypes.STRING(15),
      allowNull: true,
      comment: 'Telefone de contato específico para este pedido'
    },
    observacoes: { 
      type: DataTypes.TEXT 
    },
    prioridade: { 
      type: DataTypes.ENUM('BAIXA','MEDIA','ALTA'), 
      defaultValue: 'MEDIA' 
    }
  }, {
    tableName: 'pedidos',
    timestamps: true,
    getterMethods: {
      total() {
        const q = this.getDataValue('quantidade') || 0;
        const p = parseFloat(this.getDataValue('precoUnitario') || 0);
        return (q * p).toFixed(2);
      }
    },

    hooks: {
      beforeUpdate: async (pedido) => {
        // Se mudou para ENTREGUE e ainda não tem dataEntrega
        if (pedido.changed('status') && pedido.status === 'ENTREGUE' && !pedido.dataEntrega) {
          pedido.dataEntrega = new Date().toISOString().split('T')[0]; // Formato YYYY-MM-DD
        }
      }
    }
  });
};