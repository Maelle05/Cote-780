<script setup>
import { EVENTS } from "../../utils/constants/events";
import { state } from "../../utils/State";
import { ref } from "vue";
import WellcomeScene from "../components/WellcomeScene.vue";
import CollectionCairns from "../components/CollectionCairns.vue";
import Dialogues from "../components/Dialogues.vue";
import Sound from "../components/Sound.vue";

const props = defineProps({
  sceneIndex: Number,
});
</script>

<template>
  <WellcomeScene :sceneIndex="props.sceneIndex"> </WellcomeScene>
  <CollectionCairns />
  <Dialogues :sceneIndex="props.sceneIndex" />
  <!-- <Sound></Sound> -->
</template>

<style scoped lang="scss"></style>
