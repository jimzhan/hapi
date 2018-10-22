import mongoose from 'mongoose'

const { disconnect } = mongoose

const connect = (uri) => {
  mongoose.Promise = global.Promise
  mongoose.connection.on('error', () => {
    throw new Error(`unable to connect to database: ${uri}`)
  })
  mongoose.connect(uri, { server: { socketOptions: { keepAlive: 1 } } })
}

export { connect, disconnect }
