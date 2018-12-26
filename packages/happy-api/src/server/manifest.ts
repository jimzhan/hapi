import Glue from 'glue'
import settings from '../settings'

const manifest:Glue.Manifest = {
  server: {
    host: <string> settings.host,
    port: <number> settings.port,
    router: <object> {
      isCaseSensitive: <boolean> false,
      stripTrailingSlash: <boolean> true
    },
    routes: <object> {
      cors: <boolean> true,
      security: <object> {
        hsts: <boolean> false,
        xss: <boolean> true,
        noOpen: <boolean> true,
        noSniff: <boolean> true,
        xframe: <boolean> false
      }
    }
  }
}

export default manifest