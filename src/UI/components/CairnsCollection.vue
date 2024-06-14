<script setup>
import { app } from "@/App";
import { EVENTS } from "../../utils/constants/events"
import { state } from "../../utils/State"

import { watch } from 'vue';
import gsap from "gsap"

const props = defineProps({
  isVisible: Boolean,
  sceneIndex: Number,
  stepIndex: Number,
  cairnsNumber: Number,
})

const playEndAnimation = () => {
  const endTimeline = gsap.timeline()
  endTimeline
  .to(`.cairns-collection__element`, { opacity: 0, y: '-60px', scale: 2.5, filter: "blur(20px)", duration: 1.2, stagger: 0.3 })
}

const playCollectionAnimation = (index) => {
  const collectTimeline = gsap.timeline()
  collectTimeline
  .fromTo(
    `.cairns-collection__element--${index}`, 
    { opacity: 0, filter: "drop-shadow(0 0 0 #fff)" }, 
    { opacity: 1, scale: 1.15, filter: "drop-shadow(0 0 12px #fff)", duration: 0.5 }
  )
  .to(`.cairns-collection__element--${index} .cairn--collected`, { opacity: 1, duration: 0.4 }, "<")
  .to(`.cairns-collection__element--${index} .cairn--uncollected`, { opacity: 0, duration: 0.4 }, "<")
  .to(
    `.cairns-collection__element--${index}`, 
    { scale: 1,  duration: 0.2},
  )
  .call(() => {
    app.audio.ui.play("magic_popup_3");
  }, [], "0.3");
}

const playCollectionSound = () => {
  if (app.audio === undefined) return;

  // [WIP][son] add UI sound here
}

state.on(EVENTS.COLLECT_CAIRN, (e) => {
  setTimeout(() => {
    playCollectionAnimation(e)
    playCollectionSound()
  }, 300);
})

watch(
  () => [props.sceneIndex, props.stepIndex],
  ([newSceneIndex, newStepIndex]) => {
    if (newSceneIndex === 7 && newStepIndex === 1) {
      setTimeout(() => {
        playEndAnimation();
      }, 200);
    }
  }
);
</script>

<template lang="">
  <div :class="`cairns-collection__container cairns-collection__container--${isVisible ? 'visible' : 'hidden'}`">
    <div class="cairns-collection">
      <div
        :class="`cairns-collection__element cairns-collection__element--${index + 1} cairns-collection__element--${
          index + 1 <= cairnsNumber ? 'collected' : 'uncollected'
        }`"
        v-for="(cairn, index) in [2, 3, 4, 5, 6]"
      >
        <img class="cairn cairn--uncollected" :src="`/assets/images/cairns/uncollected/${cairn}.svg`">
        <img class="cairn cairn--collected" :src="`/assets/images/cairns/collected/${cairn}.svg`">
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.cairns-collection__container {
  position: fixed;
  height: 100vh;
  width: 100%;
  left: 0;
  top: 0;
  padding-top: 18px;
  box-sizing: border-box;
  display: grid;
  align-items: start;
  justify-content: center;
  user-select: none;
  pointer-events: none;
  transition: opacity 1200ms;

  &.cairns-collection__container--hidden {
    opacity: 0;
  }
}

.cairns-collection {
  display: flex;
  gap: 12px;
}

.cairns-collection__element {
  --cairn-padding: 4px;
  width: 56px;
  height: 56px;
  display: grid;
  align-items: center;
  justify-content: center;
  justify-items: center;
  padding: var(--cairn-padding);
  box-sizing: border-box;
  border-radius: 6px;
  filter: drop-shadow(0 0 0 #fff);
  transition: opacity 600ms, filter 600ms;


  img {
    grid-area: 1 / -1;
    max-width: 100%;
    max-height: calc(100% - var(--cairn-padding) * 2);
    position: relative;
  }

  .cairn.cairn--uncollected {
    z-index: 0;
  }
  
  .cairn.cairn--collected {
    opacity: 0;
    z-index: 1;
  }
}
</style>
