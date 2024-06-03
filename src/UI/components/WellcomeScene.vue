<script setup>
import ChapterTitle from "./ChapterTitle.vue";
import ChapterIcon from "./ChapterIcon.vue";
import { state } from "../../utils/State"
import { EVENTS } from "../../utils/constants/events";
import { gsap } from "gsap/gsap-core";
import { ref, onMounted } from 'vue'

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
  <div ref='container' class='wellcome-scene-container' v-if='props.sceneIndex != 1'>
    <ChapterIcon :sceneIndex="props.sceneIndex"></ChapterIcon>
    <div class='wellcome-scene-container__chapter' >Chapitre {{props.sceneIndex - 1}}</div>
    <ChapterTitle :sceneIndex="props.sceneIndex"></ChapterTitle>
  </div>
</template>

<style scoped lang="scss">
.wellcome-scene-container {
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
    color: black;
    text-decoration: underline;
    margin: 10px 0 10px 0;
  }
}
</style>