module.exports = {
  root: true,
  parser: 'babel-eslint',
  extends: [
    require.resolve('eslint-config-standard'),
  ],
  env: {
    browser: true,
    node: true,
    jest: true
  }
}