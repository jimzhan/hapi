import * as sessions from './sessions'

const routes = [
  { method: 'POST', path: '/login', config: sessions.create },
  { method: 'POST', path: '/logout', config: sessions.remove }
]

export {
  routes,
  sessions
}
