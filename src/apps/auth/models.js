import bcrypt from 'bcrypt'
import lodash from 'lodash'
import mongoose from 'mongoose'
import AccessControl from 'accesscontrol'
import { actions } from './consts'

// ------------------------------------------------------------------------------------------
// models of this `auth` module follows `RBAC` pricinple with following relationship:
//  1) user has roles.
//  2) role includes permissions.
//  3) permission includes resource, actions and attributes of resource that can be performed.
// ------------------------------------------------------------------------------------------
// Intro.
//  - `action` - the actions can be performed on an `object`. There are two action-attributes
//                which define the possession of the resource: `own` and `any`.
//  - `attributes` - `object`'s attributes for finer ACL, `[*]` by default.
//  - `resource` - is the resource that you can perform CRUD on.
// ------------------------------------------------------------------------------------------

const { Schema } = mongoose

const GroupSchema = new Schema({
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
 * Setup `AccessControl` instance for the given group.
 * ------------------------------------------------------------------------------------------
 * @param {String} action - scoped action to perform on the resource. @SEE `consts.Actions`.
 * @param {String} resource - actual name of the resource to the given action.
 * ------------------------------------------------------------------------------------------
 * @SEE {https://github.com/Automattic/mongoose/issues/5057} for N/A of arrow function.
 * @SEE {http://onury.github.io/accesscontrol/?api=ac} for finer control.
 */
GroupSchema.methods.access = async function (action = null, resource = null) {
  if (!this.permissions) return null
  const Permission = mongoose.model('Permission')
  const permissions = await Permission.loadMany(this.permissions)
  // convert `Array based permissions to `Map` based.
  const mappings = permissions.reduce(
    (result, v) => lodash.merge(result, { [v.resource]: { [v.action]: v.attributes } }),
    {}
  )
  const gid = this.id
  const access = new AccessControl({ [gid]: mappings }).can(gid)
  if (action && resource) {
    // Match detailed action type with corresponding `accesscontrol` function.
    const func = lodash.findKey(
      actions.toJS(),
      lodash.partial(lodash.isEqual, action)
    )
    return (func in access) && access[func](resource)
  }
  return access
}

/**
 * ------------------------------------------------------------------------------------------
 * Shortcut to check whether current role can perform the given scoped action on the resource.
 * ------------------------------------------------------------------------------------------
 * @param {String} action - scoped action to perform on the resource. @SEE `consts.Actions`.
 * @param {String} resource - actual name of the resource to the given action.
 * ------------------------------------------------------------------------------------------
 * @SEE {https://github.com/Automattic/mongoose/issues/5057} for N/A of arrow function.
 * @SEE {http://onury.github.io/accesscontrol/?api=ac} for finer control.
 */
GroupSchema.methods.can = async function (action, resource) {
  const acl = await this.access(action, resource)
  return acl && acl.granted
}

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
  resource: {
    type: String,
    required: true
  }
})

PermissionSchema.index({
  action: 1,
  attributes: 1,
  resource: 1
}, {
  unique: true
})

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

mongoose.model('Group', GroupSchema)
mongoose.model('Permission', PermissionSchema)
mongoose.model('User', UserSchema)
