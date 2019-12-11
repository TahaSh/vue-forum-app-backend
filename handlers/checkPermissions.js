const canUser = require('../helpers/canUser')
const mongoose = require('mongoose')
const { catchErrors } = require('../handlers/errorHandlers')
const boom = require('boom')

module.exports = ({ permissions, lastCheck = true, owns = null, getUserPermissions = null }) => catchErrors(async (req, res, next) => {
  if (req.authorized) {
    return next()
  }

  let userPermissions = getUserPermissions
    ? await getUserPermissions(req.user, req)
    : req.user.permissions.root
  userPermissions = !userPermissions ? [] : userPermissions
  if (canUser(userPermissions, permissions)) {
    if (!owns) {
      req.authorized = true
    } else {
      const doc = await mongoose.model(owns.model)
        .findOne({ [owns.modelKey]: req.params[owns.routeParam] })
      const isOwner = doc && (doc.user._id.equals(req.user._id))
      req.authorized = isOwner
    }
  }
  if (!req.authorized && lastCheck) {
    throw boom.unauthorized()
  }
  next()
})
