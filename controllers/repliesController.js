const mongoose = require('mongoose')
const Reply = mongoose.model('Reply')
const Topic = mongoose.model('Topic')
const boom = require('boom')

exports.createReply = async (req, res) => {
  const topic = (await Topic.findById(req.params.topicId))
  if (!topic) {
    throw boom.notFound('Topic not found')
  }
  req.body.topic = req.params.topicId
  req.body.user = req.user._id
  let reply = await (new Reply(req.body).save())
  reply = await Reply.populate(reply, 'user')
  res.json(reply)
}

exports.updateReply = async (req, res) => {
  const topic = (await Topic.findById(req.params.topicId))
  if (!topic) {
    throw boom.notFound('Topic not found')
  }
  const reply = await Reply.findOneAndUpdate(
    { _id: req.params.replyId },
    req.body,
    {
      new: true,
      runValidators: true
    }
  )
  res.json(reply)
}

exports.deleteReply = async (req, res) => {
  const topic = (await Topic.findById(req.params.topicId))
  if (!topic) {
    throw boom.notFound('Topic not found')
  }
  await Reply.findOneAndDelete({ _id: req.params.replyId })
  res.send(true)
}
