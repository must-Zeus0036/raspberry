import { app } from './src/express.js'
import { db } from './src/database.js'

const port = process.env.PORT || 3000
const server = app.listen(port, () => {
  console.log(`Server started on port ${port}`)
})

server.on('error', (err) => {
  console.error(`Server error: ${err}`);
})

async function shutdown () {
  server.close()
  await db.end()
}

process.on('SIGINT', shutdown)
process.on('SIGTERM', shutdown)
