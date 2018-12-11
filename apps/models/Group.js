import lodash from 'lodash'
import mongoose from 'mongoose'
import AccessControl from 'accesscontrol'
import { actions } from '../consts'
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
 * Setup `AccessControl` instance for the given group..
 * ------------------------------------------------------------------------------------------
 * @SEE {https://github.com/Automattic/mongoose/issues/5057} for N/A of arrow function.
 * @SEE {http://onury.github.io/accesscontrol/?api=ac} for finer control.
 */
GroupSchema.methods.access = async function () {
  if (!this.permissions) return null
  await this.populate('permissions').execPopulate()
  // convert `Array based permissions to `Map` based.
  const mappings = this.permissions.reduce(
    (result, v) => lodash.merge(result, { [v.role]: { [v.resource]: { [v.action]: v.attributes } } }),
    {}
  )
  const gid = this.id
  return new AccessControl({ [gid]: mappings }).can(gid)
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
  // Match detailed action type with corresponding `accesscontrol` function.
  const func = lodash.findKey(
    actions.toJS(), lodash.partial(lodash.isEqual, action)
  )
  const acl = await this.access(action, resource)
  return (func in acl) ? acl[func](resource).granted : false
}

GroupSchema.plugin(plugins.dataloader)

export default mongoose.model('Group', GroupSchema)
