<script setup>
import { defineProps, watchEffect, ref } from "vue"
import { gsap } from "gsap/all"

const props = defineProps({
  text: String,
  section: Number,
  sectionProgress: Number,
})

const isVisible = ref(false)

const LIMIT_APPEAR = 0.2
const LIMIT_DISAPPEAR = 0.8

const textAppear = () => {
  gsap.to(`.intro-text--${props.section}`, { filter: 'blur(0px)', opacity: 1, duration: 0.8 })
}

const textDisappear = () => {
  gsap.to(`.intro-text--${props.section}`, { filter: 'blur(8px)', opacity: 0, duration: 0.8 })
}

watchEffect(() => {
  if (
    isVisible.value === false &&
    props.sectionProgress > LIMIT_APPEAR &&
    props.sectionProgress < LIMIT_DISAPPEAR
  ) {
    isVisible.value = true
    textAppear()
  } else if (
    isVisible.value === true &&
    (props.sectionProgress > LIMIT_DISAPPEAR ||
      props.sectionProgress < LIMIT_APPEAR)
  ) {
    isVisible.value = false
    textDisappear()
  }
})
</script>

<template>
  <p
    :class="`intro-text intro-text--${section}`"
    :style="{ '--opacity': props.sectionProgress }"
  >
    {{ props.text }}
  </p>
</template>

<style scoped>
.intro-text {
  font-family: "Eczar";
  line-height: 1.4;
  font-size: 24px;
  padding: 24px;
  opacity: 0;
  max-width: 560px;
}
</style>
