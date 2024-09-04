'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Arquivos extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Arquivos.init({
    arquivo: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Arquivos',
  });
  return Arquivos;
};