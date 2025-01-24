import express from 'express'
import https from 'https'
import fs from 'fs'
import { Server } from 'socket.io'
import cors from 'cors'

import { roomHandler } from './room'

const port = 3000
const app = express()
app.use(cors())
const server = https.createServer(
  {
    key: fs.readFileSync('./192.168.4.28-key.pem'),
    cert: fs.readFileSync('./192.168.4.28.pem'),
  },
  app,
)
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
})

io.on('connection', (socket) => {
  console.log('user is connected')
  roomHandler(socket)
})

server.listen(port, () => {
  console.log(`Server is running at https://localhost:${port}`)
})