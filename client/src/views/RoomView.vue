<template>
  <div id="room">
    <h1>This is room id: {{ userId }}</h1>
    <div class="video-container" :class="{ screen: screenId ? true : false }">
      <VideoView class="video-view" :stream="userStore.localStream" />
      <VideoView class="video-view" :stream="userStore.otherStream" />
    </div>
    <div class="chart">
      <div class="chart-item" v-for="item in messageList" :key="item.timestamp">
        <h1>{{ item.author }}</h1>
        <p>{{item.content}}</p>
        <span>{{item.timestamp}}</span>
      </div>
      <div class="chart-input">
        <el-input v-model="message" />
        <el-button @click="handleSend">
          Send
        </el-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { Peer } from 'peerjs'
import { v4 as uuidv4 } from 'uuid'

import VideoView from './VideoView.vue'
import { useUserStore } from '@/stores/user'
import { useMessageStore } from '@/stores/message'
import { type IUser } from '@/interfaces/user'
import { type IMessage } from '@/interfaces/chart'

const userStore = useUserStore()
const messageStore = useMessageStore()

const userId = userStore.getCurrentUserId
const peerId = uuidv4()

const peer = new Peer(peerId)

const user: IUser = {
  userId: userId,
  peerId: peerId,
  name: 'test',
  instantiate: peer,
  status: true,
}

userStore.setUser(user)

window.scoket.emit('joinRoom', {
  userId,
  peerId: user.peerId,
  name: user.name,
  status: user.status,
})

navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
  userStore.setLocalStream(stream)
})

window.scoket.on('userJoined', (user: IUser) => {
  console.log(user)
  // console.log(roomStore.roomList)
  // if (localStream.value && peer) {
  //   debugger
  // }
})

window.scoket.on('addUsers', (users: IUser[]) => {
  users.forEach((user) => {
    const result = userStore.userList.find((item) => item.peerId === user.peerId)
    if (!result) {
      userStore.addUser(user)
    }
  })
})

peer.on('call', function (call) {
  call.answer(userStore.localStream)
  call.on('stream', function (peerStream) {
    userStore.setOtherStream(peerStream)
  })
})

const screenId = ref()

window.scoket.on('user-started-sharing', (peerId: string) => {
  screenId.value = peerId
})

window.scoket.on('user-stopped-sharing', () => {
  screenId.value = null
})

const message = ref('')

const messageList = computed(() => { 
  return messageStore.getMessageList
})

const handleSend = () => {

  messageStore.addMessage({
    content: message.value,
    author: userStore.currentUser.name,
    timestamp: new Date().getTime().toString(),
  })
  message.value = ''
}

</script>

<style scoped lang="scss">
#room {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
}

.video-container {
  display: grid;
  grid-template-columns: 1fr 1fr;

  .video-view {
    width: 100%;
    height: 100%;
  }
}

.chart {
  display: grid;
  grid-template-rows: 1fr 60px;
  .chart-item {
    color: cyan;
  }
}

:deep(.el-input) {
  width: 300px;
}

.screen {
  grid-template-columns: 100px 1fr;
}
</style>
