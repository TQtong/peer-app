import { Socket } from 'socket.io'
import { v4 as uuidv4 } from 'uuid'


interface IUser {
  userId: string
  peerId: string
  name: string
  status: boolean
}

let roomList: IUser[] = []

export const roomHandler = (socket: Socket) => {
  // create user
  socket.on('createRoom', () => {
    const userId = uuidv4()
    console.log(userId)
    socket.emit('userCreated', userId)
  })

  // join room
  socket.on('joinRoom', (room: IUser) => {
    roomList.push(room)
    socket.join(room.userId)
    socket.emit('userJoined', room)
    console.log('user is connected', roomList.length)
    socket.emit('addUsers', roomList)

    // disconnect(leave room)
    socket.on('disconnect', () => {
      roomList = roomList.filter((targetRoom) => targetRoom.userId !== room.userId)
      socket.to(room.userId).emit('user-disconnected', room)
      console.log('user is disconnected', roomList.length)
    })
  })

  socket.on('start-sharing', (peerId:string) => {
    socket.emit('user-started-sharing', peerId)
  })

  socket.on('stop-sharing', () => {
    socket.emit('user-stopped-sharing')
  })
}
