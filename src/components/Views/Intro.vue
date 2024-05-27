<script setup>
import { EVENTS } from '@/webgl/Constants/events'
import { INTRO_SECTIONS } from '@/webgl/Constants/config'
import { state } from '../../webgl/Utils/State'
import { ref, watch, onMounted } from "vue"
import { gsap, ScrollTrigger } from "gsap/all"

gsap.registerPlugin(ScrollTrigger)

const activeSection = ref("")

const onActiveSectionChange = (newVal, oldVal) => {
  // console.log(`active section changed from ${oldVal} to ${newVal}`)
  
  state.emit(EVENTS.INTRO_CHANGE_SECTION, newVal)
  
  const updatedText = INTRO_SECTIONS[newVal]?.text
  if (updatedText !== undefined) {
    state.emit(EVENTS.INTRO_UPDATE_TEXT, {text: updatedText})
  }
}

watch(activeSection, onActiveSectionChange)

onMounted(() => {
  INTRO_SECTIONS.forEach((section, index) => {
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
  <div :class="`container-intro`">
    <div
      :class="`section section--${index}`"
      :key="section.text"
      v-for="(section, index) in INTRO_SECTIONS"
    >
    </div>
  </div>
</template>

<style scoped>
.container-intro{
  pointer-events: all;
}
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
