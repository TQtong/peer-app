<template>
  <div id="home">
    <el-input :value="userId" />
    <el-button @click="handleClick">
      <RouterLink to="/room">create room</RouterLink>
    </el-button>
  </div>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { ref } from 'vue'
import { useUserStore } from '@/stores/user'

const userId = ref()
const roomStroe = useUserStore()

const handleClick = () => {
  window.scoket.emit('createRoom')
}

window.scoket.on('userCreated', (userId) => {
  roomStroe.setUserId(userId)
})

</script>

<style scoped lang="scss">

</style>