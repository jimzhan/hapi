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
          tags: ['api'],

          validate: validators.login,

          handler: async (request, h) => {
            return h.response({ data: 'token' })
          }
        }
      },
      {
        method: 'POST',
        path: '/logout',

        options: {
          auth: false,
          tags: ['api'],

          handler: async (request, h) => {
            return h.response({ data: 'logout' })
          }
        }
      }
    ])
  }
}
