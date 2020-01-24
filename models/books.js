'use strict';
module.exports = (sequelize, DataTypes) => {
  const books = sequelize.define('books', {
    userId: DataTypes.INTEGER,
    title: DataTypes.STRING,
    author: DataTypes.STRING,
    selfLink: DataTypes.STRING
  }, {});
  books.associate = function(models) {
    // associations can be defined here
    models.books.belongsTo(models.user)
    // models.books.belongsToMany(models.user, {
    //   through: 'users_books'
    // })
  };
  return books;
};