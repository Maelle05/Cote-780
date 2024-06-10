<script setup>
import { EVENTS } from "../../utils/constants/events"
import { state } from "../../utils/State"

import { ref } from "vue"

const isLearnMorePanelOpen = ref(false)

const onLearnMoreClick = () => {
  if (isLearnMorePanelOpen.value === false) {
    state.emit(EVENTS.OPEN_LEARN_MORE_PANEL)
    isLearnMorePanelOpen.value = true
  } else {
    state.emit(EVENTS.CLOSE_LEARN_MORE_PANEL)
    isLearnMorePanelOpen.value = false
  }
}
</script>

<template lang="">
  <div class="learn-more-button" @click="onLearnMoreClick">{{ isLearnMorePanelOpen ? "Close" : "En savoir +" }}</div>
</template>

<style scoped lang="scss">
</style>
