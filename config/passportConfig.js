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
  let name = profile.displayName ? profile.displayName.split(' ') : profile.username
  db.user.findOrCreate({
    where: { githubId: profile.id },
    defaults: {
      githubToken: accessToken,
      firstname: name[0],
      lastname: name[name.length - 1],
      username: profile.username,
      photoUrl: profile._json.avatar_url,
      bio: profile._json.bio || `Github user ${profile.username} works at ${profile._json.company} in ${profile._json.location}`
    }
  })
  .then(([user, wasCreated]) => {
    // Find out if user was already a github user. If so, they need a new token
    if (!wasCreated && user.githubId) {
      user.update({
        githubToken: accessToken
      })
      .then(updatedUser => {
        cb(null, updatedUser)
      })
      .catch(cb)
    }
    else {
      // Newly created user or, not a previous GH user
      return cb(null, user)
    }
  })
  .catch(cb)
}))

// Implement Facebook Strategy
passport.use(new FacebookStrategy({
  clientID: process.env.FACEBOOK_CLIENT_ID,
  clientSecret: process.env.FACEBOOK_SECRET,
  callbackURL: process.env.BASE_URL + '/auth/callback/facebook',
  profileFields: ['id', 'email', 'displayName', 'photos', 'birthday']
}, (accessToken, refreshToken, profile, cb) => {
  console.log('Facebook Login', profile._json.picture.data)
  // Grab the facebook primary email
  let facebookEmail = profile.emails[0].value
  let displayName = profile.displayName.split(' ')
  let photo = profile.photos.length ?
    profile.photos[0].value :
    'https://res.cloudinary.com/briezh/image/upload/v1555956782/tg57atqguantflp2q2e5.jpg'

  // Look for the email in the local database - DO NOT DUPLICATE!
  db.user.findOrCreate({
    where: { email: facebookEmail },
    defaults: {
      facebookToken: accessToken,
      facebookId: profile.id,
      firstname: displayName[0],
      lastname: displayName[displayName.length - 1],
      username: profile.username || displayName[0],
      photoUrl: photo,
      birthdate: profile._json.birthday,
      bio: `${profile.displayName} created this account with Facebook!`
    }
  })
  .then(([user, wasCreated]) => {
    // Did we create a new user?
    if (wasCreated || user.facebookId) {
      // New user, not found in local database
      cb(null, user)
    }
    else {
      // We found an existing user (add FB Id and Token)
      user.update({
        facebookId: profile.id,
        facebookToken: accessToken
      })
      .then(updatedUser => {
        cb(null, updatedUser)
      })
      .catch(cb)
    }
  })
  .catch(cb)
}))

// Make sure you can include this file in other files
module.exports = passport


