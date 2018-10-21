import { auth } from '../apps'

const routes = [
  { method: 'GET', path: '/login', handler: auth.views.login }
]

export const plugin = {
  name: 'routes',
  async register (server) {
    server.route(routes)
  }
}
