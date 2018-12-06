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
  host: '127.0.0.1',
  port: {
    $filter: 'mode',
    production: 9394,
    $default: 5000
  },
  secret: process.env.SECRET
}

internals.store = new Confidence.Store(internals.settings)

export default immutable.Record(internals.store.get('/', internals.criteria))()
