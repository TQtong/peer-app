import { Socket } from "socket.io";
import {v4 as uuidv4} from "uuid";

export const roomHandler = (socket: Socket) => {
  // create room
  socket.on("createRoom", () => {
    const roomId = uuidv4()
    socket.join(roomId)
    socket.emit("roomCreated", roomId)
  })
}