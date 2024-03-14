import express, { Express } from 'express'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import { config } from 'dotenv'
import { connectDB } from './db/dbConfiguration'
import { routesInit } from './routes/config.routes'
import { SECRET } from './constant/constant'
import logger from './lib/logger'
import { createServer } from 'http'
import createSocket from './lib/socket/socket'

const bootstrap = async (): Promise<void> => {
  config()

  const app: Express = express()
  app.use(express.json())
  app.use(cookieParser())
  const port = SECRET.PORT
  await connectDB()
  app.use(
    cors({
      origin: 'http://localhost:3000', // You can configure this based on your needs
      credentials: true
    })
  )

  routesInit(app)

  const server = createServer(app)

  // Create and attach the Socket.io server to the HTTP server
  createSocket(server)

  server.listen(port, () => {
    logger.debug(`⚡️[server]: Server is running at http://localhost:${port}`)
  })
}

void bootstrap()
