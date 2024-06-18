<script setup>
import { ref, reactive, onMounted, onUnmounted } from "vue"
import { gsap, ScrollTrigger, ScrollToPlugin } from "gsap/all"
import { useI18n } from "vue-i18n"

import { EVENTS } from "../../utils/constants/events"
import { INTRO_SECTIONS } from "../../utils/constants/config"
import { state } from "../../utils/State"
import { app } from "@/App"

import IntroText from "../components/IntroText.vue"

const { t } = useI18n()

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin)

const isStarted = ref(false)
const hasScrolled = ref(false)
const activeSection = ref("")
const displayCtaEnd = ref(false)
const displayBtnNext = ref(false)

const scrollProgress = reactive([])
INTRO_SECTIONS.forEach((_, index) => {
  scrollProgress[index] = 0
})

const onClickCtaStart = () => {
  if (isStarted.value === false) {
    isStarted.value = true
  }

  setTimeout(() => {
    handleScrollTo(1)
  }, 400)
}

const onClickCtaEnd = () => {
  state.emit(EVENTS.GO_NEXT)
}

const onMouseEnterCta = () => {
  if (!app.audio) return

  app.audio.ui.play("click")
}

onMounted(() => {
  // [WIP] trouver mieux
  const timelines = []
  Array.from({ length: INTRO_SECTIONS.length }, (_, index) => {
    timelines.push(gsap.timeline())
  })

  timelines[0].to(
    `
  .section__element--0-milo-1, 
  .section__element--0-milo-2, 
  .section__element--0-milo-3, 
  .section__element--0-buisson`,
    {
      duration: 1,
      y: "-30vh",
    }
  )

  timelines[1]
    .fromTo(
      ".section__element--1-arbre",
      { y: "60vh" },
      { duration: 1, y: "-30vh" }
    )
    .fromTo(
      ".section__element--1-colline",
      { y: "10vh" },
      { duration: 1, y: "-10vh" },
      "<"
    )
    .fromTo(
      ".section__element--1-maison",
      { y: "20vh" },
      { duration: 1, y: "-15vh" },
      "<"
    )
    .fromTo(
      ".section__element--1-fumee",
      { y: "20vh", x: "150px" },
      {
        duration: 1,
        y: "-25vh",
        x: "150px",
        onComplete: () => {
          document
            .querySelector(".section__element--1-fumee")
            ?.classList.add("section__element--1-fumee--anim")
        },
      },
      "<"
    )
    .fromTo(
      ".section__element--1-buissons",
      { y: "25vh" },
      { duration: 1, y: "-10vh" },
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
    .fromTo(
      ".section__element--2-lettre",
      { opacity: "1" },
      { duration: 0.5, opacity: "1" }
    )

  timelines[3]
    .set(".section__element--3-chantier", { opacity: 0 })
    .set(".section__element--3-durance-colere", { opacity: 0 })
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
      { duration: 0.3, opacity: 1 }
    )
    .fromTo(
      ".section__element--3-durance-colere",
      { scale: 0.6 },
      { duration: 0.2, rotate: 4, y: "5vh", x: "7vw", scale: 0.8 },
      "-=0.3"
    )
    .fromTo(
      ".section__element--3-durance-colere",
      { opacity: "1" },
      { duration: 0.4, opacity: "1" }
    )

  timelines[4]
    .fromTo(
      ".section__element--4-durance",
      { y: "50vh" },
      { duration: 0.2, y: "0vh" }
    )
    .fromTo(
      ".section__element--4-grandma",
      { y: "100vh" },
      { duration: 0.2, y: "-25vh" },
      "<"
    )
    .fromTo(
      ".section__element--4-cairn",
      { y: "-38vh" },
      { duration: 0.1, y: "-23vh" },
      "<"
    )
    .fromTo(
      ".section__element--4-cairn",
      { opacity: 0 },
      {
        duration: 0.2,
        opacity: 1,
        onComplete: () => {
          document
            .querySelector(".section__element--4-cairn")
            ?.classList.add("section__element--4-cairn--anim")
        },
      },
      "-=0.1"
    )
    .fromTo(
      ".section__element--4-cairn",
      { opacity: "1" },
      {
        duration: 0.2,
        opacity: "1",
        onComplete: () => {
          document
            .querySelector(".section__element--4-cairn")
            ?.classList.remove("section__element--4-cairn--anim")
        },
      }
    )

  timelines[5]
    .fromTo(
      ".section__element--5-collines",
      { y: "10vh" },
      { duration: 0.1, y: "0vh" }
    )
    .fromTo(
      ".section__element--5-passage",
      { y: "30vh" },
      { duration: 0.1, y: "0vh" },
      "<"
    )

  timelines[6].fromTo(
    ".section__element--6-milo",
    { scale: "0.8" },
    { duration: 0.2, scale: "1.1" }
  )

  timelines[8].fromTo(
    ".section__element--8-carte",
    { opacity: 0, y: "-5vh", x: "50vw" },
    { duration: 1, opacity: 1, y: "-5vh", x: "12vw" },
    "<"
  )

  INTRO_SECTIONS.forEach((section, index) => {
    ScrollTrigger.create({
      trigger: `.section--${index}`,
      start: index === 0 ? "top top" : "top center",
      end: index === 0 ? "bottom top" : "bottom center",
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

        if (index === 0 && self.progress === 0) {
          hasScrolled.value = false
        } else {
          hasScrolled.value = true
        }

        if (index === 0 || index === 8) {
          displayBtnNext.value = false
        } else {
          displayBtnNext.value = true
        }

        if (index === 8 && self.progress > 0.4) {
          displayCtaEnd.value = true
        } else {
          displayCtaEnd.value = false
        }
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
  gsap.to(window, {
    scrollTo: { y: targetScroll, autoKill: true },
    duration: 1.5,
  })
}

const handleMouseMove = (event) => {
  if (activeSection.value > 0) {return;}

  const { clientX, clientY } = event
  const centerX = window.innerWidth / 2
  const centerY = window.innerHeight / 2

  const relativeX = (clientX - centerX) / centerX
  const relativeY = (clientY - centerY) / centerY

  const parallaxTimeline = gsap.timeline({ defaults: { duration: 0.8, ease: "power2.out" } });

  parallaxTimeline.to(".section__element--0-milo-1", { x: relativeX * -5, y: relativeY * -5 })
        .to(".section__element--0-milo-2", { x: relativeX * -15, y: relativeY * -15 }, "<")
        .to(".section__element--0-milo-3", { x: relativeX * -30, y: relativeY * -30 }, "<")
        .to(".section__element--0-buisson", { x: relativeX * -15, y: relativeY * -15 }, "<");

}
</script>

<template>
  <div
    @mousemove="handleMouseMove"
    :class="`intro__container 
    intro__container--${isStarted ? 'started' : 'not-started'} 
    ${hasScrolled ? 'intro__container--has-scrolled' : ''}`"
  >
    <div
      :class="`intro__next intro__next--${
        displayBtnNext ? 'visible' : 'hidden'
      }`"
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
    <p
      :class="`intro__cta intro__cta--end intro__cta--${
        displayCtaEnd ? 'visible' : 'hidden'
      }`"
      @click="onClickCtaEnd"
      @mouseenter="onMouseEnterCta"
    >
      <span>{{ t("intro.next") }}</span>
    </p>
    <div class="intro__title-screen">
      <div
        :class="`intro__ui intro__ui--${hasScrolled ? 'hidden' : 'visible'}`"
      >
        <div class="intro__logo">
          <img src="/assets/images/logo-dark.svg" :alt="t('global.title')" />
          <p class="intro__baseline">
            {{ t("global.baseline") }}
          </p>
        </div>
        <div
          @mouseenter="onMouseEnterCta"
          @click="onClickCtaStart"
          class="intro__cta intro__cta--start"
        >
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
    background-image: url("/assets/images/ui/noise.jpg");
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
  user-select: none;
  transition: transform 800ms, opacity 800ms;

  &.intro__ui--hidden {
    opacity: 0;
    transform: translateY(-100px);
  }
}

.intro__logo {
  text-align: center;

  img {
    width: 320px;
    margin-bottom: 20px;
  }
}

.intro__baseline {
  font-family: var(--ff-pangolin);
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

  &.intro__cta--hidden {
    opacity: 0;
    pointer-events: none;
  }

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
  position: fixed;
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

.intro__next {
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
  color: #fff;
  font-size: 24px;
  background-image: url("/assets/images/icons/down.svg");
  background-size: contain;
  box-sizing: border-box;
  padding: 8px;
  transition: opacity 1000ms, background-color 600ms, border 600ms,
    box-shadow 600ms;

  &.intro__next--hidden {
    opacity: 0;
    pointer-events: none;
  }

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

  .intro__cta.intro__cta--end {
    display: none;
  }
}

.section--0 .section__element--0-milo-1,
.section--0 .section__element--0-milo-2,
.section--0 .section__element--0-milo-3 {
  position: relative;
  top: 30px;
  left: -30px;
}

.section--0 .section__element--0-buisson {
  position: relative;
  top: 30px;
  right: -30px;
}

.section--1 .section__element {
  transition: opacity 800ms;
}

.section--1.section--inactive {
  .section__element {
    opacity: 0;
  }
}

.section--1 .section__element--1-fumee {
  position: relative;
  transition: opacity 600ms;
}

.section--1.section--active .section__element--1-fumee {
  animation: smokeAnim 4s infinite ease-in-out;
}

@keyframes smokeAnim {
  0% {
    top: 10px;
    left: 0;
    opacity: 0;
  }
  25% {
    opacity: 0.5;
  }
  50% {
    opacity: 0.5;
  }
  100% {
    top: -30px;
    left: 40px;
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

.section--4 .section__element--4-cairn--anim {
  animation: floatCairn 4s infinite ease-in-out;
}

@keyframes floatCairn {
  0% {
    transform: translateY(-23vh);
  }

  50% {
    transform: translateY(calc(-23vh - 20px));
  }

  100% {
    transform: translateY(-23vh);
  }
}

.section--5 .section__elements {
  position: absolute;
  bottom: 0;
}

.section--6 .section__element--6-milo {
  position: fixed;
  bottom: 0;
  opacity: 0;
  transition: opacity 1200ms;
}

:has(.section--7.section--active) .section__element--6-milo,
.section--6.section--active .section__element--6-milo {
  opacity: 1;
}

// :has(.section--7.section--active) .section__element--6-milo {
// filter: drop-shadow(0 4px 100px #b0a591);
// animation: glowingMilo 4s var(--filter-transition-duration) infinite
//   ease-in-out;
// }

// @keyframes glowingMilo {
//   0% {
//     filter: drop-shadow(0 4px 100px #b0a591);
//   }

//   50% {
//     filter: drop-shadow(0 4px 32px #b0a591);
//   }

//   100% {
//     filter: drop-shadow(0 4px 100px #b0a591);
//   }
// }

.section--7 .section__elements {
  position: fixed;
  top: 0;
  opacity: 0;
  transition: opacity 1200ms;
}

.section--7.section--active .section__elements {
  opacity: 1;
}

.section__element--7-cairns {
  animation: floatCairns 4s infinite ease-in-out;
}

@keyframes floatCairns {
  0% {
    transform: translateY(0);
  }

  50% {
    transform: translateY(-20px);
  }

  100% {
    transform: translateY(0);
  }
}

.section--1 .section__text p {
  font-family: var(--ff-rubik);
  max-width: 860px;
  line-height: 140%;
  font-size: 18px;
}

.section--1 .section__text--0 {
  left: 38vw;
  top: 4vh;
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
  top: 18vh;
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
  bottom: 8vh;
  left: 5vh;
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
