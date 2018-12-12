import joi from 'joi'

export const login = {
  auth: false,

  validate: {
    payload: {
      username: joi.string().min(3).email().required(),
      password: joi.string().min(5).required()
    },
    failAction: (request, h, error) => {
      return h.response({ message: error.details[0].message.replace(/['"]+/g, '') }).code(400).takeover()
    }
  },
  handler: async (request, h) => {
    return h.response({ data: 'jim' })
  },

  tags: ['api']
}
