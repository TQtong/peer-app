import { Socket } from 'socket.io'
import { v4 as uuidv4 } from 'uuid'

interface IPeer {
  peerId: string
  name: string
}

interface IRoom {
  roomId: string
  users: IPeer
}

let roomList: IRoom[] = []

export const roomHandler = (socket: Socket) => {
  // create room
  socket.on('createRoom', () => {
    const roomId = uuidv4()
    socket.emit('roomCreated', roomId)
  })

  // join room
  socket.on('joinRoom', (room: IRoom) => {
    roomList.push(room)
    socket.join(room.roomId)
    socket.emit('userJoined', {...room.users, length: roomList.length})
    

    // disconnect
    socket.on('disconnect', () => {
      roomList = roomList.filter((targetRoom) => targetRoom.roomId !== room.roomId)
      socket.to(room.roomId).emit('user-disconnected', room)
      console.log('user is disconnected', roomList.length)
    })
  })
}
