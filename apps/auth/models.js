import mongoose from 'mongoose'
import { actions } from './consts'

const { Schema } = mongoose

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
PermissionSchema.index({ action: 1, attributes: 1, resource: 1 }, { unique: true })

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

const UserSchema = new Schema({
  roles: [{
    ref: 'Role',
    required: true,
    type: Schema.Types.ObjectId
  }]
})

export const User = mongoose.model('User', UserSchema)
export const Role = mongoose.model('Role', RoleSchema)
export const Permission = mongoose.model('Permission', PermissionSchema)
