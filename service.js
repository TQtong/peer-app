import express from 'express'
import { ExpressPeerServer } from 'peer'

const app = express()

app.get('/', (req, res, next) => res.send('Hello world!'))

// =======

const server = app.listen(9000)

const peerServer = ExpressPeerServer(server, {
  path: '/',
  ssl: {
    key: './server.key',
    cert: './server.cert',
  },
})

app.use('/myapp', peerServer)

peerServer.on('connection', (client) => {
  // console.log('client', client)

  console.log('Client connected:', client.id)
  client.send('Hello from server!')
})

// == OR ==

// const http = require("http");

// const server = http.createServer(app);
// const peerServer = ExpressPeerServer(server, {
// 	debug: true,
// 	path: "/myapp",
// });

// app.use("/peerjs", peerServer);

// server.listen(9000);
