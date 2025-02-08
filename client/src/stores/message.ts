import { defineStore } from 'pinia'

import { type IMessage } from '@/interfaces/chart'

export const useMessageStore = defineStore('message', {
  state: () => ({
    messageList: [] as IMessage[],
  }),
  getters: {
    getMessageList: (state) => state.messageList
  },
  actions: {
    addMessage(message: IMessage) {
      this.messageList.push(message)
    }
  },
})
