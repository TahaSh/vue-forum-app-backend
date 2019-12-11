const boom = require('boom')

exports.catchErrors = fn => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(err => {
    if (!err.isBoom) {
      return next(boom.badImplementation(err))
    }
    next(err)
  })
}

exports.notFound = (req, res, next) => {
  next(boom.notFound())
}

exports.developmentErrors = (err, req, res, next) => {
  res
    .status(err.output.statusCode)
    .json({ message: err.message })
}

exports.productionErrors = (err, req, res, next) => {
  res
    .status(err.output.statusCode)
    .json(err.output.payload)
}
