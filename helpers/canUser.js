module.exports = (userPermissions, permissions) => {
  const targetPermissions = Array.isArray(permissions) ? permissions : [permissions]
  return targetPermissions.every(value => userPermissions.includes(value))
}
