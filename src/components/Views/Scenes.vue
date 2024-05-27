<script setup>
import { EVENTS } from "@/webgl/Constants/events";
import { state } from "../../webgl/Utils/State";
import { ref } from "vue";
import ChapterTitle from "../UI/ChapterTitle.vue";
import Sound from "../UI/Sound.vue";

const props = defineProps({
  sceneIndex: Number,
});

console.log(props.sceneIndex);
</script>

<template>
  <ChapterTitle :sceneIndex="sceneIndex"> </ChapterTitle>
  <Sound></Sound>
</template>

<style scoped lang="scss"></style>
