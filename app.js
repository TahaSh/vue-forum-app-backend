const express = require('express')
const app = express()
const routes = require('./routes')
const path = require('path')
const cors = require('cors')
const bodyParser = require('body-parser')
const errorHandlers = require('./handlers/errorHandlers')
const passport = require('passport')
require('./handlers/passport')

app.use(cors())

app.use(express.static(path.join(__dirname, 'public')))

app.use(bodyParser({ limit: '50mb' }))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use(passport.initialize())

app.use('/', routes)

app.use(errorHandlers.notFound)

if (app.get('env') === 'development') {
  app.use(errorHandlers.developmentErrors)
}

app.use(errorHandlers.productionErrors)

module.exports = app
