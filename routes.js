const express = require('express')
const router = express.Router()
const categoriesController = require('./controllers/categoriesController')
const topicsController = require('./controllers/topicsController')
const repliesController = require('./controllers/repliesController')
const usersController = require('./controllers/usersController')
const passport = require('passport')
const { catchErrors } = require('./handlers/errorHandlers')
const checkPermissions = require('./handlers/checkPermissions')
const auth = passport.authenticate('jwt', { session: false })
const mongoose = require('mongoose')
const Topic = mongoose.model('Topic')

router.get('/', (req, res) => res.end('It works!'))

/** Categories */
router.get('/categories', catchErrors(categoriesController.getCategories))
router.get('/categories/:slug', catchErrors(categoriesController.getCategory))
router.post('/categories',
  auth,
  checkPermissions({ permissions: ['categories:write'] }),
  catchErrors(categoriesController.createCategory)
)

router.put('/categories/:slug',
  auth,
  checkPermissions({ permissions: ['categories:write'] }),
  catchErrors(categoriesController.updateCategory)
)

router.delete('/categories/:slug',
  auth,
  checkPermissions({ permissions: ['categories:delete'] }),
  catchErrors(categoriesController.deleteCategory)
)

/** Topics */
router.get('/categories/:slug/topics', catchErrors(topicsController.getTopicsInCategory))
router.get('/topics/:id', catchErrors(topicsController.getTopic))
router.post('/topics',
  auth,
  checkPermissions({ permissions: ['own_topics:write'] }),
  catchErrors(topicsController.createTopic)
)
router.put('/topics/:id',
  auth,
  checkPermissions({
    permissions: ['categories_topics:write'],
    getUserPermissions: async (user, req) => {
      const category = await Topic.getCategory(req.params.id)
      return new Promise(
        resolve => resolve(user.permissions.categories[category.slug])
      )
    },
    lastCheck: false
  }),
  checkPermissions({
    permissions: ['own_topics:write'],
    owns: { model: 'Topic', modelKey: '_id', routeParam: 'id' }
  }),
  catchErrors(topicsController.updateTopic)
)
router.delete('/topics/:id',
  auth,
  checkPermissions({
    permissions: ['own_topics:delete'],
    owns: { model: 'Topic', modelKey: '_id', routeParam: 'id' }
  }),
  catchErrors(topicsController.deleteTopic)
)

/** Reply */
router.post('/topics/:topicId/replies',
  auth,
  catchErrors(repliesController.createReply)
)
router.put('/topics/:topicId/replies/:replyId',
  auth,
  checkPermissions({
    permissions: ['categories_replies:write'],
    getUserPermissions: async (user, req) => {
      const category = await Topic.getCategory(req.params.topicId)
      return new Promise(resolve => {
        resolve(user.permissions.categories[category.slug])
      })
    },
    lastCheck: false
  }),
  checkPermissions({
    permissions: ['own_replies:write'],
    owns: { model: 'Reply', modelKey: '_id', routeParam: 'replyId' }
  }),
  catchErrors(repliesController.updateReply)
)
router.delete('/topics/:topicId/replies/:replyId',
  auth,
  checkPermissions({
    permissions: ['categories_replies:delete'],
    getUserPermissions: async (user, req) => {
      const category = await Topic.getCategory(req.params.topicId)
      return new Promise(resolve => {
        resolve(user.permissions.categories[category.slug])
      })
    },
    lastCheck: false
  }),
  checkPermissions({
    permissions: ['own_replies:delete'],
    owns: { model: 'Reply', modelKey: '_id', routeParam: 'replyId' }
  }),
  catchErrors(repliesController.deleteReply)
)

/** User */
router.post('/register', catchErrors(usersController.registerUser))
router.post('/login', catchErrors(usersController.login))
router.put(
  '/profile',
  auth,
  catchErrors(usersController.updateLoggedInUserProfile)
)
router.put(
  '/profile/password',
  auth,
  catchErrors(usersController.updateLoggedInUserPassword)
)
router.get(
  '/getprofile',
  auth,
  catchErrors(usersController.getProfile)
)

module.exports = router
