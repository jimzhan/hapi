import bcrypt from 'bcrypt'

/**
 * ------------------------------------------------------------------------------------------
 * models of this `auth` module follows `RBAC` pricinple with following relationship:
 *  1) user has roles.
 *  2) role includes permissions.
 *  3) permission includes resource, actions and attributes of resource that can be performed.
 * ------------------------------------------------------------------------------------------
 */
export default (mongoose) => {
  const { Schema } = mongoose

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

  return mongoose.model('User', UserSchema)
}
