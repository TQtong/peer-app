import express from 'express'
import { ExpressPeerServer } from 'peer'
import fs from 'fs'
import https from 'https'
import { Server } from 'socket.io'
// =======

// const server = app.listen(9000)

// const peerServer = ExpressPeerServer(server, {
//   path: '/',
//   ssl: {
//     key: fs.readFileSync('./localhost-key.pem'),
//     cert: fs.readFileSync('./localhost.pem'),
//   },
// })

// app.use('/myapp', peerServer)

// peerServer.on('connection', (client) => {
//   // console.log('client', client)

//   console.log('Client connected:', client.id)
//   client.send('Hello from server!')
// })

// == OR ==
const app = express()

const server = https.createServer(
  {
    key: fs.readFileSync('./192.168.4.28-key.pem'),
    cert: fs.readFileSync('./192.168.4.28.pem'),
  },
  app,
)

// use express static to deliver resources HTML, CSS, JS, etc)
// from the public folder
app.use(express.static('public'))

const peerServer = ExpressPeerServer(server, {
  debug: true,
})

app.use('/peerjs', peerServer)

peerServer.on('connection', (client) => {
  console.log('Client connected:', client.id)
  client.send('Hello from server!')
})

const socketio = new Server(server, {
  cors: {
    origin: '*',
  },
  perMessageDeflate: false,
})

socketio.on('connection', (socket) => {
  console.log('a user connected')

  socket.on('disconnect', () => {
    console.log('user disconnected')
  })
  socket.on('message', (msg) => {
    console.log(msg) //你好 后台
    //注意 ： 这里的 io.emit() 是默认转发给全部客户端信息，所有客户端都可以收到
    socketio.emit('allMsg', '广播 : 欢迎来到聊天室')
  })

  socket.on('call-user', (data) => {
    console.log(`call-user event from ${data.callerID} to ${data.userID}`)
    socket.to(data.userID).emit('call-made', {
      offer: data.offer,
      callerID: data.callerID,
    })
  })

  socket.on('make-answer', (data) => {
    console.log(`make-answer event from ${data.calleeID} to ${data.callerID}`)
    socket.to(data.callerID).emit('answer-made', {
      answer: data.answer,
      calleeID: data.calleeID,
    })
  })

  socket.on('reject-call', (data) => {
    console.log(`reject-call event from ${data.calleeID} to ${data.callerID}`)
    socket.to(data.callerID).emit('call-rejected', {
      calleeID: data.calleeID,
    })
  })

  socket.on('user-connected', (userID) => {
    console.log(`user-connected event for ${userID}`)
    socket.broadcast.emit('user-connected', userID)
  })

  socket.on('user-disconnected', (userID) => {
    console.log(`user-disconnected event for ${userID}`)
    socket.broadcast.emit('user-disconnected', userID)
  })
})

app.get('/', (req, res, next) => res.redirect('/index.html'))
server.listen(3000, () => console.log('listening on *:3000'))
