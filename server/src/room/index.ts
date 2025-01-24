import { Socket } from "socket.io";
import { v4 as uuidv4 } from "uuid";

interface IPeer {
  id: string
  name: string
}

interface IRoom {
  roomId: string
  users: IPeer[]
}

const roomList:IRoom[] = []

export const roomHandler = (socket: Socket) => {
  // create room
  socket.on("createRoom", () => {
    const roomId = uuidv4()
    socket.emit("roomCreated", roomId)
  })

  // join room
  socket.on("joinRoom", (room: IRoom) => {
    console.log(`User ${socket.id} joined room ${room.roomId}`);
    roomList.push(room)
    socket.join(room.roomId)
  })
}