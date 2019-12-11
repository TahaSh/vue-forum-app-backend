const mongoose = require('mongoose')
const User = mongoose.model('User')
const Category = mongoose.model('Category')
const bcrypt = require('bcryptjs')
const path = require('path')
const fs = require('fs')
const boom = require('boom')
const passport = require('passport')
const jwt = require('jsonwebtoken')
const _ = require('lodash')

exports.registerUser = async (req, res) => {
  const user = await User.findOne({ email: req.body.email })
  if (user) {
    throw boom.badRequest('This user already exists')
  }
  const hashedPassword = await bcrypt.hash(req.body.password, 10)
  const createdUser = await (new User({
    email: req.body.email,
    name: req.body.name,
    password: hashedPassword,
    role: req.body.role
  })).save()

  if (req.body.moderateCategory) {
    await Category.updateOne(
      { slug: req.body.moderateCategory },
      { $push: { moderators: createdUser._id } }
    )
  }

  res.json({ message: 'done' })
}

exports.login = async (req, res) => {
  passport.authenticate('local', { session: false }, (err, user, info) => {
    if (err || !user) {
      return res.status(400).json({
        message: err.message
      })
    }

    req.login(user, { session: false }, async err => {
      if (err) {
        res.send(err)
      }
      const permissions = await user.getPermissions()
      const preparedUser = Object.assign({}, user.toJSON(req), { permissions })
      const token = jwt.sign(preparedUser, 'somesecrettoken')
      return res.json({ user: preparedUser, token })
    })
  })(req, res)
}

exports.updateLoggedInUserProfile = async (req, res) => {
  const user = await User.findById(req.user._id)
  user.email = req.body.email
  user.name = req.body.name

  if (req.body.avatar) {
    const directoryPath = path.join(__dirname, `../public/images/users/`)
    if (!fs.existsSync(directoryPath)) {
      fs.mkdirSync(directoryPath)
    }
    if (user.avatar !== '') {
      const imagePath = path.join(__dirname, `../public/images/users/${user.avatar}`)
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath)
      }
    }

    if (req.body.avatar === '') {
      user.avatar = ''
    } else {
      const base64Data = req.body.avatar.replace(/^data:image\/(png|jpg|jpeg);base64,/, '')
      const filename = user._id + '-' + (new Date()).toISOString().replace(/:/g, '-')
      await fs.writeFileSync(path.join(__dirname, `../public/images/users/${filename}.png`), base64Data, 'base64')

      user.avatar = `${filename}.png`
    }
  }

  const updatedUser = await user.save()
  const permissions = await updatedUser.getPermissions()
  const preparedUser = Object.assign({}, updatedUser.toJSON(req), { permissions })
  const token = jwt.sign(preparedUser, 'somesecrettoken')
  return res.json({ user: preparedUser, token })
}

exports.updateLoggedInUserPassword = async (req, res) => {
  const user = await User.findById(req.user._id).select('+password')
  const isCurrentPasswordCorrect = await bcrypt.compare(req.body.currentPassword, user.password)
  if (!isCurrentPasswordCorrect) {
    return res
      .status(401)
      .json({ message: 'Your current password is wrong!' })
  }
  if (!req.body.newPassword) {
    return res
      .status(401)
      .json({ message: 'Please provide a new password!' })
  }
  const hashedPassword = await bcrypt.hash(req.body.newPassword, 10)
  const isSame = await bcrypt.compare(req.body.currentPassword, hashedPassword)
  if (isSame) {
    return res
      .status(400)
      .json({ message: 'Your new password cannot be the same as the old password' })
  }
  user.password = hashedPassword
  await user.save()
  return res.send(true)
}

exports.getProfile = async (req, res) => {
  const user = await User.findById(req.user._id)
  const userJSON = Object.assign({}, user.toJSON(), { _id: user._id.toString() })
  const reqUser = _.omit(req.user, ['iat', 'permissions'])
  const updated = !_.isEqual(userJSON, reqUser)
  if (updated) {
    throw boom.unauthorized('out-of-date token')
  }
  res.json(req.user)
}
