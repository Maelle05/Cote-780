<script setup>
import BtnChangeScene from './components/UI/BtnChangeScene.vue'
import Intro from './components/Views/Intro.vue'
import Scenes from './components/Views/Scenes.vue';
import { ref } from 'vue'
import { INIT_SCENE } from './webgl/Constants/config';
import { state } from './webgl/Utils/State';
import { EVENTS } from '@/webgl/Constants/events';

const intro = ref(false)
const scenes = ref(false)

if (INIT_SCENE == 0) {
  intro.value = true
} else {
  scenes.value = true
}

state.on(EVENTS.CHANGE_SCENE, (e)=>{
  if (e == 0) {
    intro.value = true
    scenes.value = false
  } else {
    scenes.value = true
    intro.value = false
  }
})

</script>

<template>
  <header>
    Cote 780
  </header>

  <main>
    <Intro v-if="intro"/>
    <Scenes v-if="scenes"/>
    <BtnChangeScene />
  </main>
</template>

<style scoped lang="scss">
</style>
