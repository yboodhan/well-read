// Required node modules
require('dotenv').config() // provide access to variables inside .env file
let express = require('express')
let flash = require('connect-flash')
let layouts = require('express-ejs-layouts')
let session = require('express-session')
let db = require('./models')

// Declare express app variable
let app = express()

// Include passport configuration
let passport = require('./config/passportConfig')

// Set up and middleware
app.set('view engine', 'ejs')
app.use(layouts)
app.use('/', express.static('static'))
app.use(express.urlencoded({ extended: false }))
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true
}))
app.use(flash()) // Depends on session; must come after it
app.use(passport.initialize()) // Depends on session; must come after it
app.use(passport.session()) // Depends on session; must come after it

// Custom middleware: Add variables to locals for each page
app.use((req, res, next) => {
  res.locals.alerts = req.flash()
  res.locals.user = req.user
  next()
})

// Add any controllers we have
app.use('/auth', require('./controllers/auth'))
app.use('/profile', require('./controllers/profile'))
app.use('/books', require('./controllers/books'))

app.get('/clubs', (req, res) => {
  res.render('test/jumbotron_albums', { 
    layout: 'layouts/bootstrap-layout', 
    albums: [
      {
        name: "Oprah's Book Club",
        image: "/img/colorful_bookshelf.jpg"
      },
      {
        name: "Hello Sunshine",
        image: "/img/hellosunshine.jpg"
      }
    ],
    alerts: {
      error: `You aren't logged in!`,
      success: `You signed in!`
    }
  })
})

// Add home or catch-all routes
app.get('/', (req, res) => {
  res.render('home', { layout: 'layouts/home-layout' })
})

app.get('*', (req, res) => {
  res.render('error')
})

app.listen(process.env.PORT || 3028, () => {
  console.log('Hello and good morning! ☕️')
})
