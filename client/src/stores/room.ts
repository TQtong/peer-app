import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useRoomStore = defineStore('room', {
  state: () => ({
    roomId: ''
  }),
  getters: {
    getRoomId: (state) => state.roomId
  },
  actions: {
    setRoomId(id:string) {
      this.roomId = id
    }
  },
})
