<script setup>
import { webgl } from "./webgl/webgl";
import Game from "./game/game";
import { ref, onMounted } from "vue";

const canvas = ref(null);
const container = ref(null);

onMounted(() => {
  const game = new Game(container.value);
  const scene = new webgl(canvas.value);
});
</script>

<template>
  <canvas ref="canvas"></canvas>
  <div class="container" ref="container">
    <div class="circle" ref="circle-1"></div>
    <div class="circle" ref="circle-2"></div>
  </div>
</template>

<style scoped lang="scss">
canvas {
  width: 100%;
  height: 100vh;
}

.container {
  position: absolute;
  right: 70px;
  bottom: 70px;
  width: 500px;
  height: 500px;
  pointer-events: none;
}
.circle {
  width: 60px;
  height: 60px;
  background-color: red;
  border-radius: 100%;
  position: absolute;
  opacity: 0;
  pointer-events: all;
}
</style>
