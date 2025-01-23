/// <reference types="vite/client" />
import {Socket} from 'socket.io-client'

declare global{
  interface Window {
    scoket: Socket
  }
}