<script setup>
import { EVENTS } from '@/webgl/Constants/events'
import { state } from '../../webgl/Utils/State'

// functions that mutate state and trigger updates
function onClickBtn() {
  state.emit(EVENTS.CHANGE_SCENE)
}

</script>

<template>
  <button @click="onClickBtn"> Change current scene </button>
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