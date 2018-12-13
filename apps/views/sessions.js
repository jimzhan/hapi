import joi from 'joi'
import Boom from 'boom'
// ----------------------------------------------------------------------
//  RESTful style user login/logout on top of session cookie.
// ----------------------------------------------------------------------
export const create = {
  auth: false,

  validate: {
    payload: {
      username: joi.string().min(6).email().required(),
      password: joi.string().min(6).required()
    },
    failAction: (request, h) => {
      throw Boom.badRequest()
    }
  },
  handler: async (request, h) => {
    return h.response({ data: 'token' })
  },

  tags: ['api']
}

export const remove = {
  auth: false,

  handler: async (request, h) => {
    return h.response({ data: 'logout' })
  },

  tags: ['api']
}
