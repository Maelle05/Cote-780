<script setup>
import { ref, reactive, onMounted, onUnmounted } from "vue"
import { gsap, ScrollTrigger } from "gsap/all"
import { useI18n } from "vue-i18n"

import { EVENTS } from "../../utils/constants/events"
import { INTRO_SECTIONS } from "../../utils/constants/config"
import { state } from "../../utils/State"

import IntroText from "../components/IntroText.vue" // Adjust the path as necessary
import PreIntro from "../components/PreIntro.vue"

const { t } = useI18n()

gsap.registerPlugin(ScrollTrigger)

const isStarted = ref(false)
const hasScrolled = ref(false)
const activeSection = ref("")

const scrollProgress = reactive([])
INTRO_SECTIONS.forEach((_, index) => {
  scrollProgress[index] = 0;
});

state.on(EVENTS.START_EXP, (e) => {
  isStarted.value = true
})

const onClickCtaEnd = () => {
  state.emit(EVENTS.GO_NEXT)
}

const handleScroll = (e) => {
  if (window.scrollY > 0 && hasScrolled.value === true) {
    return
  }

  if (window.scrollY === 0) {
    hasScrolled.value = false
  } else {
    hasScrolled.value = true
  }
}

onMounted(() => {
  // [WIP] trouver mieux
  const timelines = []
  Array.from({ length: INTRO_SECTIONS.length }, (_, index) => {
    timelines.push(gsap.timeline())
  })

  timelines[1]
    .fromTo(".section__element--1-arbre", { y: "30vh" }, { duration: 1, y: "-30vh" })
    .fromTo(".section__element--1-colline-1", { y: "10vh" }, { duration: 1, y: "-10vh" }, "<")
    .fromTo(".section__element--1-colline-2", { y: "15vh" }, { duration: 1, y: "-15vh" }, "<")
    .fromTo(".section__element--1-maison", { y: "20vh" }, { duration: 1, y: "-20vh" }, "<")
    .fromTo(".section__element--1-buisson-droite", { x: "-10vh", y: "25vh" }, { duration: 1, x: "0vh", y: "-25vh" }, "<")
    .fromTo(".section__element--1-buisson-gauche", { x: "10vh", y: "25vh" }, { duration: 1, x: "0vh", y: "-25vh" }, "<")

  timelines[2]
    .fromTo(".section__element--2-lumiere", { opacity: 0 }, { duration: 0.5, opacity: 1 }, "-=0.2")
    .fromTo(".section__element--2-enveloppe, .section__element--2-lettre", { opacity: 0 }, { duration: 0.2, opacity: 1 }, "<")
    .fromTo(".section__element--2-enveloppe", { x: "30vw" }, { duration: 0.5, x: "20vw" }, "<")
    .fromTo(".section__element--2-lettre", { x: "40vw" }, { duration: 0.5, x: "20vw" }, "<")

  timelines[4]
  .fromTo(".section__element--4-durance-1", { y: "50vh" }, { duration: 0.2, y: "0vh" })
  .fromTo(".section__element--4-durance-3", { y: "55vh" }, { duration: 0.2, y: "0vh" }, "<")
  .fromTo(".section__element--4-durance-2", { y: "60vh" }, { duration: 0.2, y: "-5vh" }, "<")
  .fromTo(".section__element--4-grandma", { y: "100vh" }, { duration: 0.2, y: "-25vh" }, "<")
  .fromTo(".section__element--4-cairn", { y: "-40vh" }, { duration: 0.1, y: "-23vh" }, "<")
  .fromTo(".section__element--4-cairn", { opacity: 0 }, { duration: 0.1, opacity: 1 }, "-=0.1")

  timelines[5]
  .fromTo(".section__element--5-collines", { y: "10vh" }, { duration: 0.1, y: "0vh" })
  .fromTo(".section__element--5-passage", { y: "20vh" }, { duration: 0.1, y: "-10vh" }, "<")

  timelines[6]
  .fromTo(".section__element--6-milo", { scale: "0.8" }, { duration: 0.2, scale: "1.1" })

  timelines[8]
  .fromTo(".section__element--collier", { opacity: 0, x: "-50vw" }, { duration: 0.2, opacity: 1, x: "0vw" })
  .fromTo(".section__element--carte", { opacity: 0, x: "50vw" }, { duration: 0.2, opacity: 1, x: "0vw" }, "<")


  INTRO_SECTIONS.forEach((section, index) => {
    ScrollTrigger.create({
      trigger: `.section--${index}`,
      start: "top center",
      end: "bottom center",
      animation: timelines[index],
      scrub: 1,
      onEnter: () => {
        activeSection.value = index
      },
      onLeave: () => {
        activeSection.value = index + 1
      },
      onEnterBack: () => {
        activeSection.value = index
      },
      onLeaveBack: () => {
        activeSection.value = index - 1
      },
      onUpdate: (self) => {
        scrollProgress[index] = self.progress
      },
    })
  })

  window.addEventListener("scroll", handleScroll)

  onUnmounted(() => {
    window.removeEventListener("scroll", handleScroll)
  })
})
</script>

