<script setup>
import { EVENTS } from "../../utils/constants/events"
import { state } from "../../utils/State"

import { ref } from "vue"

import WelcomeScene from "../components/WelcomeScene.vue"
import CollectionCairns from "../components/CollectionCairns.vue"
import InteractionTutorial from "../components/InteractionTutorial.vue"
import Dialogues from "../components/Dialogues.vue"
import Navigation from "../components/Navigation.vue"

const props = defineProps({
  sceneIndex: Number,
  stepIndex: Number,
})

const isTutorialVisible = () => {
  if (props.sceneIndex === 2 && props.stepIndex === 2) {
    return true
  }

  if (props.sceneIndex === 3 && props.stepIndex === 2) {
    return true
  }

  if (props.sceneIndex === 4 && props.stepIndex === 1) {
    return true
  }

  if (props.sceneIndex === 5 && props.stepIndex === 2) {
    return true
  }

  return false
}

const isCollectionCairnsVisible = () => {
  if ([2, 3, 4, 5].includes(props.sceneIndex) && props.stepIndex === 5) {
    return true
  }

  return false
}
</script>

<template>
  <WelcomeScene :sceneIndex="props.sceneIndex"> </WelcomeScene>
  <CollectionCairns
    :sceneIndex="props.sceneIndex"
    :isVisible="isCollectionCairnsVisible()"
  />
  <InteractionTutorial
    :sceneIndex="props.sceneIndex"
    :isVisible="isTutorialVisible()"
  />
  <Dialogues :sceneIndex="props.sceneIndex" />
  <Navigation :sceneIndex="props.sceneIndex"></Navigation>
</template>

<style scoped lang="scss"></style>
