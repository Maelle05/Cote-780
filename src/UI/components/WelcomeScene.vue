<script setup>
import { state } from "../../utils/State"
import { EVENTS } from "../../utils/constants/events"
import { MAP_DATA } from "../../utils/constants/config"

import { useI18n } from "vue-i18n"
import { ref, onMounted, computed } from "vue"
import { gsap } from "gsap/gsap-core"

import ChapterTitle from "./ChapterTitle.vue"
import { app } from "@/App"

const { t } = useI18n()

const props = defineProps({
  sceneIndex: Number,
})

const sceneIndex = ref(0)
const isVisible = ref(false)
const pathRefs = ref([])

state.on(EVENTS.CHANGE_SCENE, (e) => {
  sceneIndex.value = e
  if (e === 1) return
  initApparition()
})

onMounted(() => {
  pathRefs.value.forEach((path) => {
    const length = path.getTotalLength()
    path.style.setProperty("--path-length", length)
  })

  if (props.sceneIndex > 1) {
    sceneIndex.value = props.sceneIndex
    initApparition()
  }
})

const initApparition = () => {
  isVisible.value = true
  setTimeout(() => {
    playApparitionAnimation()
  }, 100)
}

const playApparitionAnimation = () => {
  const apparitionTimeline = gsap.timeline()

  if (sceneIndex.value > 1) {
    const activePath = document.querySelector(
      ".welcome-scene__path--active-mask"
    )
    const pathLength = activePath ? activePath.getTotalLength() : 0
    const pathAnimDuration = activePath ? Math.max(0.8, pathLength / 200) : 0

    apparitionTimeline
      .to(".welcome-scene__point--last", {
        fill: "#b5ab96",
        duration: 0.8,
        delay: 0.3,
      })
      .to(
        activePath,
        {
          strokeDashoffset: pathLength * -1,
          duration: pathAnimDuration,
          ease: "linear",
        },
        "-=1"
      )
  }

  apparitionTimeline
    .to(".welcome-scene__point--active", {
      fill: "#3d5873",
      opacity: 1,
      duration: 0.8,
      onComplete: () => {
        document
          .querySelector(".welcome-scene__point--active")
          ?.classList.add("welcome-scene__point--ready")
      },
    })
    .to(
      "#watercolor-mask circle",
      {
        attr: { r: 130 },
        duration: 3,
        ease: "power4.out",
      },
      "-=0.8"
    )
}

const filteredMapData = computed(() => {
  return MAP_DATA.map((el) => {
    if (el.scene < sceneIndex.value - 1) {
      return { ...el, type: "inactive" }
    } else if (el.scene === sceneIndex.value - 1) {
      return { ...el, type: "last" }
    } else if (el.scene === sceneIndex.value) {
      return { ...el, type: "active" }
    } else {
      return { ...el, type: "hidden" }
    }
  })
})

const handleClickCircle = (type) => {
  if (!isVisible) return
  if (type !== "active") return

  isVisible.value = false
  state.emit(EVENTS.ASK_REMOVE_TRANSITION)

  setTimeout(() => {
    gsap.set("#watercolor-mask circle", {
      attr: { r: 0 },
    })
  }, 5000)

  // [WIP][son] jouer son
}

const handleMouseEnterCircle = (e) => {
  if (!isVisible) return

  // [WIP][son] jouer son
}
</script>

