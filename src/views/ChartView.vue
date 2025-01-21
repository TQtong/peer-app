<template>
  <div id="chart">
    <div class="chart1">
      <MyChart></MyChart>
    </div>
    <div class="chart2">
      <OtherChart />
    </div>
  </div>
</template>

<script setup lang="ts">
import MyChart from './MyChart.vue'
import OtherChart from './OtherChart.vue'
</script>

<style scoped lang="scss">
#chart {
  display: grid;
  grid-template-columns: 1fr 1fr;
}
</style>
