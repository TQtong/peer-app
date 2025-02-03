import { ref } from 'vue'
import { defineStore } from 'pinia'

import { type IUser } from '@/interfaces/user'

export const useUserStore = defineStore('user', {
  state: () => ({
    currentUser: ref<IUser>(
      {
        roomId: '',
        name: '',
        status: false,
        peerId: '',
        instantiate: null
      }
    ),
    userList: ref<IUser[]>([])
  }),
  getters: {
    getCurrentRoomId: (state) => state.currentUser.roomId,
    getUserList: (state) => state.userList
  },
  actions: {
    setRoomId(id:string) {
      this.userList.push({
        roomId: id,
        name: '',
        status: false,
        peerId: '',
        instantiate: null
      })
      this.currentUser = this.userList.find((room) => room.roomId === id) as IUser
    },
    setUser(user: IUser) {
      this.currentUser.peerId = user.peerId
      this.currentUser.name = user.name
      this.currentUser.instantiate = user.instantiate
    }
  },
})
