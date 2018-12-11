import { auth } from '../apps/apis'

const routes = [
  { method: 'GET', path: '/login', handler: auth.login }
]

export const plugin = {
  name: 'routes',
  async register (server) {
    server.route(routes)
  }
}
