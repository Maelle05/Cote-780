<script setup>
import { EVENTS } from "@/utils/constants/events";
import { state } from "@/utils/State";

import { ref, onMounted, nextTick } from "vue";
import { gsap } from "gsap";
import { app } from "@/App";

const hasDialogue = ref(false);
const person = ref("");
const text = ref("");
const letters = ref([]);

const wrapperRef = ref(null);
const wrapperHeight = ref(0);
const isWrapperReady = ref(false);

let isNewScene = false;

const props = defineProps({
  sceneIndex: Number,
  isVisible: Boolean,
});

let isAnimationInProgress = false;

const assignRef = (ref, element, match) => {
  if (element === match) {
    wrapperRef.value = ref;
  }
};

const updateHeight = () => {
  if (wrapperRef.value) {
    wrapperHeight.value = wrapperRef.value.offsetHeight;
  }
};

const animateLettersApparition = () => {
  if (isAnimationInProgress) return;

  isWrapperReady.value = false;
  isAnimationInProgress = true;

  gsap.to(".wrapper--original .letter", {
    opacity: 1,
    duration: 0.1,
    stagger: 0.02,
    delay: 0.2,
    onComplete: () => {
      isWrapperReady.value = true;
      isAnimationInProgress = false;
    },
  });
};

onMounted(() => {
  nextTick(() => {
    updateHeight();
  });
});

state.on(EVENTS.CHANGE_SCENE, (e) => {
  isNewScene = true;
});

state.on(EVENTS.CHANGE_SCENE_STEP, (e) => {
  isNewScene = false;
});

state.on(EVENTS.UPDATE_DIALOGUE, (e) => {
  const updateDialogueDelay = isNewScene ? 3000 : 0;

  setTimeout(() => {
    if (e) {
      gsap.to(".wrapper--original .letter", {
        opacity: 0,
        duration: hasDialogue.value === true ? 0.1 : 0.001,
        onComplete: () => {
          person.value = e.person;
          text.value = e.text;
          letters.value = text.value.split("");

          nextTick(() => {
            updateHeight();
            animateLettersApparition();
          });
        },
      });

      hasDialogue.value = true;
      if (e.audio) app.audio.dialog.play(e.audio);
    } else {
      hasDialogue.value = false;
    }
  }, updateDialogueDelay);
});

const onClickDialogue = () => {
  if (isAnimationInProgress) {
    gsap.killTweensOf(".wrapper--original .letter");
    gsap.set(".wrapper--original .letter", { opacity: 1 });
    isWrapperReady.value = true;
    isAnimationInProgress = false;
  } else {
    state.emit(EVENTS.GO_NEXT);
    app.audio.ui.play("click", 0.5);
  }
};
</script>

<template>
  <div
    @click="onClickDialogue"
    :ref="(ref) => assignRef(ref, element, 'clone')"
    :class="`wrapper wrapper--${element} wrapper--${
      isVisible && hasDialogue ? 'visible' : 'hidden'
    } wrapper--${isWrapperReady ? 'ready' : 'not-ready'}`"
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
  display: flex;
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
  transition: opacity 1000ms, height 800ms;
  box-sizing: border-box;
  user-select: none;
  cursor: pointer;

  &::after {
    display: block;
    content: "";
    height: 100%;
    width: 100%;
    position: absolute;
    top: 0;
    left: 0;
    background-image: url("/assets/images/icons/next.svg");
    background-size: 35px;
    background-repeat: no-repeat;
    background-position: calc(100% - 4px) calc(100% - 10px);
    opacity: 0;
    transition: opacity 600ms;
  }

  &.wrapper--ready {
    &::after {
      opacity: 0.5;
    }
  }

  span {
    pointer-events: none;
  }

  &.wrapper--clone {
    opacity: 0;
    pointer-events: none;
    height: auto;
  }

  &.wrapper--hidden {
    opacity: 0;
    pointer-events: none;

    .text {
      opacity: 0;
    }
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
  transition: opacity 600ms;

  .letter {
    opacity: 0;
  }
}
</style>
