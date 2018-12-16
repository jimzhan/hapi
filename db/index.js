import { ObjectId } from 'bson'
import { connect, disconnect } from './connection'
import DataLoader from './DataLoader.plugin'

export const Key = () => (new ObjectId()).toHexString()

export const plugins = {
  DataLoader
}
export {
  connect,
  disconnect
}