<script setup>
import { TITLES_SCENE } from "../../utils/constants/config";

const props = defineProps({
  sceneIndex: Number,
});
</script>

<template lang="">
  <h2 class="chapter-title">
    <span v-for="line in TITLES_SCENE[props.sceneIndex]">
      {{ line }}
    </span>    
  </h2>
</template>

<style scoped lang="scss">
.chapter-title {
  color: var(--c-text-turquoise);
  display: flex;
  flex-direction: column;
  font-family: var(--ff-eczar);
  line-height: 1em;
  font-size: 92px;
  font-weight: 400;
  text-align: center;
  margin-top: 42px;
}
</style>