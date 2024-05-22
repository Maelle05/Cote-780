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