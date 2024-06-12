<script setup>
import { useI18n } from "vue-i18n"

import { state } from "../../utils/State"
import { EVENTS } from "../../utils/constants/events";
import { gsap } from "gsap/gsap-core";
import { ref, onMounted } from 'vue'

import ChapterTitle from "./ChapterTitle.vue";

const { t } = useI18n()

const props = defineProps({
  sceneIndex: Number,
});
const container = ref(null)

onMounted(() => {
  setTimeout(()=>{
    gsap.to(container.value, {
      opacity: 0,
      duration: 0.3,
    })
  }, 1500)
})

state.on(EVENTS.CHANGE_SCENE, (e) => {
  setTimeout(()=>{
    if(e > 1){
      container.value.style.opacity = 1
      setTimeout(()=>{
        gsap.to(container.value, {
          opacity: 0,
          duration: 0.3,
        })
      }, 1500)
    }
  }, 100)
})



</script>

<template lang="">
  <div ref='container' class='welcome-scene-container' v-if='props.sceneIndex != 1'>
    <div class='welcome-scene-container__chapter' >
      {{ t("global.chapter") }} {{props.sceneIndex - 1}}
    </div>
    <ChapterTitle :sceneIndex="props.sceneIndex"></ChapterTitle>
  </div>
</template>

<style scoped lang="scss">
.welcome-scene-container {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;

  // background-color: #FFFFFFAA;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  &__chapter{
    color: var(--c-text-turquoise);
    font-family: var(--ff-rubik);
    text-transform: uppercase;
    font-weight: 600;
    letter-spacing: 0.2em;
    font-size: 20px;
  }
}
</style>