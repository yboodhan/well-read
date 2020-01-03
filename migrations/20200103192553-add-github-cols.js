'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('users', 'githubId', Sequelize.STRING).then(() => {
      return queryInterface.addColumn('users', 'githubToken', Sequelize.STRING)
    })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('users', 'githubId').then(() => {
      return queryInterface.removeColumn('users', 'githubToken')
    })
  }
};
