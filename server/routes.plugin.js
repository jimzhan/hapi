import { routes } from '../apps/views'

export const plugin = {
  name: 'routes.plugin',
  async register (server) {
    server.route(routes)
  }
}
