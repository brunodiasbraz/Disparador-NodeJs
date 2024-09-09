'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    
    await queryInterface.bulkInsert('Greeting_Templates', [{
      template: 'Olá {name}, como você está? Temos algumas novidades pra você!',
      createdAt: new Date(),
      updatedAt: new Date(),
    },{
      template: 'Bom dia, {name}! Podemos conversar para saber como podemos ajudar você?',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Greeting_Templates', null, {});
  }
};
