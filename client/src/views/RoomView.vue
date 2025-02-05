<template>
  <div id="room">
    <h1>This is room id: {{ userId }}</h1>
    <VideoView :stream="userStore.localStream" />
    <VideoView :stream="userStore.otherStream" />
  </div>
</template>

<script setup lang="ts">
import { Peer } from 'peerjs'
import { v4 as uuidv4 } from 'uuid'

import VideoView from './VideoView.vue'
import { useUserStore } from '@/stores/user'
import { type IUser } from '@/interfaces/user'

const userStore = useUserStore()

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
</script>

<style scoped lang="scss">
//#room {
//  display: flex;
//  align-items: center;
//}

:deep(.el-input) {
  width: 300px;
}
</style>
