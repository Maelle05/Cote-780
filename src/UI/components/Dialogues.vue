<script setup>
import { EVENTS } from "@/utils/constants/events"
import { state } from "@/utils/State"

import { ref, onMounted, nextTick, computed } from "vue"
import { gsap } from "gsap"

const hasDialogue = ref(false)
const person = ref("")
const text = ref("")
const letters = ref([])

const wrapperRef = ref(null)
const wrapperHeight = ref(0)

let isAnimationInProgress = false

const assignRef = (ref, element, match) => {
  if (element === match) {
    wrapperRef.value = ref
  }
}

const updateHeight = () => {
  if (wrapperRef.value) {
    wrapperHeight.value = wrapperRef.value.offsetHeight
  }
}

const animateLettersApparition = () => {
  if (isAnimationInProgress) return

  isAnimationInProgress = true

  gsap.to(".wrapper--original .letter", {
    opacity: 1,
    duration: 0.1,
    stagger: 0.02,
    delay: 0.2,
    onComplete: () => {
      isAnimationInProgress = false
    },
  })
}

onMounted(() => {
  nextTick(() => {
    updateHeight()
  })
})

state.on(EVENTS.UPDATE_DIALOGUE, (e) => {
  if (e) {
    gsap.to(".wrapper--original .letter", {
      opacity: 0,
      duration: hasDialogue.value === true ? 0.1 : 0.001,
      onComplete: () => {
        person.value = e.person
        text.value = e.text
        letters.value = text.value.split("")

        nextTick(() => {
          updateHeight()
          animateLettersApparition()
        })
      },
    })

    hasDialogue.value = true
  } else {
    hasDialogue.value = false
  }
})

const onClickDialogue = () => {
  if (isAnimationInProgress) {
    gsap.killTweensOf(".wrapper--original .letter")
    gsap.set(".wrapper--original .letter", { opacity: 1 })
    isAnimationInProgress = false
  } else {
    state.emit(EVENTS.GO_NEXT)
  }
}
</script>

<template>
  <div
    @click="onClickDialogue"
    :ref="(ref) => assignRef(ref, element, 'clone')"
    :class="`wrapper wrapper--${element} wrapper--${hasDialogue ? 'visible' : 'hidden'}`"
    :style="`--wrapper-height: ${wrapperHeight}px;`"
    v-for="element in ['original', 'clone']"
  >
    <div class="person">
      <span>{{ person }}</span>
    </div>
    <div class="text">
      <span v-for="(letter, index) in letters" :key="index" class="letter">
        {{ letter }}
      </span>
    </div>
  </div>
</template>

<style scoped lang="scss">
.wrapper {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  bottom: 5vh;
  opacity: 1;
  transition: 0.5s;
  background-color: var(--c-background-beige-light);
  border: 1px solid var(--c-stroke-beige-light);
  box-shadow: 0 0 40px #fffbf280, 0 0 4px #fffbf280;
  font-size: 16px;
  border-radius: 16px;
  color: var(--c-text-dark);
  padding: 36px 32px 24px;
  font-family: var(--ff-eczar);
  line-height: 150%;
  pointer-events: all;
  width: 500px;
  height: var(--wrapper-height);
  transition: opacity 600ms, height 800ms;
  box-sizing: border-box;

  &.wrapper--clone {
    opacity: 0;
    pointer-events: none;
    height: auto;
  }

  &.wrapper--hidden {
    height: 0;
    opacity: 0;
    pointer-events: none;
  }
}

.person {
  position: absolute;
  top: -1.2em;
  left: -1.2em;
  font-family: var(--ff-rubik);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-weight: 400;
  color: #fff;
  z-index: 1;
  display: grid;
  align-items: center;
  justify-content: center;

  span {
    grid-area: 1 / -1;
    position: relative;
    z-index: 1;
    text-align: center;
    font-size: 14px;
    color: var(--c-stroke-beige-light);
  }

  &::before {
    grid-area: 1 / -1;
    display: block;
    content: url("/assets/images/ui/cairn.svg");
  }
}

.text {
  font-size: 18px;
  letter-spacing: 0.02em;

  .letter {
    opacity: 0;
  }
}
</style>
