module.exports = {
  user: [
    'own_topics:write',
    'own_topics:delete',
    'own_replies:write',
    'own_replies:delete'
  ],
  get moderator () {
    return this.user
  },
  get admin () {
    return Array.from(new Set(
      this.user
        .concat(this.moderator)
        .concat([
          'categories:write',
          'categories:delete'
        ])
    ))
  },
  get all () {
    return Array.from(new Set(
      this.user
        .concat(this.moderator)
        .concat(this.admin)
    ))
  }
}
