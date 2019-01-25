import * as handlers from './handlers'
import * as validators from './validators'

// ----------------------------------------------------------------------
//  RESTful style user login/logout on top of session cookie.
// ----------------------------------------------------------------------
export const plugin = {
  name: 'auth',

  async register (server) {
    server.route([
      {
        method: 'POST',
        path: '/login',

        options: {
          auth: false,

          validate: validators.login,

          handler: handlers.login,

          tags: ['api']
        }
      },
      {
        method: 'POST',
        path: '/logout',

        options: {
          auth: false,

          handler: handlers.logout,

          tags: ['api']
        }
      }
    ])
  }
}
