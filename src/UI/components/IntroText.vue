<script setup>
import { app } from "@/App"
import { defineProps, watchEffect, ref, onMounted, onUnmounted } from "vue"

const props = defineProps({
  text: Object,
  index: Number,
  section: Number,
  sectionProgress: Number,
  audio: String,
})

onMounted(() => {
  console.log("0104")
})

const isVisible = ref(false)
const timeoutId = ref(null)

const LIMIT_APPEAR = 0.2
const LIMIT_DISAPPEAR = 0.99

watchEffect(() => {
  if (
    isVisible.value === false &&
    props.sectionProgress > LIMIT_APPEAR &&
    props.sectionProgress < LIMIT_DISAPPEAR
  ) {
    timeoutId.value = setTimeout(() => {
      isVisible.value = true
    }, props.text.delay)
    if (props.audio && app.audio) {
      app.audio.dialog.play(props.audio)
    }
  } else if (
    isVisible.value === true &&
    (props.sectionProgress > LIMIT_DISAPPEAR ||
      props.sectionProgress < LIMIT_APPEAR)
  ) {
    isVisible.value = false
    if (timeoutId.value) {
      clearTimeout(timeoutId.value)
      timeoutId.value = null
    }
  }
})

onUnmounted(() => {
  if (timeoutId.value) {
    clearTimeout(timeoutId.value)
  }
})
</script>

<template>
  <p
    :class="`intro-text intro-text--${
      isVisible ? 'visible' : 'hidden'
    } intro-text--${section}-${index}`"
  >
    <span v-html="props.text.ref"></span>
  </p>
</template>

<style scoped>
.intro-text {
  --c-shadow: #fbf9f4;
  color: #000000;
  font-family: "Eczar";
  line-height: 1.4;
  font-size: 22px;
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
  position: relative;
  transition: opacity 1000ms;

  &::before {
    z-index: -1;
    content: "";
    display: block;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-repeat: no-repeat;
    background-size: contain;
  }

  span {
    position: relative;
  }
}

.intro-text--visible {
  opacity: 1;
}

.intro-text.intro-text--2-0::before {
  top: -20px;
  left: -20px;
  right: -20px;
  background-image: url("/assets/images/ui/text-bg-1.png");
  transform: rotate(-3deg);
}

.intro-text.intro-text--2-1::before {
  left: -10px;
  background-image: url("/assets/images/ui/text-bg-2.png");
  transform-origin: left;
  transform: scaleY(0.8) scaleX(1.4);
}

.intro-text.intro-text--3-0::before {
  top: -10px;
  bottom: -10px;
  left: 10px;
  background-image: url("/assets/images/ui/text-bg-1.png");
  transform-origin: left;
  transform: scaleY(0.9) scaleX(1.1) rotate(-3deg);
}

.intro-text.intro-text--4-0::before {
  top: -10px;
  background-image: url("/assets/images/ui/text-bg-2.png");
  transform-origin: top left;
  transform: scaleX(1.15) rotate(2deg);
}

.intro-text.intro-text--5-0::before {
  top: 0px;
  left: -10px;
  background-image: url("/assets/images/ui/text-bg-1.png");
  transform-origin: top left;
  transform: scaleX(1.8) rotate(-3deg);
}

.intro-text.intro-text--5-1::before {
  background-image: url("/assets/images/ui/text-bg-2.png");
  transform-origin: top left;
  transform: scaleX(1.2);
}

.intro-text.intro-text--6-0::before {
  top: -10px;
  bottom: -10px;
  left: -10px;
  right: 10px;
  background-image: url("/assets/images/ui/text-bg-1.png");
  transform-origin: top left;
  transform: scaleY(1.2) rotate(-2deg);
}

.intro-text.intro-text--6-1::before {
  background-image: url("/assets/images/ui/text-bg-2.png");
  transform-origin: top left;
  transform: scaleX(1.2);
}

.intro-text.intro-text--7-0::before {
  background-image: url("/assets/images/ui/text-bg-1.png");
  transform-origin: top left;
  transform: scaleX(1.15) scaleY(1.05) rotate(-2deg);
}

.intro-text.intro-text--8-0::before {
  top: -5px;
  left: -10px;
  background-image: url("/assets/images/ui/text-bg-2.png");
  transform-origin: top left;
  transform: scaleX(1) scaleY(1.02) rotate(1deg);
}

.intro-text.intro-text--8-1::before {
  top: 10px;
  background-image: url("/assets/images/ui/text-bg-1.png");
  transform-origin: top left;
  transform: scaleX(1.35) scaleY(1.05) rotate(-2deg);
}

.intro-text--3-0 {
  max-width: 660px;
}

.intro-text--5-0 {
  max-width: 860px;
}
</style>
