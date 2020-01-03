// Read ENV Values
require('dotenv').config()

// Require passport and any passport strategies you wish to use
let passport = require('passport')
let FacebookStrategy = require('passport-facebook').Strategy
let GithubStrategy = require('passport-github2').Strategy
let LocalStrategy = require('passport-local').Strategy

// Reference the models folder to access the db
let db = require('../models')

// Serialization and Deserialization functions
// These are for passport to use to store/lookup the user info
// Serialize: Reduce the user to just the unique ID
passport.serializeUser((user, cb) => {
  // callback function params: error message (null if no error); user data (only the id)
  cb(null, user.id)
})

// Deserialize: Takes a user ID and looks up the rest of the info
passport.deserializeUser((id, cb) => {
  db.user.findByPk(id)
  .then(user => {
    // callback(errorMessage, userData)
    cb(null, user)
  })
  .catch(cb)
})

// Implement Local Strategy (local database)
passport.use(new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password'
}, (email, password, cb) => {
  // Try looking up the user by their email
  db.user.findOne({
    where: { email: email }
  })
  .then(foundUser => {
    // Check if I found a user; then check their password
    if (!foundUser || !foundUser.validPassword(password)) {
      // Uh-Oh, bad user or maybe bad password
      cb(null, null)
    }
    else {
      // Valid user and a valid password
      cb(null, foundUser)
    }
  })
  .catch(cb)
}))

// Implement Github Strategy
passport.use(new GithubStrategy({
  clientID: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_SECRET,
  callbackURL: process.env.BASE_URL + '/auth/callback/github'
}, (accessToken, refreshToken, profile, cb) => {

}))

// Implement Facebook Strategy

// Make sure you can include this file in other files
module.exports = passport


