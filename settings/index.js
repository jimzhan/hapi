import path from 'path'
import immutable from 'immutable'
import Confidence from 'confidence'
// ----------------------------------------------------------------------
//  Environment based filters:
//    - `process.env.NODE_ENV`
//      * development (default)
//      * production
//    - `process.env.DEPLOYMENT` - extended settings' profiles for various deployment.
// ----------------------------------------------------------------------
const internals = {
  criteria: {
    mode: process.env.NODE_ENV,
    deployment: process.env.DEPLOYMENT
  },

  settings: {
    $meta: 'application settings file',
    basedir: path.join(__dirname, '..'),
    secret: process.env.SECRET,
    host: '127.0.0.1',
    port: {
      $filter: 'mode',
      production: 9394,
      $default: 5000
    },
    db: {
      uri: process.env.DB_URI
    },
    // ------------------------------------------------------------
    //  Secure Cookie Settings
    // ------------------------------------------------------------
    yar: {
      name: 'sid',
      storeBlank: false,
      cookieOptions: {
        password: process.env.SECRET,
        path: '/',
        isSameSite: 'Lax',
        isSecure: {
          $filter: 'mode',
          production: true,
          $default: false
        },
        isHttpOnly: {
          $filter: 'mode',
          production: true,
          $default: false
        },
        ttl: null
      }
    }
  }
}

internals.store = new Confidence.Store(internals.settings)

export default immutable.Record(internals.store.get('/', {
  mode: process.env.NODE_ENV,
  deployment: process.env.DEPLOYMENT
}))()
