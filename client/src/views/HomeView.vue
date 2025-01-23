<template>
  <div id="home">
    <el-input :value="roomId" />
    <el-button @click="handleClick">
      <RouterLink to="/room">create room</RouterLink>
    </el-button>
  </div>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { ref } from 'vue'
import { useRoomStore } from '@/stores/room'

const roomId = ref()
const roomStroe = useRoomStore()

const handleClick = () => {
  window.scoket.emit('createRoom')
}

window.scoket.on('roomCreated', (roomId) => {
  console.log(roomId);
  roomStroe.setRoomId(roomId)
})

</script>

<style scoped lang="scss">

</style>