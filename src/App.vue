<script setup>
import Navigation from "./UI/components/Navigation.vue";
import BtnChangeScene from "./UI/components/BtnChangeScene.vue";
import Intro from "./UI/views/Intro.vue";
import Scenes from "./UI/views/Scenes.vue";
import Loader from "./UI/components/Loader.vue";
import MobileDisclaimer from "./UI/views/MobileDisclaimer.vue";
import { ref, onMounted } from 'vue';
import { INIT_SCENE } from "./utils/constants/config";
import { state } from "./utils/State";
import { EVENTS } from "./utils/constants/events";

const isIntro = ref(false);
const isScenes = ref(false);
const sceneIndex = ref(INIT_SCENE);
const stepIndex = ref(0);
const isMobile = ref(false);

const LIMIT_MOBILE = 800

onMounted(() => {
  if (window.innerWidth < LIMIT_MOBILE) {
    isMobile.value = true
  }
})

state.on(EVENTS.RESIZE, () => {
  if (window.innerWidth < LIMIT_MOBILE) {
    isMobile.value = true
  } else {
    isMobile.value = false
  }
})

if (INIT_SCENE == 0) {
  isIntro.value = true;
} else {
  isScenes.value = true;
}

state.on(EVENTS.CHANGE_SCENE, (e) => {
  sceneIndex.value = e;
  stepIndex.value = 0;

  if (e == 0) {
    isIntro.value = true;
    isScenes.value = false;
  } else {
    isScenes.value = true;
    isIntro.value = false;
  }
});

state.on(EVENTS.CHANGE_SCENE_STEP, (e) => {
  stepIndex.value++
})
</script>

<template>
  <header></header>

  <main>
    <div>
      <img :class="`logo logo--${isScenes ? 'visible' : 'hidden'}`" src="/assets/images/logo.svg" />
    </div>
    <Loader />
    <div v-if="isMobile === false">
      <Navigation :sceneIndex="sceneIndex"></Navigation>
      <Intro v-if="isIntro" />
      <Scenes v-if="isScenes" :sceneIndex="sceneIndex" :stepIndex="stepIndex" />
      <BtnChangeScene />
    </div>
    <div v-if="isMobile === true">
      <MobileDisclaimer></MobileDisclaimer>
    </div>
  </main>
</template>

<style scoped lang="scss">
main {
  img.logo {
    position: absolute;
    width: 70px;
    top: 16px;
    left: 16px;
    user-select: none;
    z-index: 110;
    transition: opacity 600ms;

    &.logo--hidden {
      opacity: 0;
    }
  }
}
</style>