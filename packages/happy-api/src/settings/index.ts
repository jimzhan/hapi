import path from 'path'
import { Record } from 'immutable'
import { Store } from 'confidence'
// ----------------------------------------------------------------------
//  Environment based filters:
//    - `process.env.NODE_ENV`
//      * development (default)
//      * production
//    - `process.env.DEPLOYMENT` - extended settings' profiles for various deployment.
// ----------------------------------------------------------------------
const criteria = {
  mode: <String|undefined> process.env.NODE_ENV,
  deployment: <String|undefined> process.env.DEPLOYMENT
}

const store:Store = new Store({
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
})

interface Settings extends Record<any> {
  basedir?: String
  secret?: String|undefined
  host?: String
  port?: Number
  db?:any
  yar?:any
}

const settings:Settings = Record(store.get('/', criteria))()

export default settings