import { Socket } from 'socket.io'
import { v4 as uuidv4 } from 'uuid'


interface IUser {
  roomId: string
  peerId: string
  name: string
  status: boolean
}

let roomList: IUser[] = []

export const roomHandler = (socket: Socket) => {
  // create room
  socket.on('createRoom', () => {
    const roomId = uuidv4()
    console.log(roomId)
    socket.emit('roomCreated', roomId)
  })

  // join room
  socket.on('joinRoom', (room: IUser) => {
    roomList.push(room)
    socket.join(room.roomId)
    socket.emit('userJoined', room)
    console.log('user is connected', roomList.length)
    socket.emit('addUsers', roomList)

    // disconnect
    socket.on('disconnect', () => {
      roomList = roomList.filter((targetRoom) => targetRoom.roomId !== room.roomId)
      socket.to(room.roomId).emit('user-disconnected', room)
      console.log('user is disconnected', roomList.length)
    })
  })
}
