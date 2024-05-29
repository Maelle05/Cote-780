<script setup>
import { state } from "../../webgl/Utils/State"
import { EVENTS } from "@/webgl/Constants/events";
import { gsap } from "gsap/gsap-core";
import { ref, onMounted } from 'vue'
import ChapterEl from './ChapterEl.vue'

const container = ref(null)
const stateProgress = ref([false, false, false, false, false])

state.on(EVENTS.VIEW_COLLECTION_CAIRNS, (e) => {
    stateProgress.value[e - 2] = true
    gsap.to(container.value, {
      opacity: 1,
      duration: 1,
      onComplete: () => {
        gsap.to(container.value, {
          delay: 2,
          opacity: 0,
          onComplete: () => {
            state.emit(EVENTS.CHANGE_SCENE, ((e + 1) % 7))
          }
        })
      }
    })
})

</script>

<template lang="">
  <div ref='container' class='collection-cairns-container'>
    <div class='collection-cairns-container__chapters'>
      <ChapterEl :id='2' :active='stateProgress[0]'/>
      <ChapterEl :id='3' :active='stateProgress[1]'/>
      <ChapterEl :id='4' :active='stateProgress[2]'/>
      <ChapterEl :id='5' :active='stateProgress[3]'/>
      <ChapterEl :id='6' :active='stateProgress[4]'/>
    </div>
  </div>
</template>

<style scoped lang="scss">
.collection-cairns-container {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: #FFFFFFAA;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  color: black;
  opacity: 0;

  &__chapters {
    display: flex;
    flex-direction: row;
  }
}
</style>
