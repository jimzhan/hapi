// ----------------------------------------------------------------------
//  RESTful style user login/logout on top of session cookie.
// ----------------------------------------------------------------------
export const login = async (request, h) => {
  return h.response({ data: 'token' })
}

export const logout = async (request, h) => {
  return h.response({ data: 'logout' })
}
