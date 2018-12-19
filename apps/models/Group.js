import lodash from 'lodash'
import AccessControl from 'accesscontrol'
import { actions } from '../auth/consts'

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

  return mongoose.model('Group', GroupSchema)
}
