let axios = require('axios')
let router = require('express').Router()
let db = require('../models')

// Variables
const GOOGLE_BOOKS_URL = 'https://www.googleapis.com/books/v1/volumes'
const GOOGLE_BOOKS_KEY = '***REMOVED***'

// GET /books - books index
router.get('/', function(req, res) {
  // res.render('test/results', { search: false, vols: [] })
  // db.books.findAll({
  //   where: { userId: Number(req.user) }
  // })
  db.users_books.findAll().then(pairs => {
    books = []
    pairs.forEach(pair => {
      if (pair.userId === Number(req.user)) {
        db.books.findOne({
          where: { id: Number(pair.bookId) }
        
        }).then(book => {
          books.push(book)
        })
      }
    })
    res.json(books)
    // res.render('books/show', { vols: books })
  })
  // .catch(err => {
  //   console.log('Error', err)
  //   res.send('Error')
  // })
})

// GET /books/search - books index
router.get('/search', function(req, res) {
  let search = req.query.search;

  if (search) {
    let url = `${GOOGLE_BOOKS_URL}?q=${search}` + '&langRestrict=en' + `&key=${GOOGLE_BOOKS_KEY}`
    axios.get(url)
    .then(data => {
      if (data) {
        console.log(data.data)
        if (data.data.items.length > 0) {
          let vols = data.data.items.slice(0, Math.min(data.data.items.length, 6))
          res.render('test/results', { search: search, vols: vols })
        } else {
          res.render('error') // no entries in data.data.items
        }
      } else {
        res.render('error') // no data!
      }
    })
  } else {
    res.render('test/results', { search: false, vols: [] })
  }
})

// GET /books/test - test Google Books API call
router.get('/test', (req, res) => {
  let url = 'https://www.googleapis.com/books/v1/volumes?q=intitle:the+girls+inauthor:emma+cline&langRestrict=en&key=***REMOVED***'
  axios.get(url)
    .then(data => {
      console.log(data.data)
      // res.send(data.data.items.slice(0,1)[0])
      let volInfo = data.data.items.slice(0,1)[0].volumeInfo;
      // res.render('jumbotron_albums', { 
      //   layout: 'layouts/bootstrap-layout', 
      //   albums: [
      //     {
      //       name: volInfo.title,
      //       image: volInfo.imageLinks.thumbnail
      //     },
      //     {
      //       name: "Hello Sunshine",
      //       image: "/img/hellosunshine.jpg"
      //     }
      //   ],
      //   alerts: {
      //     error: `You aren't logged in!`,
      //     success: `You signed in!`
      //   }
      // })
      res.render('test/books', { volInfo: volInfo })
    })
    .catch(err => res.send(err));
})

// GET /books/test/q/:query - test Google Books API call for given query
router.get('/test/q/:query', (req, res) => {
  let url = `https://www.googleapis.com/books/v1/volumes?q=${req.params.query}&langRestrict=en&key=***REMOVED***`;
  axios.get(url)
    .then(data => {
      console.log(data.data)
      res.send(`<img src='${data.data.items.slice(0,1)[0].volumeInfo.imageLinks.thumbnail}'>`)
    })
    .catch(err => res.send(err));
})

// GET /books/:isbn - show book with given isbn
router.get('/:isbn', function(req, res) {
  // https://www.googleapis.com/books/v1/volumes?q=intitle:the+girls+inauthor:emma+cline&langRestrict=en&key=***REMOVED***
  let gbUrl = 'https://www.googleapis.com/books/v1/volumes?q=' + req.params.isbn
  let gbKey = '***REMOVED***';
  gbUrl += `&key=${gbKey}`;
  // Use request to call the API
  axios.get(gbUrl).then( function(apiResponse) {
    // print all keys of apiResponse.data object
    // console.log('Object.keys(apiResponse.data):', Object.keys(apiResponse.data));

    // print slice of apiResponse.data object
    // console.log('apiResponse.data:', [].concat(apiResponse.data))

    // show apiResponse on page
    res.json(apiResponse);
  })
})

// GET /books/query - query page
// router.get('/query', (req, res) => {
//   let printout = '';
//   for (let key in req.query) {
//     printout += key + ": " + req.query[key] + "<br />";
//   }
//   res.send("Here's what they sent: <br /><br />" + printout);
// })

// GET /books/test/results - test Google Books API call
router.get('/test/results', (req, res) => {
  let url = 'https://www.googleapis.com/books/v1/volumes?q=intitle:the+girls&langRestrict=en&key=***REMOVED***'
  axios.get(url)
    .then(data => {
      console.log(data.data)
      // res.send(data.data.items.slice(0,1)[0])
      let vols = data.data.items.slice(0,3);
      // res.render('jumbotron_albums', { 
      //   layout: 'layouts/bootstrap-layout', 
      //   albums: [
      //     {
      //       name: volInfo.title,
      //       image: volInfo.imageLinks.thumbnail
      //     },
      //     {
      //       name: "Hello Sunshine",
      //       image: "/img/hellosunshine.jpg"
      //     }
      //   ],
      //   alerts: {
      //     error: `You aren't logged in!`,
      //     success: `You signed in!`
      //   }
      // })
      res.render('test/results', { vols: vols })
    })
    .catch(err => res.send(err));
})

module.exports = router
