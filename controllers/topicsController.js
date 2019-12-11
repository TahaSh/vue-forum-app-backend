const mongoose = require('mongoose')
const Topic = mongoose.model('Topic')
const Category = mongoose.model('Category')
const boom = require('boom')

exports.getTopicsInCategory = async (req, res) => {
  const category = (await Category.findOne({ slug: req.params.slug }))
  if (!category) {
    throw boom.notFound('Category not found')
  }
  const topics = await Topic.find({ category: category._id })
  res.json(topics)
}

exports.getTopic = async (req, res) => {
  const topic = await Topic.findOneAndUpdate(
    { _id: req.params.id },
    { $inc: { views: 1 } }
  )
  res.json(topic)
}

exports.createTopic = async (req, res) => {
  const categoryId = (await Category.findOne({ slug: req.body.category }))._id
  req.body.category = categoryId
  req.body.user = req.user
  const topic = await (new Topic(req.body).save())
  res.json(topic)
}

exports.updateTopic = async (req, res) => {
  const categoryId = (await Category.findOne({ slug: req.body.category }))._id
  req.body.category = categoryId
  const topic = await Topic.findOneAndUpdate(
    { _id: req.params.id },
    req.body,
    {
      new: true,
      runValidators: true
    }
  )
  res.json(topic)
}

exports.deleteTopic = async (req, res) => {
  await Topic.findOneAndDelete({ _id: req.params.id })
  res.send(true)
}
