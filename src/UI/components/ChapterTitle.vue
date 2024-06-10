<script setup>
import { TITLES_SCENE } from "../../utils/constants/config";

const props = defineProps({
  sceneIndex: Number,
});

const getWordLength = (word) => {
 if (word.split('').length < 4) {
  return "short"
 } else if (word.split('').length > 8) {
  return "long"
 } else {
  return "med"
 }
}
</script>

<template lang="">
  <h2 class="chapter-title">
    <span :class="`chapter-title__line chapter-title__line--${line.split(' ').length % 2 === 0 ? 'even' : 'odd'}`" v-for="line in TITLES_SCENE[props.sceneIndex]">
      <span :class="`chapter-title__word chapter-title__word--${getWordLength(word)}`" v-for="word in line.split(' ')">{{ word }}</span>
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

.chapter-title__word {
  display: inline-block;
}

.chapter-title__line:nth-child(1) {
  display: flex;
  gap: 0.2em;
  justify-content: center;
}

.chapter-title__word--short {
  --rotate-angle: 6;
}

.chapter-title__word--med {
  --rotate-angle: 3;
}

.chapter-title__word--long {
  --rotate-angle: 2;
}

.chapter-title__line--odd:nth-child(1) {

  .chapter-title__word:nth-child(odd) {
    transform: rotate(calc(var(--rotate-angle) * -1deg))
  }

  .chapter-title__word:nth-child(even) {
    transform: rotate(calc(var(--rotate-angle) * 1deg))
  }
}

.chapter-title__line--even:nth-child(1) {

  .chapter-title__word:nth-child(odd) {
    transform: rotate(calc(var(--rotate-angle) * 1deg))
  }

  .chapter-title__word:nth-child(even) {
    transform: rotate(calc(var(--rotate-angle) * -1deg))
  }
}
</style>