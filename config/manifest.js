import config from 'config'
import plugins from '../plugins'

export default {
  server: {
    host: config.get('host'),
    port: config.get('port'),
    router: {
      isCaseSensitive: false,
      stripTrailingSlash: true
    },
    routes: {
      cors: true,
      security: {
        hsts: false,
        xss: true,
        noOpen: true,
        noSniff: true,
        xframe: false
      }
    }
  },
  register: {
    plugins
  }
}
