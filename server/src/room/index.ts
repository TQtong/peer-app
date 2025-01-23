import { Socket } from "socket.io";

export const roomHandler = (socket: Socket) => { 
  socket.on("joinRoom", () => {
    console.log("joinRoom");
  })
}