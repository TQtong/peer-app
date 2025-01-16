<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <nav>
    <RouterLink to="/">Home</RouterLink>
    <RouterLink to="/about" target="_blank">About</RouterLink>
  </nav>

  <RouterView />
</template>

<style scoped></style>