<template>
  <div
    :class="`intro-container 
    intro-container--${isStarted ? 'started' : 'not-started'} 
    ${hasScrolled ? 'intro-container--has-scrolled' : ''}`"
  >
    <PreIntro :isVisible="isStarted ? false : true" />
    <div
      :class="`
      section 
      section--${index}
      section--${activeSection === index ? 'active' : 'inactive'}`
      "
      :key="index"
      v-for="(section, index) in INTRO_SECTIONS"
    >
      <div class="section__elements">
        <div
          :class="`
      section__element 
      section__element--${index} 
      section__element--${element.id}
      `"
          :style="`z-index: ${index};`"
          :key="element.src"
          v-for="(element, index) in section.elements"
        >
          <img :src="element.src" />
        </div>
      </div>
      <div :class="`section__text section__text--${id}`" v-for="(text, id) in section.texts">
        <IntroText :text="text" :audio="section.audios[id]" :index="id" :section="index" :sectionProgress="scrollProgress[index]" />
      </div>
    </div>
    <p class="intro-cta intro-cta--end" @click="onClickCtaEnd">Compris !</p>
    <div class="intro-title-screen">
      <div class="intro-title-screen__ui">
        <img src="/assets/images/logo.svg" alt="Cote 780" />
      </div>
      <div class="intro-title-screen__scroll">
        <span></span>
        <span></span>
      </div>
    </div>
  </div>
</template>

<style scoped>
* {
  box-sizing: border-box;
}

.intro-container {
  pointer-events: all;
  position: absolute;
  top: 0;
  overflow: hidden;
  width: 100%;
  color: #000;
  background-color: var(--c-background-beige);
}

.intro-title-screen {
  height: 100vh;
  width: 100vw;
  display: grid;
  align-items: center;
  justify-content: center;
  position: absolute;
  top: 0;
  padding: 10vh;
}

.intro-title-screen > * {
  grid-area: 1 / -1;
}

.intro-title-screen__ui {
  position: relative;
  top: -60px;
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 420px;
  gap: 42px;
  transition: transform 800ms, opacity 800ms;
}

.intro-title-screen__ui img {
  width: 100%;
}

.intro-title-screen__scroll {
  align-self: end;
  justify-self: center;
  pointer-events: none;
  transition: opacity 1200ms 400ms;
}

.intro-title-screen__scroll span {
  display: block;
  width: 12px;
  height: 12px;
  border-bottom: 2px solid;
  border-right: 2px solid;
  transform: rotate(45deg);
  animation: scrollDown 2s infinite;
  box-sizing: border-box;
}

@keyframes scrollDown {
  0% {
    transform: rotate(45deg) translate(0, 0);
  }
  50% {
    transform: rotate(45deg) translate(-20px, -20px);
  }
}

.intro-cta {
  padding: 12px 20px;
  border: 1px solid;
  cursor: pointer;
  font-family: sans-serif;
  border-radius: 4px;
  background-color: #eee;
  z-index: 20;
}

.intro-cta--end {
  position: absolute;
  bottom: 10vh;
  left: 50%;
  transform: translateX(-50%);
}

.section {
  min-height: 100vh;
  width: 100vw;
  position: relative;
}

/* .section {
  border: 2px solid red;
}

.section.section--active {
  background-color: #ff00ff4e;
} */

.section__text {
  position: fixed;
  top: 0;
  z-index: 10;
  pointer-events: none;
  width: fit-content;
}

.section__text + .section__text {
  top: unset;
  bottom: 0;
  right: 0;
}

.section__elements {
  display: grid;
  align-items: center;
  justify-content: center;
  margin: 0 !important;
  transition: opacity 800ms;
}

.section__elements > * {
  grid-area: 1 / -1;
}

.section__element {
  align-self: flex-start;
  pointer-events: none;
}

.section__element img {
  width: 100%;
}

.section__element img,
.section__element {
  margin: 0 !important;
  font-size: 0 !important;
}

/* 
.section__element--lac {
  position: sticky;
  top: 0;
}

.section.section--5,
.section.section--6 {
  height: 100vh;
} */

/* .section--2.section--active .section__elements {
  opacity: 1;
} */

.intro-container.intro-container--not-started {
  height: 100vh;
}

.intro-container.intro-container--has-scrolled .intro-title-screen__scroll,
.intro-container.intro-container--not-started .intro-title-screen__scroll {
  opacity: 0;
}

.intro-container.intro-container--has-scrolled .intro-title-screen__scroll {
  transition: opacity 800ms;
}

.intro-container.intro-container--not-started .intro-cta.intro-cta--end {
  display: none;
}

/* .intro-container.intro-container--started .intro-title-screen__ui {
  opacity: 0;
  transform: translateY(-40vh);
  pointer-events: none;
} */

.section__element--0-milo {
  z-index: 20 !important;
}

.section--2 .section__elements {
  position: fixed;
  top: 0;
  opacity: 0;
  transition: 1200ms;
}

.section--2.section--active .section__elements {
  opacity: 1;
}

.section--3.section--inactive .section__elements {
  opacity: 0;
}

.section--4 .section__elements {
  position: fixed;
  top: 0;
  opacity: 0;
  transition: 1200ms;
}

.section--4.section--active .section__elements {
  opacity: 1;
}

.section--5 .section__elements {
  position: absolute;
  bottom: 0;
}

.section--6 .section__element--6-milo {
  position: fixed;
  bottom: 0;
  opacity: 0;
  transition: opacity 600ms;
}

:has(.section--7.section--active) .section__element--6-milo,
.section--6.section--active .section__element--6-milo {
  opacity: 1;
}

.section--2 .section__text--0 {
  top: 10vh;
  left: 10vh;
}

.section--2 .section__text--1 {
  top: 25vh;
  left: 20vh;
}

.section--3 .section__text--0 {
  width: 100%;
  text-align: center;
  top: 5vh;
}

.section--4 .section__text--0 {
  top: unset;
  bottom: 8vh;
  right: 5vh;
  text-align: right;
}

.section--5 .section__text--0 {
  text-align: center;
  width: 100%;
  top: 5vh;
}

.section--5 .section__text--1 {
  text-align: center;
  width: 100%;
  top: 20vh;
}

.section--6 .section__text--0 {
  top: 5vh;
  left: 5vh;
}

.section--6 .section__text--1 {
  top: 22vh;
  left: 5vh;
}

.section--7 .section__text--0 {
  top: unset;
  text-align: center;
  width: 100%;
  bottom: 20vh;
}

.section--8 .section__text--0 {
  top: 5vh;
  left: 5vh;
}

.section--8 .section__text--1 {
  top: 22vh;
  left: 5vh;
}
</style>
