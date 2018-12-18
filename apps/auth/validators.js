import joi from 'joi'
import Boom from 'boom'

export const login = {
  payload: {
    username: joi.string().min(6).email().required(),
    password: joi.string().min(6).required()
  },
  failAction: () => {
    throw Boom.badRequest()
  }
}
