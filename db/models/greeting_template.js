'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Greeting_Template extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Greeting_Template.init({
    template: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Greeting_Template',
  });
  return Greeting_Template;
};