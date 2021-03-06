import { Record } from 'immutable'

export const actions = Record({
  createAny: 'create:any',
  createOwn: 'create:own',
  readAny: 'read:any',
  readOwn: 'read:own',
  updateAny: 'update:any',
  updateOwn: 'update:own',
  deleteAny: 'delete:any',
  deleteOwn: 'delete:own'
})()
