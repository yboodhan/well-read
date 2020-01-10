'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('users', 'googleId', Sequelize.STRING).then(() => {
      return queryInterface.addColumn('users', 'googleToken', Sequelize.STRING)
    })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('users', 'googleId').then(() => {
      return queryInterface.removeColumn('users', 'googleToken')
    })
  }
};
