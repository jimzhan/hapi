import DataLoader from 'dataloader'

const dataloader = (Schema) => {
  let dataloader
  Schema.statics.getDataLoader = function () {
    if (!dataloader) {
      dataloader = new DataLoader(
        ids => this.find({ _id: { $in: ids } })
      )
    }
    return dataloader
  }

  Schema.statics.load = async function (id) {
    return this.getDataLoader().load(id)
  }

  Schema.statics.loadMany = async function (ids) {
    return this.getDataLoader().loadMany(ids)
  }
}

export default dataloader
