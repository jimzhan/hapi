import lodash from 'lodash'
import mongoose from 'mongoose'
import AccessControl from 'accesscontrol'
import { actions } from '../consts'

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
 * Shortcut to check whether current role can perform the given scoped action on the resource.
 * ------------------------------------------------------------------------------------------
 * @param {String} action - scoped action to perform on the resource. @SEE `consts.Actions`.
 * @param {String} resource - actual name of the resource to the given action.
 * @param {Array} attributes - resource's attributes to be limited.
 * ------------------------------------------------------------------------------------------
 * @SEE {https://github.com/Automattic/mongoose/issues/5057} for N/A of arrow function.
 * @SEE {http://onury.github.io/accesscontrol/?api=ac} for finer control.
 */
GroupSchema.methods.can = async function (action, resource, attributes = ['*']) {
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

export default mongoose.model('Group', GroupSchema)
