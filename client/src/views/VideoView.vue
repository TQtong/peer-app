<template>
  <video ref="video" autoplay />
</template>

<script setup lang="ts">
import { useTemplateRef, ref, onMounted, defineProps, watch } from 'vue'

const props = defineProps({
  stream: {
    type: MediaStream,
    default: null,
  },
})

const video = useTemplateRef<HTMLVideoElement>('video')

watch(
  () => props.stream,
  (newStream) => {
    if (video.value) {
      video.value.srcObject = newStream
    }
  }
)
</script>

<style scoped lang="scss"></style>
