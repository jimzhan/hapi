import Glue from 'glue'
import manifest from './manifest'
import settings from '../settings'

export const compose = async () => {
  return Glue.compose(
    manifest,
    { relativeTo: settings.basedir }
  )
}

export const start = async () => {
  const server = await compose()
  await server.start()
  return server
}
