const mongoose = require('mongoose')
const slug = require('slugs')

const categorySchema = new mongoose.Schema({
  slug: String,
  title: String,
  description: String,
  color: String,
  moderators: {
    type: [mongoose.Schema.ObjectId],
    ref: 'User',
    default: []
  }
})

categorySchema.pre('save', async function (next) {
  this.slug = slug(this.title)
  const slugRegEx = new RegExp(`^(${this.slug})((-[0-9]*$)?)$`, 'i')
  const discussionWithSlug = await this.constructor.find({ slug: slugRegEx })
  if (discussionWithSlug.length) {
    this.slug = `${this.slug}-${discussionWithSlug.length + 1}`
  }
  // Generate random color
  this.color = `hsl(${Math.round(Math.random() * 360)}, 50%, 50%)`
  next()
})

module.exports = mongoose.model('Category', categorySchema)
