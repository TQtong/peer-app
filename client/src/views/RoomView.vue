<template>
  <div id='room'>
    <h1>This is room id: {{ roomId }}</h1>
  </div>
</template>

<script setup lang="ts">
import { useRoomStore } from '@/stores/room';

const roomStore = useRoomStore()

const roomId = roomStore.getRoomId

</script>

<style scoped lang="scss">
#room {
  display: flex;
  align-items: center;
}
</style>