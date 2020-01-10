'use strict'

let bcrypt = require('bcryptjs')

module.exports = (sequelize, DataTypes) => {
  const user = sequelize.define('user', {
    firstname: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: {
          args: [1, 255],
          msg: 'Come on, we know you have a firstname.'
        }
      }
    },
    lastname: DataTypes.STRING,
    email: {
      type: DataTypes.STRING,
      validate: {
        isEmail: {
          msg: 'Hey, please give a valid email address! D:'
        }
      }
    },
    username: DataTypes.STRING,
    password: {
      type: DataTypes.STRING,
      validate: {
        len: {
          args: [6, 25],
          msg: 'Your password must be between 6 and 25 characters. Try again!'
        }
      }
    },
    photoUrl: {
      type: DataTypes.STRING,
      validate: {
        isUrl: {
          msg: 'Aww sad, no picture? :('
        }
      }
    },
    admin: DataTypes.BOOLEAN,
    facebookId: DataTypes.STRING,
    facebookToken: DataTypes.STRING,
    googleId: DataTypes.STRING,
    googleToken: DataTypes.STRING
    // githubId: DataTypes.STRING,
    // githubToken: DataTypes.STRING
  }, {
    hooks: {
      beforeCreate: pendingUser => {
        if (pendingUser && pendingUser.password) {
          // Hash the password
          let hashedPassword = bcrypt.hashSync(pendingUser.password, 12)

          // Reassign the password field to hashed value
          pendingUser.password = hashedPassword
        }
      }
    }
  })

  user.associate = function(models) {
    // associations can be defined here
  }

  user.prototype.validPassword = function(typedInPassword) {
    // Determine if typed-in password hashes to same thing as existing hash
    let correctPassword = bcrypt.compareSync(typedInPassword, this.password)

    // Return the result of that comparison
    return correctPassword
  }

  return user
}
