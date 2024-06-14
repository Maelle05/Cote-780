<script setup>
import { EVENTS } from "../../utils/constants/events"
import { NEW_CAIRNS } from "../../utils/constants/config"
import { state } from "../../utils/State"

import { ref } from "vue"

import WelcomeScene from "../components/WelcomeScene.vue"
import NewCairn from "../components/NewCairn.vue"
import CairnsCollection from "../components/CairnsCollection.vue"
import InteractionTutorial from "../components/InteractionTutorial.vue"
import Dialogues from "../components/Dialogues.vue"
import Navigation from "../components/Navigation.vue"
import Credits from "../components/Credits.vue"
import { app } from "@/App";

const props = defineProps({
  sceneIndex: Number,
  stepIndex: Number,
})

let cairnsNumber = 0;
let isTutoPass = ref([]);

const isTutorialVisible = () => {
  if (props.sceneIndex === 2 && props.stepIndex === 3 && !isTutoPass.value.includes(2)) {
    return true
  }

  if (props.sceneIndex === 3 && props.stepIndex === 2 && !isTutoPass.value.includes(3)) {
    return true
  }

  if (props.sceneIndex === 4 && props.stepIndex === 2 && !isTutoPass.value.includes(4)) {
    return true
  }

  if (props.sceneIndex === 5 && props.stepIndex === 2 && !isTutoPass.value.includes(5)) {
    return true
  }

  return false
}

const isNewCairnVisible = () => {
  const newCairn = NEW_CAIRNS.some(cairn => cairn.scene === props.sceneIndex && cairn.step === props.stepIndex)
  
  if (newCairn) {
    cairnsNumber++
    return true
  }

  return false
}

const areCreditsVisible = () => {
  if (props.sceneIndex === 7 && props.stepIndex === 4) {
    return true
  }

  return false
}

const areDialoguesVisible = () => {
  if (props.sceneIndex === 0 || props.sceneIndex === 1) {
    return false
  }

  return true
}

const isCairnsCollectionVisible = () => {
  if (props.sceneIndex < 2) {
    return false
  } 
  
  if (props.sceneIndex === 2 && props.stepIndex < 6) {
    return false
  } 

  return true
}

state.on(EVENTS.TUTO_PASS, (e) => {
  isTutoPass.value.push(e)
})
</script>

<template>
  <WelcomeScene :sceneIndex="props.sceneIndex"> </WelcomeScene>
  <NewCairn
    :sceneIndex="props.sceneIndex"
    :isVisible="isNewCairnVisible()"
  />
  <InteractionTutorial
    :sceneIndex="props.sceneIndex"
    :isVisible="isTutorialVisible()"
  />
  <Dialogues :sceneIndex="props.sceneIndex" :isVisible="areDialoguesVisible()" />
  <CairnsCollection :isVisible="isCairnsCollectionVisible()" :sceneIndex="props.sceneIndex" :cairnsNumber="cairnsNumber"></CairnsCollection>
  <Credits :isVisible="areCreditsVisible()"></Credits>
</template>

<style scoped lang="scss"></style>
