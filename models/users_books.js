'use strict';
module.exports = (sequelize, DataTypes) => {
  const users_books = sequelize.define('users_books', {
    userId: DataTypes.INTEGER,
    booksId: DataTypes.INTEGER
  }, {});
  users_books.associate = function(models) {
    // associations can be defined here
  };
  return users_books;
};