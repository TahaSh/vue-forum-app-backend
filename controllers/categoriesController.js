const mongoose = require('mongoose')
const Category = mongoose.model('Category')
const Topic = mongoose.model('Topic')
const boom = require('boom')

exports.getCategories = async (req, res) => {
  const categories = await Category.find()
  res.json(categories)
}

exports.getCategory = async (req, res) => {
  const category = await Category.findOne({ slug: req.params.slug })
  res.json(category)
}

exports.createCategory = async (req, res) => {
  const category = await (new Category(req.body).save())
  res.json(category)
}

exports.updateCategory = async (req, res) => {
  const category = await Category.findOneAndUpdate(
    { slug: req.params.slug },
    req.body,
    {
      new: true,
      runValidators: true
    }
  )
  res.json(category)
}

exports.deleteCategory = async (req, res) => {
  const category = (await Category.findOne({ slug: req.params.slug }))
  if (!category) {
    throw boom.notFound('Category not found')
  }
  await Topic.deleteMany({ category: category._id })
  await Category.findOneAndDelete({ slug: req.params.slug })
  res.send(true)
}
