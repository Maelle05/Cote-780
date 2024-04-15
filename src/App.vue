<script setup>
import { webgl } from './webgl/webgl'
import { ref, onMounted } from 'vue'

const canvas = ref(null)

onMounted(() => {
  const scene = new webgl(canvas.value)
})

</script>

<template>
  <canvas ref="canvas"></canvas>
</template>

<style scoped lang="scss">

canvas {
  width: 100%;
  height: 100vh;
  background-color: red;
}

</style>
