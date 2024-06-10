<script setup>
import { EVENTS } from "../../utils/constants/events"
import { state } from "../../utils/State"

import IntroButton from "../components/IntroButton.vue"

import { useI18n } from "vue-i18n"

const props = defineProps({
  isVisible: Boolean,
})

const { t } = useI18n()

const onClickCtaStart = () => {
  state.emit(EVENTS.START_EXP)
}
</script>

<template>
  <div :class="`pre-intro pre-intro--${isVisible ? 'visible' : 'hidden'}`">
    <div class="pre-intro__text">
      <p v-for="index in [1, 2, 3]">
        {{ t(`intro.text_${index}`) }}
      </p>
    </div>
    <IntroButton @click="onClickCtaStart">
        {{ t("intro.start") }}
    </IntroButton>
  </div>
</template>

<style>
.pre-intro {
  height: 100vh;
  width: 100vw;
  position: fixed;
  top: 0;
  z-index: 10;
  transition: opacity 800ms;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 24px;
  background-color: var(--c-background-beige);
}

.pre-intro.pre-intro--hidden {
  opacity: 0;
  pointer-events: none;
}

.pre-intro__text {
  max-width: 860px;
  font-family: var(--ff-eczar);
  line-height: 1.4;
  font-size: 24px;
  text-align: center;
  color: var(--c-text-turquoise);
  margin-bottom: 48px;
  margin-top: -160px;
}

.pre-intro__text p + p {
  margin-top: 0.66em;
}


.intro-button,
.pre-intro__text p {
  --anim-delay: 0ms;
  --anim-duration: 1200ms;
  opacity: 0;
  animation: fadeIn var(--anim-duration) var(--anim-delay) forwards ease-in-out;
}

.pre-intro__text p:nth-child(1) {
  --anim-delay: 200ms;
}

.pre-intro__text p:nth-child(2) {
  --anim-delay: 800ms;
}

.pre-intro__text p:nth-child(3) {
  --anim-delay: 1400ms;
}

.intro-button {
  --anim-delay: 2200ms;
}


@keyframes fadeIn {
  0% {
    opacity: 0;
  }

  100% {
    opacity: 1;
  }
}
</style>
