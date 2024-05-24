<script setup>
import { EVENTS } from '@/webgl/Constants/events'
import { state } from '../../webgl/Utils/State'
import { ref, watch, onMounted } from "vue"
import { gsap, ScrollTrigger } from "gsap/all"

gsap.registerPlugin(ScrollTrigger)

const sections = [
  {
    elements: [],
    text: "ÉCRAN 1",
  },
  {
    elements: [],
    text: "ÉCRAN 2",
  },
  {
    elements: [],
    text: "ÉCRAN 3",
  },
  {
    elements: [],
    text: "ÉCRAN 4",
  },
  {
    elements: [],
    text: "ÉCRAN 5",
  },
]

const activeSection = ref("")

const onActiveSectionChange = (newVal, oldVal) => {
  console.log(`active section changed from ${oldVal} to ${newVal}`)
  
  state.emit(EVENTS.INTRO_CHANGE_SECTION, newVal)
  
  const updatedText = sections[newVal]?.text
  if (updatedText !== undefined) {
    state.emit(EVENTS.INTRO_UPDATE_TEXT, {text: updatedText})
  }
}

watch(activeSection, onActiveSectionChange)

onMounted(() => {
  sections.forEach((section, index) => {
    ScrollTrigger.create({
      trigger: `.section--${index}`,
      start: "top center",
      end: "+100%",
      onToggle: (self) => {
        if (self.isActive === true) {
          activeSection.value = index
        }
      },
    })
  })
})
</script>

<template>
  <div>
    <div
      :class="`section section--${index}`"
      :key="section.text"
      v-for="(section, index) in sections"
    >
      <p>
        {{ section.text }}
      </p>
    </div>
  </div>
</template>

<style scoped>
.section {
  height: 100vh;
  width: 100vw;
  background-color: pink;
  border: 2px solid red;
  color: red;
  display: grid;
  align-items: center;
  justify-content: center;
}

.section > * {
  grid-area: 1 / -1;
}
</style>
