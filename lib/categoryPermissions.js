module.exports = {
  user: [],
  moderator: [
    'categories_topics:write',
    'categories_topics:delete',
    'categories_replies:write',
    'categories_replies:delete'
  ],
  get admin () {
    return this.moderator
  },
  get all () {
    return Array.from(new Set(
      this.user
        .concat(this.moderator)
        .concat(this.admin)
    ))
  }
}
