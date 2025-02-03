<template>
  <el-container id="default-layout">
    <el-aside width="200px">
      <div v-for="item in users" :key="item.roomId">
        {{ item.name }}{{ item.status === false ? 'offline' : 'online' }}
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
  console.log(userStore.getUserList);
  debugger
  return userStore.getUserList
})

onMounted(() => {})
</script>

<style scoped lang="scss">
#default-layout {
  width: 100%;
  height: 100%;
}
</style>
