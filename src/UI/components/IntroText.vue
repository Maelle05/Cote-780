<script setup>
import { app } from "@/App";
import { defineProps, watchEffect, ref } from "vue";

const props = defineProps({
  text: String,
  index: Number,
  section: Number,
  sectionProgress: Number,
  audio: String,
})

const isVisible = ref(false)

const LIMIT_APPEAR = 0.2
const LIMIT_DISAPPEAR = 0.8

watchEffect(() => {
  if (
    isVisible.value === false &&
    props.sectionProgress > LIMIT_APPEAR &&
    props.sectionProgress < LIMIT_DISAPPEAR
  ) {
    setTimeout(() => {
      isVisible.value = true
    }, 500 * props.index);
    app.audio.dialog.play(props.audio);
  } else if (
    isVisible.value === true &&
    (props.sectionProgress > LIMIT_DISAPPEAR ||
      props.sectionProgress < LIMIT_APPEAR)
  ) {
    isVisible.value = false
  }
})
</script>

<template>
  <p
    :class="`intro-text intro-text--${isVisible ? 'visible' : 'hidden'} intro-text--${section}-${index}`"
  >
    {{ props.text }}
  </p>
</template>

<style scoped>
.intro-text {
  --c-shadow: #fbf9f4;
  color: #000000;
  font-family: "Eczar";
  line-height: 1.4;
  font-size: 24px;
  padding: 24px;
  opacity: 0;
  max-width: 560px;
  /* text-shadow: 
    0 0 50px var(--c-shadow), 
    0 0 40px var(--c-shadow), 
    0 0 20px var(--c-shadow), 
    0 0 5px var(--c-shadow), 
    0 0 2px var(--c-shadow); */
  margin: 0 auto;
  opacity: 0;
  transition: opacity 1000ms;
}

.intro-text--visible {
  opacity: 1;
}

.intro-text--3-0 {
  max-width: 660px;
}

.intro-text--5-0 {
  max-width: 860px;
}

.intro-text--7-0 {
  font-size: 28px;
  max-width: 680px;
}
</style>
