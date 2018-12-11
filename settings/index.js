import path from 'path'
import immutable from 'immutable'
import Confidence from 'confidence'

const internals = {
  criteria: {
    mode: process.env.NODE_ENV,
    deployment: process.env.DEPLOYMENT
  }
}

internals.settings = {
  $meta: 'application settings file',
  basedir: path.join(__dirname, '..'),
  secret: process.env.SECRET,
  host: '127.0.0.1',
  port: {
    $filter: 'mode',
    production: 9394,
    $default: 5000
  },
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

internals.store = new Confidence.Store(internals.settings)

export default immutable.Record(internals.store.get('/', internals.criteria))()
