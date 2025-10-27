module.exports = (sequelize, DataTypes) => {
  return sequelize.define('Cliente', {
    nome: { 
      type: DataTypes.STRING, 
      allowNull: false,
      validate: {
        notEmpty: { msg: 'Nome é obrigatório' },
        len: { args: [3, 255], msg: 'Nome deve ter entre 3 e 255 caracteres' }
      }
    },
    telefone: { 
      type: DataTypes.STRING,
      validate: {
        isValidPhone(value) {
          if (value && !/^\d{10,11}$/.test(value.replace(/\D/g, ''))) {
            throw new Error('Telefone inválido');
          }
        }
      }
    },
    email: { 
      type: DataTypes.STRING,
      validate: {
        isEmail: { msg: 'Email inválido' }
      }
    }
  }, {
    tableName: 'clientes',
    timestamps: true,
    validate: {
      atLeastOneContact() {
        if (!this.telefone && !this.email) {
          throw new Error('É necessário informar pelo menos um contato (telefone ou email)');
        }
      }
    }
  });
};