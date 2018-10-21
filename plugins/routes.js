import { auth } from '../apps'

export const plugin = {
  name: 'routes',
  async register (server, options) {
    server.route(auth.urls)
  }
}
