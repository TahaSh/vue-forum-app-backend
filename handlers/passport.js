const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const passportJWT = require('passport-jwt')
const JWTStrategy = passportJWT.Strategy
const ExtractJWT = passportJWT.ExtractJwt
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const User = mongoose.model('User')

passport.use('local', new LocalStrategy(
  {
    usernameField: 'email',
    passwordField: 'password'
  },
  (email, password, cb) => {
    User.findOne({ email })
      .select('+password')
      .then(user => {
        if (!user) {
          return cb(Error('Incorrect email or password.'))
        }
        bcrypt.compare(password, user.password)
          .then(isValid => {
            if (!isValid) {
              return cb(Error('Incorrect email or password.'))
            }
            return cb(null, user, { message: 'Logged In Successfully' })
          })
          .catch(err => {
            cb(err)
          })
      })
      .catch(err => {
        cb(err)
      })
  }
))

passport.use(new JWTStrategy(
  {
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey: 'somesecrettoken'
  },
  (jwtPayload, cb) => {
    return cb(null, jwtPayload)
  }
))
