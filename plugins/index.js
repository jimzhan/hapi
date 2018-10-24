import config from 'config'

export default [
  {
    plugin: require('yar'),
    options: {
      storeBlank: false,
      cookieOptions: config.get('cookie')
    }
  },
  {
    plugin: './plugins/routes'
  }
]
