<script setup>
import { EVENTS } from "@/webgl/Constants/events";
import { state } from "../../webgl/Utils/State";
import { ref } from "vue";
import WellcomeScene from "../UI/WellcomeScene.vue";
import Sound from "../UI/Sound.vue";

const props = defineProps({
  sceneIndex: Number,
});
</script>

<template>
  <WellcomeScene :sceneIndex="props.sceneIndex"> </WellcomeScene>
  <Sound></Sound>
</template>

<style scoped lang="scss"></style>
