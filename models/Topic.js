const mongoose = require('mongoose')
const Category = mongoose.model('Category')

const topicSchema = new mongoose.Schema({
  title: String,
  content: String,
  views: {
    type: Number,
    default: 0
  },

  createdAt: {
    type: Date,
    default: Date.now
  },

  updatedAt: {
    type: Date,
    default: Date.now
  },

  category: {
    type: mongoose.Schema.ObjectId,
    ref: 'Category'
  },

  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  }
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
})

topicSchema.virtual('replies', {
  ref: 'Reply',
  localField: '_id',
  foreignField: 'topic'
})

topicSchema.virtual('numberOfReplies', {
  ref: 'Reply',
  localField: '_id',
  foreignField: 'topic',
  count: true
})

topicSchema.statics.getCategory = async function (topicId) {
  const topic = await this.findById(topicId)
  const category = await Category.findById(topic.category)
  return new Promise(resolve => resolve(category))
}

topicSchema.pre('find', function (next) {
  this.populate('user')
  this.populate('numberOfReplies')
  next()
})

topicSchema.pre('findOneAndUpdate', function (next) {
  this.populate('replies')
  this.populate('user')
  this.populate('category')
  next()
})

module.exports = mongoose.model('Topic', topicSchema)
