<script setup>
import MapButton from "./MapButton.vue"
import LearnMoreButton from "./LearnMoreButton.vue"
import SoundButton from "./SoundButton.vue"
import LearnMorePanel from "./LearnMorePanel.vue"

import { state } from "../../utils/State"
import { EVENTS } from "../../utils/constants/events"

import { ref, computed } from "vue"

const props = defineProps({
  sceneIndex: Number,
})

const isLearnMorePanelOpen = ref(false)

state.on(EVENTS.OPEN_LEARN_MORE_PANEL, () => {
  isLearnMorePanelOpen.value = true
})

state.on(EVENTS.CLOSE_LEARN_MORE_PANEL, () => {
  isLearnMorePanelOpen.value = false
})

const isOnMap = computed(() =>
  props.sceneIndex === 1 ? true : false
)
</script>

<template lang="">
  <div class="navigation__container">
    <div class="navigation">
      <MapButton v-if="!isOnMap" class="navigation__element"></MapButton>
      <SoundButton class="navigation__element"></SoundButton>
      <LearnMoreButton
        v-if="!isOnMap"
        class="navigation__element"
      ></LearnMoreButton>
    </div>
    <LearnMorePanel
      :sceneIndex="props.sceneIndex"
      :class="`navigation__learn-more navigation__learn-more--${
        isLearnMorePanelOpen && !isOnMap ? 'visible' : 'hidden'
      }`"
    >
    </LearnMorePanel>
  </div>
</template>

<style scoped lang="scss">
.navigation__container {
  position: absolute;
  right: 48px;
  top: 24px;
  display: flex;
  flex-direction: column;
  gap: 24px;
  z-index: 100;
  pointer-events: all;
  font-family: var(--ff-rubik);
}

.navigation {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 24px;
}

.navigation__element {
  cursor: pointer;
}

.navigation__learn-more {
  transition: opacity 400ms ease-in-out, transform 400ms ease-in-out;
}
.navigation__learn-more.navigation__learn-more--hidden {
  transform: translateY(40px);
  opacity: 0;
  pointer-events: none;
}
</style>
