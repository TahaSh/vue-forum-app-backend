module.exports = {
  root: true,
  env: {
    node: true
  },
  parserOptions: {
    parser: 'babel-eslint',
    "ecmaVersion": 2017
  },
  extends: 'standard',
  'rules': {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'arrow-parens': 0,
    'generator-star-spacing': 0,
    'no-new': 0,
    'no-useless-escape': 0,
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,
    'no-process-exit': "error"
  }
}