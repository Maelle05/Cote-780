<script setup>
import { EVENTS } from "@/utils/constants/events"
import { state } from "@/utils/State"

import { useI18n } from "vue-i18n"
import { watch, ref } from "vue"

import gsap from "gsap"

const { t } = useI18n()

const props = defineProps({
  sceneIndex: Number,
  isVisible: Boolean,
})

const cairnImageIndex = ref(props.sceneIndex)

const handleClick = () => {
  console.log("CollectionCairns.vue - handleClick!")
  state.emit(EVENTS.GO_NEXT)
}

const playApparitionAnimation = () => {
  const appearTimeline = gsap.timeline({ defaults: { ease: "Power2.easeOut" } })
  appearTimeline
    .fromTo(".collection-cairns", { opacity: 0 }, { duration: 1, opacity: 1 })
    .fromTo(
      ".collection-cairns__image",
      { opacity: 0, rotate: 16, scale: 0 },
      { duration: 1, opacity: 1, rotate: 0, scale: 1 },
      "<"
    )
    .fromTo(
      ".collection-cairns__text p:nth-child(1)",
      { opacity: 0, scale: 0.9 },
      { duration: 1, opacity: 1, rotate: 0, scale: 1 },
      "-=0.7"
    )
    .fromTo(
      ".collection-cairns__text p:nth-child(2)",
      { opacity: 0, y: "-60px", rotate: -20, scale: 0.9 },
      { duration: 0.7, opacity: 1, y: 0, rotate: 2.5, scale: 1 },
      "-=0.9"
    )
    .fromTo(
      ".collection-cairns__text p:nth-child(3)",
      { opacity: 0, y: "-30px", rotate: 20, scale: 0.9 },
      { duration: 0.7, opacity: 1, y: 0, rotate: -5.5, scale: 1 },
      "-=0.6"
    )
}

watch(
  () => props.isVisible,
  (newVal) => {
    if (newVal === true) {
      playApparitionAnimation()
    }
  }
)

// pour gérer les cas où collectionCairns apparaît en dernier écran
// (et éviter que l'image s'update au changement de scène alors que l'écran est encore affiché)
// (on a dit qu'on faisait du sale)
watch(() => props.sceneIndex, (newVal) => {
  setTimeout(() => {
    cairnImageIndex.value = newVal
  }, 3000)
})
</script>

<template lang="">
  <div
    @click="handleClick"
    :class="`collection-cairns__container collection-cairns__container--${
      isVisible ? 'visible' : 'hidden'
    }`"
  >
    <div class="collection-cairns">
      <div class="collection-cairns__image">
        <img :src="`/assets/images/cairns/${cairnImageIndex}.svg`" alt="" />
      </div>
      <div class="collection-cairns__text">
        <p>{{ t(`global.new-cairn_1`) }}</p>
        <p>{{ t(`global.new-cairn_2`) }}</p>
        <p>{{ t(`global.new-cairn_3`) }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.collection-cairns__container {
  position: absolute;
  height: 100vh;
  width: 100%;
  left: 0;
  top: 0;
  background-color: #4e5d6c99;
  display: grid;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-family: var(--ff-rubik);
  pointer-events: all;
  user-select: none;
  transition: opacity 1200ms;

  &.collection-cairns__container--hidden {
    opacity: 0;
    pointer-events: none;
  }
}

.collection-cairns {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 32px;

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

  > * {
    position: relative;
    z-index: 1;
  }
}

.collection-cairns__image {
  img {
    width: 180px;
    position: relative;
    animation: pulseShadow 2s infinite;
  }
}

@keyframes pulseShadow {
  0% {
    filter: drop-shadow(0 0 40px rgba(255, 255, 255, 0.4)) drop-shadow(0 0 4px rgba(255, 255, 255, 0.75));
  }

  50% {
    filter: drop-shadow(0 0 100px rgba(255, 255, 255, 0.6)) drop-shadow(0 0 4px rgba(255, 255, 255, 0.75));
  }

  100% {
    filter: drop-shadow(0 0 40px rgba(255, 255, 255, 0.4)) drop-shadow(0 0 4px rgba(255, 255, 255, 0.75));
  }
}

.collection-cairns__text {
  display: flex;
  flex-direction: column;
  align-items: center;

  p:nth-child(1) {
    font-family: var(--ff-rubik);
    font-size: 20px;
    font-weight: 300;
    margin-bottom: 16px;
  }

  p:nth-child(2),
  p:nth-child(3) {
    font-family: var(--ff-eczar);
    font-size: 56px;
    line-height: 85%;
    text-shadow: 0 0 4px rgba(255, 255, 255, 0.75);
  }
}
</style>
