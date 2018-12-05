import bcrypt from 'bcrypt'
import lodash from 'lodash'
import mongoose from 'mongoose'
import AccessControl from 'accesscontrol'
import { actions } from './consts'

const { Schema } = mongoose

/**
 * ------------------------------------------------------------------------------------------
 * models of this `auth` module follows `RBAC` pricinple with following relationship:
 *  1) user has roles.
 *  2) role includes permissions.
 *  3) permission includes resource, actions and attributes of resource that can be performed.
 * ------------------------------------------------------------------------------------------
 */

// ------------------------------------------------------------------------------------------
// Intro.
//  - `action` - the actions can be performed on an `object`. There are two action-attributes
//                which define the possession of the resource: `own` and `any`.
//  - `attributes` - `object`'s attributes for finer ACL, `[*]` by default.
//  - `resource` - is the resource that you can perform CRUD on.
// ------------------------------------------------------------------------------------------
const PermissionSchema = Schema({
  action: {
    type: String,
    required: true,
    enum: Object.values(actions.toJS())
  },
  attributes: {
    type: Array,
    required: true,
    default: ['*']
  },
  resource: { type: String, required: true }
})

const RoleSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  permissions: [{
    ref: 'Permission',
    required: true,
    type: Schema.Types.ObjectId
  }]
})

/**
 * ------------------------------------------------------------------------------------------
 * Shortcut to check whether current role can perform the given scoped action on the resource.
 * ------------------------------------------------------------------------------------------
 * @param {String} action - scoped action to perform on the resource. @SEE `consts.Actions`.
 * @param {String} resource - actual name of the resource to the given action.
 * @param {Array} attributes - resource's attributes to be limited.
 * ------------------------------------------------------------------------------------------
 * @SEE {https://github.com/Automattic/mongoose/issues/5057} for N/A of arrow function.
 * @SEE {http://onury.github.io/accesscontrol/?api=ac} for finer control.
 */
RoleSchema.methods.can = async function (action, resource, attributes = ['*']) {
  this.populate('permissions')
  // convert `Array based permissions to `Map` based.
  const permissions = this.permissions.reduce(
    (result, v) => lodash.merge(result, { [v.role]: { [v.resource]: { [v.action]: [v.attributes] } } }),
    {}
  )
  // Match detailed action type with corresponding `accesscontrol` function.
  const func = lodash.findKey(
    actions.toJS(), lodash.partial(lodash.isEqual, action)
  )
  const acl = new AccessControl({ [this.name]: permissions }).can(this.name)
  return (func in acl) ? acl[func](resource, attributes).granted : false
}

const UserSchema = new Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  roles: [{
    ref: 'Role',
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

// --------------------------------------------------------------------------------
// Building indexes.
// --------------------------------------------------------------------------------
PermissionSchema.index({ action: 1, attributes: 1, resource: 1 }, { unique: true })

// --------------------------------------------------------------------------------
// Registering Models.
// --------------------------------------------------------------------------------
export const User = mongoose.model('User', UserSchema)
export const Role = mongoose.model('Role', RoleSchema)
export const Permission = mongoose.model('Permission', PermissionSchema)
