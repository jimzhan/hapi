import { ObjectId } from 'bson'

export const Key = () => (new ObjectId()).toHexString()
