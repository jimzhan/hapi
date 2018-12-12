import mongoose from 'mongoose'
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

PermissionSchema.plugin(plugins.DataLoader)

export default mongoose.model('Permission', PermissionSchema)