<template lang="">
  <div
    @click="handleClickContainer"
    :class="`welcome-scene__container welcome-scene__container--${
      isVisible ? 'visible' : 'hidden'
    } welcome-scene__container--${sceneIndex}`"
    v-if="sceneIndex != 1"
  >
    <div class="welcome-scene">
      <div class="welcome-scene__map">
        <img src="/assets/images/map/background.png" />
        <svg
          class="welcome-scene__svg"
          width="1435"
          height="784"
          viewBox="0 0 1435 784"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <filter id="blur">
              <feGaussianBlur stdDeviation="20" />
            </filter>
            <mask id="watercolor-mask" maskUnits="userSpaceOnUse">
              <g filter="url(#blur)">
                <rect x="0" y="0" width="100%" height="100%" fill="black" />
                <circle cx="60" cy="20" r="0" fill="white" />
                <circle cx="200" cy="30" r="0" fill="white" />
                <circle cx="340" cy="200" r="0" fill="white" />
                <circle
                  cx="60"
                  cy="100"
                  r="0"
                  :fill="
                    [4, 5, 6, 7].includes(sceneIndex) ? 'white' : 'transparent'
                  "
                />
                <circle
                  cx="460"
                  cy="0"
                  r="0"
                  :fill="[2, 5].includes(sceneIndex) ? 'white' : 'transparent'"
                />
              </g>
            </mask>
          </defs>

          <g v-for="(el, index) in filteredMapData">
            <path
              :d="el.path"
              :class="`welcome-scene__path welcome-scene__path--${el.type} welcome-scene__path--${el.scene}`"
            />
            <path
              :d="el.path"
              :class="`welcome-scene__path welcome-scene__path--${el.type}-mask welcome-scene__path--${el.scene}-mask`"
              ref="pathRefs"
            />
            <circle
              :key="index"
              :class="`welcome-scene__point welcome-scene__point--${el.type}`"
              :cx="el.point.x"
              :cy="el.point.y"
              @click="() => handleClickCircle(el.type)"
              @mouseenter="handleMouseEnterCircle"
              r="10"
            />
          </g>
        </svg>
      </div>
    </div>
    <div ref="textRef" class="welcome-scene__text">
      <div class="welcome-scene__chapter">
        {{ t("global.chapter") }} {{ sceneIndex - 1 }}
      </div>
      <ChapterTitle :sceneIndex="sceneIndex"></ChapterTitle>
    </div>
  </div>
</template>

<style scoped lang="scss">
.welcome-scene__container {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  pointer-events: all;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  transition: opacity 1000ms;
  background-color: var(--c-background-beige);
  overflow: hidden;

  &.welcome-scene__container--hidden {
    opacity: 0;
    pointer-events: none;
  }
}

.welcome-scene__map {
  display: grid;
  transition: opacity 1200ms;

  > * {
    grid-area: 1/-1;
  }
}

.welcome-scene__container--hidden {
  .welcome-scene__map {
    opacity: 0;
  }
}

.welcome-scene__chapter {
  color: var(--c-beige-dark);
  font-family: var(--ff-rubik);
  text-transform: uppercase;
  font-weight: 600;
  letter-spacing: 0.2em;
  font-size: 20px;
}

.welcome-scene__point {
  fill: #b5ab96;
  stroke: #fff;
  stroke-width: 2;

  &.welcome-scene__point--last {
    fill: #3d5873;
  }

  &.welcome-scene__point--hidden {
    opacity: 0;
  }

  &.welcome-scene__point--active {
    opacity: 0;
    cursor: pointer;
  }

  &.welcome-scene__point--ready {
    animation: animPoint 2s infinite;
    transition: stroke-width 600ms;

    &:hover {
      stroke-width: 4px;
    }
  }
}

@keyframes animPoint {
  0% {
    filter: drop-shadow(0 0 4px #fff);
    fill: #3d5873;
  }
  50% {
    filter: drop-shadow(0 0 12px #fff);
    fill: #b5ab96;
  }
  100% {
    filter: drop-shadow(0 0 4px #fff);
    fill: #3d5873;
  }
}

.welcome-scene__path {
  &.welcome-scene__path--last,
  &.welcome-scene__path--inactive {
    stroke: #b5ab96;
    stroke-width: 2;
    stroke-dasharray: 1 4;
    stroke-linecap: round;
  }
  &.welcome-scene__path--active {
    stroke: #b5ab96;
    stroke-width: 2;
    stroke-dasharray: 1 4;
    stroke-linecap: round;
  }
  &.welcome-scene__path--active-mask {
    stroke-width: 2;
    stroke: var(--c-background-beige);
    stroke-dasharray: var(--path-length);
    stroke-dashoffset: 0;
  }
}

.welcome-scene__text {
  user-select: none;
  mask: url(#watercolor-mask);
  -webkit-mask: url(#watercolor-mask);
  opacity: 1;
  position: absolute;
  left: 45vw;
  top: 50vh;
}

.welcome-scene__container--4 .welcome-scene__text,
.welcome-scene__container--5 .welcome-scene__text,
.welcome-scene__container--6 .welcome-scene__text,
.welcome-scene__container--7 .welcome-scene__text {
  left: 50vw;
  top: 45vh;
}

.welcome-scene__path--inactive.welcome-scene__path--6,
.welcome-scene__path--last.welcome-scene__path--6,
.welcome-scene__path--active.welcome-scene__path--6,
.welcome-scene__path--inactive.welcome-scene__path--7,
.welcome-scene__path--last.welcome-scene__path--7,
.welcome-scene__path--active.welcome-scene__path--7 {
  stroke: #fff;
}
.welcome-scene__path--active-mask.welcome-scene__path--7-mask {
  stroke: #66939a;
}

.welcome-scene__path--active-mask.welcome-scene__path--6-mask {
  stroke: #86aab3;
}
</style>
