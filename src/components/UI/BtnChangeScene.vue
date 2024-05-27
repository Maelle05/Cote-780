<script setup>
import { EVENTS } from '@/webgl/Constants/events'
import { INIT_SCENE } from '@/webgl/Constants/config'
import { state } from '../../webgl/Utils/State'
import { ref } from 'vue'

let currentScene = ref(INIT_SCENE)

// functions that mutate state and trigger updates
function onClickBtn() {
  currentScene.value = (currentScene.value + 1) % 8
  state.emit(EVENTS.CHANGE_SCENE, currentScene.value )
}

</script>

<template>
  <button @click="onClickBtn"> Go next scene </button>
</template>

<style scoped lang="scss">
button {
  position: absolute;
  bottom: 10px;
  right: 10px;
  cursor: pointer;
  pointer-events: all;
}
</style>