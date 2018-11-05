import immutable from 'immutable'
import Confidence from 'confidence'

const internals = {
  criteria: {
    env: process.env.NODE_ENV
  }
}

internals.settings = {
  $meta: 'application settings file',
  port: {
    $filter: 'env',
    production: 8000,
    $default: 5000
  }
}

internals.store = new Confidence.Store(internals.settings)

export default immutable.Record(internals.store.get('/', internals.criteria))()
