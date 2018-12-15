import { routes } from '../apps'

export const plugin = {
  name: 'routes.plugin',
  async register (server) {
    server.route(routes)
  }
}
