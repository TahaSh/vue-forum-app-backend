const mongoose = require('mongoose')

require('dotenv').config({ path: '.env' })

mongoose.connect(process.env.DATABASE, { useNewUrlParser: true })
mongoose.Promise = global.Promise
mongoose.connection.on('error', err =>
  console.error(`Database connection error: ${err.message}`)
)
mongoose.set('useCreateIndex', true)
mongoose.set('useFindAndModify', false)

require('./models/Category')
require('./models/Topic')
require('./models/Reply')
require('./models/User')

const app = require('./app')
const port = process.env.PORT
app.listen(port, () =>
  console.log(`spa-forum-backend is running on port ${port}!`)
)
