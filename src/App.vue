<script setup>
import BtnChangeScene from "./UI/components/BtnChangeScene.vue";
import Intro from "./UI/views/Intro.vue";
import Scenes from "./UI/views/Scenes.vue";
import { ref } from "vue";
import { INIT_SCENE } from "./utils/constants/config";
import { state } from "./utils/State";
import { EVENTS } from "./utils/constants/events";

const isIntro = ref(false);
const isScenes = ref(false);
const sceneIndex = ref(INIT_SCENE);

if (INIT_SCENE == 0) {
  isIntro.value = true;
} else {
  isScenes.value = true;
}

state.on(EVENTS.CHANGE_SCENE, (e) => {
  sceneIndex.value = e;

  if (e == 0) {
    isIntro.value = true;
    isScenes.value = false;
  } else {
    isScenes.value = true;
    isIntro.value = false;
  }
});
</script>

<template>
  <header></header>

  <main>
    <div>
      <img class="logo" src="/assets/images/logo.png" />
    </div>
    <Intro v-if="isIntro" />
    <Scenes v-if="isScenes" :sceneIndex="sceneIndex" />
    <BtnChangeScene />
  </main>
</template>

<style scoped lang="scss">
main {
  img.logo {
    position: absolute;
    width: 70px;
    top: 10px;
    left: 15px;
  }
}
</style>