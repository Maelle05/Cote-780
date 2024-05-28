<script setup>
import { EVENTS } from "@/webgl/Constants/events";
import { state } from "../../webgl/Utils/State";
import { ref } from "vue";
import WellcomeScene from "../UI/WellcomeScene.vue";
import CollectionCairns from "../UI/CollectionCairns.vue"
import Sound from "../UI/Sound.vue";

const props = defineProps({
  sceneIndex: Number,
});
</script>

<template>
  <WellcomeScene :sceneIndex="props.sceneIndex"> </WellcomeScene>
  <CollectionCairns/>
  <!-- <Sound></Sound> -->
</template>

<style scoped lang="scss"></style>
