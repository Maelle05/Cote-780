<script setup>
import BtnChangeScene from "./components/UI/BtnChangeScene.vue";
import Intro from "./components/Views/Intro.vue";
import Scenes from "./components/Views/Scenes.vue";
import { ref } from "vue";
import { INIT_SCENE } from "./webgl/Constants/config";
import { state } from "./webgl/Utils/State";
import { EVENTS } from "@/webgl/Constants/events";

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
  <header>Cote 780</header>

  <main>
    <Intro v-if="isIntro" />
    <Scenes v-if="isScenes" :sceneIndex="sceneIndex" />
    <BtnChangeScene />
  </main>
</template>

<style scoped lang="scss"></style>
