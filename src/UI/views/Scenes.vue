<script setup>
import { EVENTS } from "../../utils/constants/events";
import { state } from "../../utils/State";
import { ref } from "vue";
import WelcomeScene from "../components/WelcomeScene.vue";
import CollectionCairns from "../components/CollectionCairns.vue";
import Dialogues from "../components/Dialogues.vue";
import Navigation from "../components/Navigation.vue";

const props = defineProps({
  sceneIndex: Number,
});
</script>

<template>
  <WelcomeScene :sceneIndex="props.sceneIndex"> </WelcomeScene>
  <CollectionCairns />
  <Dialogues :sceneIndex="props.sceneIndex" />
  <Navigation :sceneIndex="props.sceneIndex"></Navigation>
</template>

<style scoped lang="scss"></style>
