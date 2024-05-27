<script setup>
import { TITLES_SCENE } from "@/webgl/Constants/config";
import { ref, watch } from "vue";

const props = defineProps({
  sceneIndex: Number,
});
</script>

<template lang="">
  <div class="title">{{ TITLES_SCENE[props.sceneIndex] }}</div>
</template>

<style scoped lang="scss">
.title {
  position: absolute;
  left: 50%;
  top: 10%;
  transform: translate(-50%, -50%);
  // display: none;
}
</style>
