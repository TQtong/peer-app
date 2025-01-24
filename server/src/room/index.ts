import { Socket } from "socket.io";
import {v4 as uuidv4} from "uuid";

export const roomHandler = (socket: Socket) => {
  // create room
  socket.on("createRoom", () => {
    const roomId = uuidv4()
    socket.emit("roomCreated", roomId)
  })

  socket.on("joinRoom", (roomId: string) => {
    console.log(`User ${socket.id} joined room ${roomId}`);
    socket.join(roomId)
  })
}