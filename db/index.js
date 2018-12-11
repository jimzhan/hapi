import mongoose from 'mongoose'
import settings from '../settings'
import dataloader from './dataloader.plugin'

export const plugins = {
  dataloader
}

// ----------------------------------------------------------------------

export const connect = (options = {}) => {
  mongoose.connection.on('connected', () => {
    console.log(`connected to <mongodb: ${settings.db.uri}`)
  })

  mongoose.connection.on('disconnected', () => {
    console.log(`disconnected from <mongodb: ${settings.db.uri}`)
  })

  mongoose.connection.on('error', () => {
    throw new Error(`failed to connect to <mongodb: ${settings.db.uri}`)
  })

  process.on('SIGINT', () => {
    mongoose.connection.close(() => {
      console.log(`connection to <mongodb: ${settings.db.uri} closed`)
    })
  })

  mongoose.connect(settings.db.uri, Object.assign({
    keepAlive: true,
    useNewUrlParser: true
  }, options))
}

export const disconnect = () => mongoose.disconnect()
