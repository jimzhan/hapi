import bcrypt from 'bcrypt'
import mongoose from 'mongoose'
import { plugins } from '../../db'

const { Schema } = mongoose

/**
 * ------------------------------------------------------------------------------------------
 * models of this `auth` module follows `RBAC` pricinple with following relationship:
 *  1) user has roles.
 *  2) role includes permissions.
 *  3) permission includes resource, actions and attributes of resource that can be performed.
 * ------------------------------------------------------------------------------------------
 */
const UserSchema = new Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  groups: [{
    ref: 'Group',
    required: true,
    type: Schema.Types.ObjectId
  }]
})

UserSchema.set('toJSON', {
  transform: (_, result) => {
    delete result.password
    return result
  }
})

/**
 * Pre-save hook to bcrypt hashing - password.
 */
UserSchema.pre('save', function (next) {
  const user = this
  if (!user.isModified('password')) { return next() }
  bcrypt.hash(user.password, 10, (err, hash) => {
    if (err) { return next(err) }
    user.password = hash
    next()
  })
})

UserSchema.plugin(plugins.DataLoader)

export default mongoose.model('User', UserSchema)
