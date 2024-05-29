<script setup>
import { EVENTS } from "@/webgl/Constants/events";
import { INIT_SCENE } from "@/webgl/Constants/config";
import { state } from "../../webgl/Utils/State";
import { ref } from "vue";

let currentScene = ref(INIT_SCENE);

// functions that mutate state and trigger updates
function next() {
  currentScene.value = (currentScene.value + 1) % 8;
  state.emit(EVENTS.CHANGE_SCENE, currentScene.value);
}

function previous() {
  currentScene.value = (currentScene.value - 1) % 8;
  state.emit(EVENTS.CHANGE_SCENE, currentScene.value);
}

state.on(EVENTS.CHANGE_SCENE, (e) => {
  currentScene.value = e;
});
</script>

<template>
  <div class="wrapper">
    <button @click="previous">Go previous scene</button>
    <button @click="next">Go next scene</button>
  </div>
</template>

<style scoped lang="scss">
.wrapper {
  position: absolute;
  bottom: 10px;
  right: 10px;
  cursor: pointer;
  pointer-events: all;
  display: flex;
  gap: 5px;
}
</style>
