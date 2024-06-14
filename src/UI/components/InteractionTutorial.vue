<script setup>
import { EVENTS } from "@/utils/constants/events"
import { state } from "@/utils/State"

import { computed } from 'vue'
import { useI18n } from "vue-i18n"

const { t } = useI18n()

const props = defineProps({
  isVisible: Boolean,
  sceneIndex: Number,
})

const interactionType = computed(() => props.sceneIndex === 2 ? "move" : "click")
</script>

<template>
  <div
    :class="`interaction-tutorial__container interaction-tutorial__container--${
      isVisible ? 'visible' : 'hidden'
    }`"

  >
    <div
      :class="`interaction-tutorial interaction-tutorial--${interactionType}`"
    >
      <div class="interaction-tutorial__icon">
        <img :src="`/assets/images/icons/${interactionType}.svg`" alt="" />
      </div>
      <div class="interaction-tutorial__text">
        <p>{{ t(`scene_${sceneIndex}.tuto`) }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.interaction-tutorial__container {
  position: absolute;
  height: 100vh;
  width: 100%;
  top: 0;
  left: 0;
  // background-color: #4e5d6c99;
  display: grid;
  align-items: center;
  justify-content: center;
  transition: opacity 1200ms;
  pointer-events: all;
  user-select: none;

  &.interaction-tutorial__container--hidden {
    opacity: 0;
    pointer-events: none;
  }
}

.interaction-tutorial {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;

  &::before {
    height: 280px;
    width: 280px;
    background-color: #4e5d6ca8;
    border-radius: 100%;
    display: block;
    filter: blur(50px);
    content: "";
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 0;
  }
}

.interaction-tutorial__icon {
  width: 90px;

  img {
    max-width: 100%;
    z-index: 1;
    position: relative;
  }
}

.interaction-tutorial__text {
  font-family: var(--ff-rubik);
  max-width: 260px;
  text-align: center;
  line-height: 150%;
  font-weight: 300;
  font-size: 16px;
  z-index: 1;

  p {
    pointer-events: none;
  }
}

.interaction-tutorial.interaction-tutorial--move {
  .interaction-tutorial__icon {
    animation: moveAnim 2s infinite;
    transform-origin: right bottom;
  }
}

.interaction-tutorial.interaction-tutorial--click {
  .interaction-tutorial__icon {
    animation: clickAnim 2s infinite;
    transform-origin: left top;
  }
}

@keyframes moveAnim {
  0% {
    transform: rotate(12deg);
  }

  50% {
    transform: rotate(-8deg);
  }

  100% {
    transform: rotate(12deg);
  }
}

@keyframes clickAnim {
  0% {
    transform: scale(1);
  }
  25% {
    transform: scale(0.95);
  }
  50% {
    transform: scale(1.05);
  }
  75% {
    transform: scale(0.95);
  }
  100% {
    transform: scale(1);
  }
}
</style>
