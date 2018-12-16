import joi from 'joi'
import Boom from 'boom'
// ----------------------------------------------------------------------
//  RESTful style user login/logout on top of session cookie.
// ----------------------------------------------------------------------

export const create = {
  method: 'POST',
  path: '/login',

  options: {
    auth: false,

    validate: {
      payload: {
        username: joi.string().min(6).email().required(),
        password: joi.string().min(6).required()
      },
      failAction: () => {
        throw Boom.badRequest()
      }
    },
    handler: async (request, h) => {
      return h.response({ data: 'token' })
    },

    tags: ['api']
  }
}

export const remove = {
  method: 'POST',
  path: '/logout',

  options: {
    auth: false,

    handler: async (request, h) => {
      return h.response({ data: 'logout' })
    },

    tags: ['api']
  }
}
