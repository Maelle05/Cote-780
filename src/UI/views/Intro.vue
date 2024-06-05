<script setup>
import { EVENTS } from "../../utils/constants/events"
import { INTRO_SECTIONS } from "../../utils/constants/config"
import { state } from "../../utils/State"
import { ref, watch, onMounted, onUnmounted } from "vue"
import { gsap, ScrollTrigger } from "gsap/all"
import { useI18n } from "vue-i18n";

const { t } = useI18n();

gsap.registerPlugin(ScrollTrigger)

const isStarted = ref(false)
const hasScrolled = ref(false)
const activeSection = ref("")

const onActiveSectionChange = (newVal, oldVal) => {
  state.emit(EVENTS.INTRO_CHANGE_SECTION, newVal)

  const updatedText = INTRO_SECTIONS[newVal]?.text
  if (updatedText !== undefined) {
    state.emit(EVENTS.INTRO_UPDATE_TEXT, { text: updatedText })
  }
}

watch(activeSection, onActiveSectionChange)

const onClickCtaStart = () => {
  isStarted.value = true
}

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
    { y: "150vh", x: "50vw" },
    { duration: 0.5, y: "-50vh", x: "0" },
    "-=1"
  )

  timelines[3].fromTo(
    ".section__element--construction-barrage",
    { scale: 0.4, opacity: 0, x: "-100vh", y: "60vh" },
    { duration: 0.3, scale: 0.9, opacity: 1, x: "0vh", y: "-20vh" },
    "-=0.9"
  )

  timelines[3].fromTo(
    ".section__element--durance-colere",
    { scale: 0.4, opacity: 0, x: "50vh", y: "100vh" },
    { duration: 0.2, scale: 0.9, opacity: 1, x: "0vh", y: "40vh" },
    "-=0.7"
  )

  timelines[5].fromTo(
    ".section__element--mamie-lien-durance-1",
    { x: "-100vh" },
    { duration: 0.02, x: "0vh" },
    "-=1"
  )

  timelines[5].fromTo(
    ".section__element--mamie-lien-durance-2",
    { x: "100vh" },
    { duration: 0.02, x: "0vh" },
    "-=1"
  )

  timelines[6].fromTo(
    ".section__element--passage-lac",
    { y: "60vh" },
    { duration: 1, y: "-20vh" },
    "-=1"
  )

  timelines[7].fromTo(
    ".section__element--milo",
    { y: "60vh" },
    { duration: 0.5, y: "-20vh" },
    "-=1"
  )

  timelines[8].fromTo(
    ".section__element--collier",
    { x: "-60vh", y: "80vh" },
    { duration: 0.5, x: "0vh", y: "0vh" },
    "-=1"
  )

  timelines[8].fromTo(
    ".section__element--carte",
    { x: "60vh" },
    { duration: 0.5, x: "0vh" },
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
    })
  })

  window.addEventListener('scroll', handleScroll);

  onUnmounted(() => {
    window.removeEventListener("scroll", handleScroll)
  })
})
</script>

<template>
  <div
    :class="`intro-container 
    intro-container--${
      isStarted ? 'started' : 'not-started'
    } 
    ${hasScrolled ? 'intro-container--has-scrolled' : ''}`
    "
  >
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
    <p class="intro-cta intro-cta--end" @click="onClickCtaEnd">Compris !</p>
    <div class="intro-title-screen">
      <div class="intro-title-screen__ui">
        <img src="/src/assets/logo/cote-780.png" alt="Cote 780" />
        <p class="intro-cta intro-cta--start" @click="onClickCtaStart">
          {{ t('intro.start') }}
        </p>
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
  color: #000;
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
  max-width: 320px;
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
}

.intro-cta--end {
  position: absolute;
  bottom: 10vh;
  left: 50%;
  transform: translateX(-50%);
}

.section {
  height: 150vh;
  width: 100%;
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

.intro-container.intro-container--started .intro-title-screen__ui {
  opacity: 0;
  transform: translateY(-40vh);
  pointer-events: none;
}
</style>