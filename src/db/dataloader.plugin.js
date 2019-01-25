import DataLoader from 'dataloader'

const property = 'dataloader'

/**
 * --------------------------------------------------------------------------------
 * *NOTE* - This is universally available dataloader instead of request-based.
 * --------------------------------------------------------------------------------
 */

export default (Schema) => {
  Schema.statics.getDataLoader = function () {
    if (!Schema[property]) {
      Object.defineProperty(Schema, property, {
        configurable: false,
        enumerable: false,
        writable: false,
        value: new DataLoader(
          ids => this.find({ _id: { $in: ids } })
        )
      })
    }
    return Schema[property]
  }

  Schema.statics.clear = function (id) {
    this.getDataLoader().clear(id)
  }

  Schema.statics.clearAll = function () {
    this.getDataLoader().clearAll()
  }

  Schema.statics.load = async function (id) {
    return this.getDataLoader().load(id)
  }

  Schema.statics.loadMany = async function (ids) {
    return this.getDataLoader().loadMany(ids)
  }
}
