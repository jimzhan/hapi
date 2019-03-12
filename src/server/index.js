import Glue from 'glue'
import exiting from 'exiting'
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
  const manager = exiting.createManager(server)

  await manager.start()
  await server.start()

  return server
}
