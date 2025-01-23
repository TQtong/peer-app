<template>
  <div id="home">
    <el-button @click="handleClick">hello world</el-button>
  </div>
</template>

<script setup lang="ts">


const handleClick = () => {
  window.scoket.emit('joinRoom')
}

</script>

<style scoped lang="scss">

</style>