import { ref } from 'vue'
import { defineStore } from 'pinia'

import { type IUser } from '@/interfaces/user'

export const useUserStore = defineStore('user', {
  state: () => ({
    currentUser: ref<IUser>(
      {
        userId: '',
        name: '',
        status: false,
        peerId: '',
        instantiate: null
      }
    ),
    userList: ref<IUser[]>([]),
    localStream: ref<MediaStream>(),
    otherStream: ref<MediaStream>(),
  }),
  getters: {
    getCurrentUserId: (state) => state.currentUser.userId,
    getUserList: (state) => state.userList
  },
  actions: {
    setUserId(id: string) {
      this.userList.push({
        userId: id,
        name: '',
        status: false,
        peerId: '',
        instantiate: null
      })
      this.currentUser = this.userList.find((user) => user.userId === id) as IUser
    },
    setUser(user: IUser) {
      this.currentUser.peerId = user.peerId
      this.currentUser.name = user.name
      this.currentUser.instantiate = user.instantiate
    },
    setLocalStream(stream: MediaStream) {
      this.localStream = stream
    },
    setOtherStream(stream: MediaStream) {
      this.otherStream = stream
    },
    addUser(user: IUser) {
      this.userList.push(user)
    },
    removeUser(user: IUser) {
      this.userList = this.userList.filter((target) => target.userId !== user.userId)
    }
  },
})
