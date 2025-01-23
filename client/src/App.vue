<template>
  <RouterView />
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'
import socketIO from 'socket.io-client'

const WS = 'https://localhost:3000'

window.scoket =socketIO(WS)
</script>
