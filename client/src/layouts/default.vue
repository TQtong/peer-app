<template>
  <el-container id="default-layout">
    <el-aside width="200px">
      <div v-for="item in users" :key="item.userId">
        <h1 class="title">{{ item.name }}</h1>
        <h1 class="title">{{ item.peerId }}</h1>
        <div
          class="status"
          :class="{ offline: item.status === false, online: item.status === true }"
        >
          {{ item.status === false ? 'offline' : 'online' }}
        </div>
        <el-button type="primary" @click="handleCall(item.peerId)">Call</el-button>
        <el-button type="primary" @click="handleVideo(item.peerId, item.userId)">Video</el-button>
        <el-button type="primary" @click="handleScreen(item.peerId, item.userId)">Screen</el-button>
      </div>
    </el-aside>
    <el-main>
      <RouterView />
    </el-main>
  </el-container>
</template>

<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { RouterView } from 'vue-router'

import { useUserStore } from '@/stores/user'

const userStore = useUserStore()

const users = computed(() => {
  return userStore.getUserList
})

const handleCall = (peerId: string) => {
  const currentUser = userStore.currentUser
  const stream = userStore.localStream
  const call = currentUser.instantiate?.call(peerId, stream as MediaStream)

  call?.on('stream', function (peerStream) {
    userStore.otherStream = peerStream
  })
}

const handleScreen = (peerId: string, userId:string) => {
  navigator.mediaDevices.getDisplayMedia({}).then((stream) => {
    userStore.setLocalStream(stream)
    reserConnection()
    window.scoket.emit('start-sharing',...[peerId, userId])
  })
}

const handleVideo = (peerId: string, userId:string) => {
  navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
    userStore.setLocalStream(stream)
    reserConnection()
    window.scoket.emit('stop-sharing', userId)
  })
  // handleCall(peerId)
  
}

//todo: this function just replace video track, need to replace screen track
const reserConnection = () => {
  const currentUser = userStore.currentUser
  const stream = userStore.localStream

  Object.values(currentUser.instantiate?.connections).forEach((connection) => {
    
    const videoTrack = stream?.getTracks().find((track) => track.kind === 'video')

    connection[0].peerConnection.getSenders()[0].replaceTrack(videoTrack)
  })
}

onMounted(() => {})
</script>

<style scoped lang="scss">
#default-layout {
  width: 100%;
  height: 100%;

  .title {
    font-weight: bold;
  }

  .status {
    font-size: 12px;
  }
}

.offline {
  color: red;
}

.online {
  color: green;
}
</style>
