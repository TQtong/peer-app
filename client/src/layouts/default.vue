<template>
  <el-container id="default-layout">
    <el-aside width="200px">
      <div v-for="item in users" :key="item.userId">
        <h1 class="title">{{ item.name }}</h1>
        <h1 class="title">{{ item.peerId }}</h1>
        <div class="status" :class="{ 'offline': item.status === false, 'online': item.status === true }">{{ item.status === false ? 'offline' : 'online' }}</div>
        <el-button type="primary" @click="handleCall(item.peerId)">Call</el-button>
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
    font-size: 12px
  }
}

.offline {
  color: red;
}

.online {
  color: green;
}
</style>
