<script setup>
import { ref, reactive, onMounted, onUnmounted } from "vue"
import { gsap, ScrollTrigger } from "gsap/all"
import { useI18n } from "vue-i18n"

import { EVENTS } from "../../utils/constants/events"
import { INTRO_SECTIONS } from "../../utils/constants/config"
import { state } from "../../utils/State"

import IntroText from "../components/IntroText.vue"

const { t } = useI18n()

gsap.registerPlugin(ScrollTrigger)

const isStarted = ref(false)
const hasScrolled = ref(false)
const activeSection = ref("")

const scrollProgress = reactive([])
INTRO_SECTIONS.forEach((_, index) => {
  scrollProgress[index] = 0
})

state.on(EVENTS.START_EXP, (e) => {
  isStarted.value = true
})

const onClickCtaStart = () => {
  if (isStarted.value === false) {
    isStarted.value = true
  }

  setTimeout(() => {
    handleScrollTo(1)
  }, 100)
}

const onClickCtaEnd = () => {
  state.emit(EVENTS.GO_NEXT)
}

onMounted(() => {
  // [WIP] trouver mieux
  const timelines = []
  Array.from({ length: INTRO_SECTIONS.length }, (_, index) => {
    timelines.push(gsap.timeline())
  })

  timelines[0]
    .to(".section__element--0-milo", { duration: 1, y: "-30vh" })
    .to(".section__element--0-buisson", { duration: 1, y: "-20vh" }, "<")

  timelines[1]
    .fromTo(
      ".section__element--1-arbre",
      { y: "30vh" },
      { duration: 1, y: "0vh" }
    )
    .fromTo(
      ".section__element--1-colline-1",
      { y: "10vh" },
      { duration: 1, y: "0" },
      "<"
    )
    .fromTo(
      ".section__element--1-colline-2",
      { y: "15vh" },
      { duration: 1, y: "0" },
      "<"
    )
    .fromTo(
      ".section__element--1-maison",
      { y: "20vh" },
      { duration: 1, y: "0vh" },
      "<"
    )
    .fromTo(
      ".section__element--1-buisson-droite",
      { x: "-10vh", y: "25vh" },
      { duration: 1, x: "0vh", y: "0" },
      "<"
    )
    .fromTo(
      ".section__element--1-buisson-gauche",
      { x: "10vh", y: "25vh" },
      { duration: 1, x: "0vh", y: "0" },
      "<"
    )

  timelines[2]
    .fromTo(
      ".section__element--2-lumiere",
      { opacity: 0 },
      { duration: 0.5, opacity: 1 },
      "-=0.2"
    )
    .fromTo(
      ".section__element--2-enveloppe, .section__element--2-lettre",
      { opacity: 0 },
      { duration: 0.2, opacity: 1 },
      "<"
    )
    .fromTo(
      ".section__element--2-enveloppe",
      { x: "30vw" },
      { duration: 0.5, x: "20vw" },
      "<"
    )
    .fromTo(
      ".section__element--2-lettre",
      { x: "40vw" },
      { duration: 0.5, x: "20vw" },
      "<"
    )

  timelines[3]
    .fromTo(
      ".section__element--3-chantier",
      { opacity: 0 },
      { duration: 0.1, opacity: 1 }
    )
    .fromTo(
      ".section__element--3-chantier",
      { scale: 0.6 },
      { duration: 0.2, rotate: -9, y: "-7vh", x: "-7vw", scale: 0.8 },
      "-=0.1"
    )
    .fromTo(
      ".section__element--3-durance-colere",
      { opacity: 0 },
      { duration: 0.1, opacity: 1 }
    )
    .fromTo(
      ".section__element--3-durance-colere",
      { scale: 0.6 },
      { duration: 0.2, rotate: 4, y: "5vh", x: "7vw", scale: 0.8 },
      "-=0.1"
    )

  timelines[4]
    .fromTo(
      ".section__element--4-durance-1",
      { y: "50vh" },
      { duration: 0.2, y: "0vh" }
    )
    .fromTo(
      ".section__element--4-durance-3",
      { y: "55vh" },
      { duration: 0.2, y: "0vh" },
      "<"
    )
    .fromTo(
      ".section__element--4-durance-2",
      { y: "60vh" },
      { duration: 0.2, y: "-5vh" },
      "<"
    )
    .fromTo(
      ".section__element--4-grandma",
      { y: "100vh" },
      { duration: 0.2, y: "-25vh" },
      "<"
    )
    .fromTo(
      ".section__element--4-cairn",
      { y: "-40vh" },
      { duration: 0.1, y: "-23vh" },
      "<"
    )
    .fromTo(
      ".section__element--4-cairn",
      { opacity: 0 },
      { duration: 0.1, opacity: 1 },
      "-=0.1"
    )

  timelines[5]
    .fromTo(
      ".section__element--5-collines",
      { y: "10vh" },
      { duration: 0.1, y: "0vh" }
    )
    .fromTo(
      ".section__element--5-passage",
      { y: "20vh" },
      { duration: 0.1, y: "-10vh" },
      "<"
    )

  timelines[6].fromTo(
    ".section__element--6-milo",
    { scale: "0.8" },
    { duration: 0.2, scale: "1.1" }
  )

  timelines[8].fromTo(
    ".section__element--carte",
    { opacity: 0, y: "-5vh", x: "50vw" },
    { duration: 1, opacity: 1, y: "-5vh", x: "12vw" },
    "<"
  )

  INTRO_SECTIONS.forEach((section, index) => {
    ScrollTrigger.create({
      trigger: `.section--${index}`,
      // start: section === 2 ? "top bottom" : 'top center',
      // end: section === 2 ? "top top" : "bottom center",
      start: index === 0 ? "top top" : "top bottom",
      end: index === 0 ? "bottom top" : "top top-=200px",
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
})

const handleScrollTo = (section) => {
  console.log(section)
  const targetSection = document.querySelector(
    `.section--${section === 0 ? 1 : section}`
  )
  if (!targetSection) return
  const targetScroll = targetSection.offsetTop
  window.scrollTo({
    top: targetScroll,
    behavior: "smooth",
  })
}
</script>

<template>
  <div
    :class="`intro__container 
    intro__container--${isStarted ? 'started' : 'not-started'} 
    ${hasScrolled ? 'intro__container--has-scrolled' : ''}`"
  >
    <div
      :class="`next__button`"
      @click="() => handleScrollTo(activeSection + 1)"
    ></div>
    <div
      :class="`
      section 
      section--${index}
      section--${activeSection === index ? 'active' : 'inactive'}`"
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
      <div class="section__texts">
        <div
          :class="`section__text section__text--${id}`"
          v-for="(text, id) in section.texts"
        >
          <IntroText
            :text="text"
            :audio="section.audios[id]"
            :index="id"
            :section="index"
            :sectionProgress="scrollProgress[index]"
          />
        </div>
      </div>
    </div>
    <p class="intro__cta intro__cta--end" @click="onClickCtaEnd">
      <span>{{ t("intro.next") }}</span>
    </p>
    <div class="intro__title-screen">
      <div class="intro__ui">
        <div class="intro__logo">
          <img src="/assets/images/logo-dark.svg" :alt="t('global.title')" />
          <p class="intro__baseline">
            {{ t("global.baseline") }}
          </p>
        </div>
        <div @click="onClickCtaStart" class="intro__cta intro__cta--start">
          <span>{{ t("intro.start") }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
* {
  box-sizing: border-box;
}

.intro__container {
  pointer-events: all;
  position: absolute;
  top: 0;
  overflow: hidden;
  width: 100%;
  color: #000;
  background-color: var(--c-background-beige);

  &::after {
    display: block;
    content: "";
    position: fixed;
    top: -200px;
    left: -200px;
    height: calc(100% + 400px);
    width: calc(100% + 400px);
    background-image: url("/assets/textures/Noise/Grainy/Grainy_11-256x256.png");
    z-index: 5;
    mix-blend-mode: soft-light;
    background-size: 140px;
    opacity: 0.25;
    pointer-events: none;
    animation: grainJump 3s steps(3) infinite;
  }
}

@keyframes grainJump {
  0% {
    transform: translate(0, 0);
  }
  33% {
    transform: translate(-100px, 200px);
  }
  66% {
    transform: translate(140px, -120px);
  }
}

.intro__title-screen {
  height: 100vh;
  width: 100vw;
  display: grid;
  align-items: center;
  justify-content: center;
  position: absolute;
  top: 0;
  padding: 10vh;
}

.intro__title-screen > * {
  grid-area: 1 / -1;
}

.intro__ui {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 92px;
  transition: transform 800ms, opacity 800ms;
}

.intro__logo {
  text-align: center;

  img {
    width: 320px;
    margin-bottom: 20px;
  }
}

.intro__baseline {
  font-family: var(--ff-eczar);
  font-size: 32px;
  color: #013946;
  text-transform: lowercase;
  letter-spacing: 0.12em;
}

.intro__cta {
  cursor: pointer;
  font-family: var(--ff-rubik);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-weight: 400;
  color: #fff;
  z-index: 20;
  display: grid;
  align-items: center;
  justify-content: center;
  position: relative;
  text-shadow: 0 0 0 #ffffff7e;
  transition: letter-spacing 600ms, opacity 600ms, text-shadow 600ms;

  span {
    grid-area: 1 / -1;
    position: relative;
    z-index: 1;
    text-align: center;
    font-size: 18px;
    font-weight: 400;
    text-decoration: underline;
    color: var(--c-stroke-beige-light);
    text-decoration-thickness: 0.07em;
    text-underline-offset: 0.4em;
  }

  &::before,
  &::after {
    opacity: 0.2;
    position: absolute;
    width: 140%;
    left: -20%;
    height: 90px;
    display: block;
    content: "";
    background-size: contain;
    background-repeat: no-repeat;
    transition: opacity 600ms;
  }

  &::before {
    background-image: url("/assets/images/ui/ornaments-1.svg");
    background-position: left;
  }

  &::after {
    background-image: url("/assets/images/ui/ornaments-2.svg");
    background-position: right;
  }

  &:hover {
    text-shadow: 0 0 14px #ffffff96;
    letter-spacing: 0.16em;

    &::before,
    &::after {
      opacity: 0.5;
    }
  }
}

.intro__cta--end {
  position: absolute;
  bottom: 10vh;
  left: 50%;
  transform: translateX(-50%);

  span {
    color: var(--c-turquoise-dark);
  }

  &::before,
  &::after {
    width: 200%;
    left: -50%;
    // height: 90px;
    opacity: 0.4;
  }

  &:hover {
    &::before,
    &::after {
      opacity: 0.7;
    }
  }
}

.next__button {
  position: fixed;
  left: 50%;
  transform: translateX(-50%);
  bottom: 5vh;
  z-index: 50;
  cursor: pointer;
  border-radius: 100%;
  background-color: #3d58734d;
  height: 52px;
  width: 52px;
  justify-self: center;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: opacity 800ms;
  box-shadow: 0 0 0 #ffffff8a;
  border: 1px solid #ffffff4d;
  transition: opacity 1000ms, background-color 600ms, border 600ms,
    box-shadow 600ms;
  color: #fff;
  font-size: 24px;
  background-image: url("/assets/images/icons/down.svg");
  background-size: contain;
  box-sizing: border-box;
  padding: 8px;

  &:hover {
    border: 1px solid #fff;
    background-color: var(--c-turquoise-medium);
    box-shadow: 0 0 12px #ffffff42;
  }
}

.section {
  display: grid;
  height: 100vh;
  width: 100vw;
  position: relative;
  pointer-events: all;

  &.section--inactive {
    pointer-events: none;
  }
}

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

.intro__container.intro__container--not-started {
  height: 100vh;

  .next__button {
    opacity: 0;
    pointer-events: none;
  }

  .intro__cta.intro__cta--end {
    display: none;
  }
}

.intro__container.intro__container--started {
  .intro__cta.intro__cta--start {
    opacity: 0;
    pointer-events: none;
  }
}

:has(.section--0.section--active) .next__button,
:has(.section--8.section--active) .next__button {
  opacity: 0;
  pointer-events: none;
}

.section--1 .section__element {
  transition: opacity 800ms;
}

.section--1.section--inactive {
  .section__element--1-arbre,
  .section__element--1-maison {
    opacity: 0;
  }
}

.section--2 .section__elements {
  position: fixed;
  top: 0;
  opacity: 0;
  transition: opacity 1200ms;
}

.section--2.section--active .section__elements {
  opacity: 1;
}

.section--3 .section__elements {
  position: fixed;
  top: 0;
  opacity: 0;
  transition: opacity 1200ms;
}

.section--3 .section__elements > img {
  transform: scale(0.7);
}

.section--3.section--active .section__elements {
  opacity: 1;
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

.section--1 .section__text p {
  font-family: var(--ff-rubik);
  max-width: 860px;
  line-height: 140%;
  font-size: 18px;
}

.section--1 .section__text--0 {
  left: 40vw;
  top: 6vh;
  max-width: 590px;
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
