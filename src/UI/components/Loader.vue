<script setup>
import { EVENTS } from "../../utils/constants/events"
import { state } from "../../utils/State"

import { useI18n } from "vue-i18n"
import { onMounted, onUnmounted, ref } from "vue"

import gsap from "gsap"

const { t } = useI18n()

const isIntroReady = ref(false)
const isLoaderReady = ref(false)
const loaderTexts = ref([])
const loaderProgress = ref(0)
const textToDisplay = ref("")

let textUpdateInterval = null

const MIN_DURATION = 2000
const TEXT_UPDATE_FREQ = 200

const getRandomText = () => {
  if (loaderTexts.value.length === 0) return
  const randomIndex = Math.floor(Math.random() * loaderTexts.value.length)
  const randomText = loaderTexts.value.splice(randomIndex, 1)[0]
  return randomText
}

onMounted(() => {
  let index = 1
  while (true) {
    const text = t(`global.loader_${index}`)
    if (text === `global.loader_${index}`) break
    loaderTexts.value.push(text)
    index++
  }

textUpdateInterval = setInterval(() => {
    if (loaderTexts.value.length === 0) {
      clearInterval(textUpdateInterval)
    } else {
      textToDisplay.value = getRandomText()
    }
  }, TEXT_UPDATE_FREQ)

  gsap.to(loaderProgress, {
    value: 99,
    duration: MIN_DURATION / 1000,
    onUpdate: () => {
      loaderProgress.value = Math.round(loaderProgress.value)
    }
  })

  setTimeout(() => {
    isLoaderReady.value = true

    if (isIntroReady.value === true) {
        initLoaderDisparition()
    }
  }, MIN_DURATION);
})

onUnmounted(() => {
  clearInterval(textUpdateInterval)
})

state.on(EVENTS.ATTACH, (e) => {
  isIntroReady.value = true

  if (isLoaderReady.value === true) {
    initLoaderDisparition()
  }
})

const initLoaderDisparition = () => {
    loaderProgress.value = 100
    clearInterval(textUpdateInterval)

    setTimeout(() => {
        playDisparitionAnimation()
    }, 500);
}

const playDisparitionAnimation = () => {
  const disparitionTimeline = gsap.timeline()
  disparitionTimeline
    .to(".loader", { opacity: 0, duration: 0.1 })
    .to(".loader__container", { opacity: 0, duration: 1 })
}
</script>

<template>
  <div class="loader__container">
    <div class="loader">
      <img class="loader__image" src="/assets/images/milo-run.gif" alt="">
      <p class="loader__progress">{{ loaderProgress }}%</p>
      <p class="loader__text">{{ textToDisplay }}</p>
    </div>
  </div>
</template>

<style lang="scss">
.loader__container {
  height: 100vh;
  width: 100%;
  background-color: var(--c-background-beige);
  position: relative;
  z-index: 200;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--c-turquoise-dark);
  font-family: var(--ff-pangolin);
  font-size: 14px;
  pointer-events: none;
}

.loader {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
  color: var(--c-turquoise-dark);
  font-family: var(--ff-pangolin);
  font-size: 14px;
  opacity: 0;
  animation: fadeIn 200ms 300ms ease-in-out forwards;
}

@keyframes fadeIn {
  100% {
    opacity: 1;
  }
}

.loader__image {
  width: 80px;
  left: 6px;
  margin-bottom: 18px;
}

.loader__text {
  min-height: 1em;
}
</style>
