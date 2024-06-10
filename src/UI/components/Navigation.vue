<script setup>
import NavigationElement from "./NavigationElement.vue"
import LearnMorePanel from "./LearnMorePanel.vue"

import { state } from "../../utils/State"
import { EVENTS } from "../../utils/constants/events"

import { ref, computed } from "vue"

const props = defineProps({
  sceneIndex: Number,
})

const isLearnMorePanelOpen = ref(false)

// [WIP] à brancher
const isSoundOn = ref(true)

const isOnMap = computed(() => (props.sceneIndex === 1 ? true : false))

const onClickMap = () => {
  state.emit(EVENTS.ASK_CHANGE_SCENE, 1)
}

const onClickSound = () => {
  console.log("toggle sound")
}

const onClickLearnMore = () => {
  if (isLearnMorePanelOpen.value === false) {
    isLearnMorePanelOpen.value = true
  } else {
    isLearnMorePanelOpen.value = false
  }
}
</script>

<template lang="">
  <div class="navigation__container">
    <div class="navigation">
      <NavigationElement
        @click="onClickLearnMore"
        :icon="isLearnMorePanelOpen ? 'close' : 'learn-more'"
        :isVisible="!isOnMap"
      ></NavigationElement>
      <NavigationElement
        @click="onClickMap"
        icon="map"
        :isVisible="!isOnMap"
      ></NavigationElement>
      <NavigationElement
        @click="onClickSound"
        :icon="isSoundOn ? 'sound-on' : 'sound-off'"
        :isVisible="true"
      ></NavigationElement>
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
  gap: 16px;
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
