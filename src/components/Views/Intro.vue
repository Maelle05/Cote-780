<script setup>
import { EVENTS } from "@/webgl/Constants/events"
import { INTRO_SECTIONS } from "@/webgl/Constants/config"
import { state } from "../../webgl/Utils/State"
import { ref, watch, onMounted } from "vue"
import { gsap, ScrollTrigger } from "gsap/all"

gsap.registerPlugin(ScrollTrigger)

const activeSection = ref("")

const onActiveSectionChange = (newVal, oldVal) => {
  // console.log(`active section changed from ${oldVal} to ${newVal}`)
  
  state.emit(EVENTS.INTRO_CHANGE_SECTION, newVal)

  const updatedText = INTRO_SECTIONS[newVal]?.text
  if (updatedText !== undefined) {
    state.emit(EVENTS.INTRO_UPDATE_TEXT, { text: updatedText })
  }
}

watch(activeSection, onActiveSectionChange)

onMounted(() => {
  // [WIP] trouver mieux
  const timelines = []
  Array.from({ length: INTRO_SECTIONS.length }, (_, index) => {
    timelines.push(gsap.timeline())
  })

  timelines[1].fromTo(
    ".section__element--maison",
    { opacity: 0.5 },
    { duration: 0.5, y: "-50vh", opacity: 1 },
    "-=1"
  )

  timelines[2].fromTo(
    ".section__element--chambre",
    { opacity: 0.5, scale: 0.8 },
    { duration: 0.5, y: "-100vh", opacity: 1, scale: 1 },
    "-=1"
  )

  timelines[2].fromTo(
    ".section__element--lettre",
    { y: "150vh", x: '50vw'},
    { duration: 0.5, y: "-50vh", x: '0'},
    "-=1"
  )

  timelines[3].fromTo(
    ".section__element--construction-barrage",
    { scale: 0.4, opacity: 0, x: '50vh', y: '60vh'  },
    { duration: 0.3, scale: 0.9, opacity: 1, x: '0vh', y: '-20vh' },
    "-=0.9"
  )

  timelines[3].fromTo(
    ".section__element--durance-colere",
    { scale: 0.4, opacity: 0, x: '50vh', y: '100vh'  },
    { duration: 0.2, scale: 0.9, opacity: 1, x: '0vh', y: '40vh' },
    "-=0.7"
  )

  timelines[5].fromTo(
    ".section__element--mamie-lien-durance-1",
    { x: '-100vh' },
    { duration: 0.02, x: '0vh' },
    "-=1"
  )

  timelines[5].fromTo(
    ".section__element--mamie-lien-durance-2",
    { x: '100vh' },
    { duration: 0.02, x: '0vh' },
    "-=1"
  )

  timelines[6].fromTo(
    ".section__element--passage-lac",
    { y: '60vh' },
    { duration: 1, y: '-20vh' },
    "-=1"
  )

  timelines[7].fromTo(
    ".section__element--milo",
    { y: '60vh' },
    { duration: 0.5, y: '-20vh' },
    "-=1"
  )

  timelines[8].fromTo(
    ".section__element--collier",
    { x: '-60vh', y: '80vh' },
    { duration: 0.5, x: '0vh', y: '0vh' },
    "-=1"
  )

  timelines[8].fromTo(
    ".section__element--carte",
    { x: '60vh', },
    { duration: 0.5, x: '0vh', },
    "-=1"
  )

  INTRO_SECTIONS.forEach((section, index) => {
    ScrollTrigger.create({
      trigger: `.section--${index}`,
      start: "top bottom",
      end: "+100%",
      animation: timelines[index],
      scrub: 1,
      onEnter: () => {
        activeSection.value = index;
      },
      onLeave: () => {
        activeSection.value = index + 1;
      },
      onEnterBack: () => {
        activeSection.value = index;
      },
      onLeaveBack: () => {
        activeSection.value = index - 1;
      },
    })
  })
})

const onClickCta = () => {
  state.emit(EVENTS.CHANGE_SCENE, 1)
}
</script>

<template>
  <div :class="`container-intro`">
    <div
      :class="`section section--${index}`"
      :key="section.text"
      v-for="(section, index) in INTRO_SECTIONS"
    >
      <div
        :class="`
      section__element 
      section__element--${index} 
      section__element--${element.id}
      `"
        :key="element.src"
        v-for="(element, index) in section.elements"
      >
        <img :src="element.src" />
      </div>
    </div>
    <p class="intro-cta" @click="onClickCta">Go demoiselles</p>
  </div>
</template>

<style scoped>
.container-intro {
  pointer-events: all;
  position: absolute;
  top: 0;
  overflow: hidden;
}
.section {
  height: 150vh;
  width: 100vw;
  background-color: #fff;
  /* border-top: 2px solid red; */
  display: grid;
  align-items: center;
  justify-content: center;
}

.section > * {
  grid-area: 1 / -1;
}

.section__element {
  align-self: flex-start;
}


.section__element img {
  width: 100%;
}

.section__element--lac {
  position: sticky;
  top: 0;
}

.section.section--5,
.section.section--6 {
  height: 100vh;
}

.intro-cta {
  padding: 20px;
  position: absolute;
  bottom: 10vh;
  left: 50%;
  transform: translateX(-50%);
  color: black;
  border: 1px solid;
  cursor: pointer;
  font-family: sans-serif;
}
</style>
