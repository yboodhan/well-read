var db = require("./models");

// sequelize model:create --name books --attributes userId:integer,title:string,author:string,selfLink:string
db.books.create({
    userId: 1,
    title: 'Becoming',
    author: 'Michelle Obama',
    selfLink: 'https://www.googleapis.com/books/v1/volumes/hi17DwAAQBAJ'
}).then(function(data) {
  // you can now access the newly created task via the variable data
  db.books.findOne({
      where: {title: 'Becoming'}
  }).then(book => {
      console.log(book)
  })
});

// ryan smith has edited somehting
