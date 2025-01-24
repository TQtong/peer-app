import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import {Peer} from 'peerjs'

interface IPeer {
  peerId: string
  name: string,
  instantiate: Peer
}

interface IRoom {
  roomId: string
  users: IPeer | null
}

export const useRoomStore = defineStore('room', {
  state: () => ({
    currentRoom: ref<IRoom>({
      roomId: '',
      users: null
    }),
    roomList: ref<IRoom[]>([])
  }),
  getters: {
    getCurrentRoomId: (state) => state.currentRoom.roomId,
  },
  actions: {
    setRoomId(id:string) {
      this.roomList.push({
        roomId: id,
        users: null
      })
      this.currentRoom = this.roomList.find((room) => room.roomId === id) as IRoom
    },
    setUser(user: IPeer) {
      this.currentRoom.users = user
    }
  },
})
