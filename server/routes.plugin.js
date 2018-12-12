import { auth } from '../apps/views'

const routes = [
  { method: 'POST', path: '/login', config: auth.login }
]

export const plugin = {
  name: 'routes.plugin',
  async register (server) {
    server.route(routes)
  }
}
