<script setup>
import { TITLES_SCENE } from "@/webgl/Constants/config";
import { ref, watch } from "vue";

const props = defineProps({
  sceneIndex: Number,
});
</script>

<template lang="">
  <h2 class="title">{{ TITLES_SCENE[props.sceneIndex] }}</h2>
</template>

<style scoped lang="scss">
.title{
  color: black;
}
</style>
