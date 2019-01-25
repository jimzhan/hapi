import mongoose from 'mongoose'
import * as db from '../../db'
import * as consts from './consts'

const { actions } = consts

describe('apps.auth.models', () => {
  let models
  beforeAll(() => {
    jest.setTimeout(10000)
    models = db.register()
    db.connect()
  })

  afterAll(() => {
    db.disconnect()
  })

  afterEach(async () => {
    await models.Group.deleteMany({ name: /^\w{24}$/ })
    await models.Permission.deleteMany({ resource: /^test-/ })
    await models.Permission.deleteMany({ resource: /^\w{24}$/ })
  })

  describe('Group', () => {
    it('creates a new Group', async () => {
      const resource = db.Key()
      const permissions = await models.Permission.create([
        { action: actions.createAny, resource, attributes: ['*'] },
        { action: actions.updateAny, resource, attributes: ['*'] }
      ])
      const group = await models.Group.create({
        name: db.Key(),
        permissions: permissions.map(item => item._id)
      })
      expect(permissions.length).toBe(2)
      expect(typeof group._id).toBe('object')
      expect(typeof group.id).toBe('string')
      expect(group.id.length).toBe(24)
      expect(group.permissions.length).toBe(2)

      const access = await group.access()
      expect(access).toBeTruthy()

      const yes = await group.can(actions.createAny, resource)
      expect(yes).toBeTruthy()
    })

    it('get AccessControl from group', async () => {
      const resource = db.Key()
      const permissions = await models.Permission.create([
        { action: actions.createAny, resource, attributes: ['*'] },
        { action: actions.updateAny, resource, attributes: ['*'] }
      ])
      const group = await models.Group.create({
        name: db.Key(),
        permissions: permissions.map(item => item._id)
      })
      const acl = await group.access()
      const canCreateAny = await group.can(actions.createAny, resource)
      const canUpdateAny = await group.can(actions.updateAny, resource)
      expect(acl).not.toBeFalsy()
      expect(canCreateAny).toBeTruthy()
      expect(canUpdateAny).toBeTruthy()
    })
  })

  describe('Permission', () => {
    it('creates a new Permission', async () => {
      const permission = await models.Permission.create({
        action: actions.createAny,
        resource: 'test-example',
        attributes: ['*']
      })
      expect(typeof permission._id).toBe('object')
      expect(typeof permission.id).toBe('string')
      expect(permission.id.length).toBe(24)
    })

    it('failed to create a duplicated Permission record', async () => {
      const permission = await models.Permission.create({
        action: actions.createAny,
        resource: 'test-example',
        attributes: ['*']
      })
      expect(permission.id.length).toBe(24)
      try {
        await models.Permission.create({
          action: actions.createAny,
          resource: 'test-example',
          attributes: ['*']
        })
      } catch (ex) {
        expect(ex).not.toBeFalsy()
      }
    })

    it('loads an existing Permission record via `loader`', async () => {
      const permission = await models.Permission.create({
        action: actions.createAny,
        resource: 'test-example',
        attributes: ['*']
      })
      const record = await models.Permission.load(permission.id)
      expect(record).toBeTruthy()
      expect(record.id).toBe(permission.id)
    })

    it('updates an existing Permission record', async () => {
      const permission = await models.Permission.create({
        action: actions.createAny,
        resource: 'test-example',
        attributes: ['*']
      })
      const record = await models.Permission.load(permission.id)
      record.action = actions.createOwn
      await record.save()
      expect(record.id).toBe(permission.id)
      expect(record.action).not.toBe(permission.action)
      expect(record.resource).toBe(permission.resource)
    })

    it('delete an existing Permission record', async () => {
      const { id } = await models.Permission.create({
        action: actions.createAny,
        resource: 'test-example',
        attributes: ['*']
      })
      await models.Permission.deleteOne({ _id: id })
      const record = await models.Permission.findById(id)
      expect(record).toBeFalsy()
    })

    it('upsert many permissions', async () => {
      const permission = await models.Permission.create({
        action: actions.createAny,
        resource: 'test-x',
        attributes: ['*']
      })

      const newId = mongoose.Types.ObjectId()
      const { insertedCount, modifiedCount } = await models.Permission.bulkWrite([
        {
          insertOne: {
            document: Object.assign(permission.toObject(), {
              _id: newId,
              resource: 'test-b'
            })
          }
        },
        {
          updateOne: {
            filter: { _id: permission._id },
            update: { resource: 'test-a' }
          }
        }
      ])
      const a = await models.Permission.findById(permission._id)
      const b = await models.Permission.findById(newId)
      expect(insertedCount).toBe(1)
      expect(modifiedCount).toBe(1)
      expect(a.resource).toBe('test-a')
      expect(b.resource).toBe('test-b')
    })
  })
})
