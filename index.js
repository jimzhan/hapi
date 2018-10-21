import Glue from 'glue'
import manifest from './manifest'

const start = async () => {
  try {
    const server = await Glue.compose(manifest, { relativeTo: __dirname })
    await server.start()
    console.log('Server is listening on', server.info.uri)
  } catch (err) {
    console.error('Error occoured when starting server:', err.message)
    process.exit(1)
  }
}

start()
