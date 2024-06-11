<script setup>
const props = defineProps({
  sceneIndex: Number,
})

const fallbackImage = "/assets/images/frise/frise_0.png"

function handleError(event) {
  event.target.src = fallbackImage
}
</script>

<template>
  <div class="chapter-frise">
    <img
      :src="`/assets/images/frise/frise_${sceneIndex - 2}.png`"
      @error="handleError"
    />
    <img
      :src="`/assets/images/frise/frise_${sceneIndex - 1}.png`"
      @error="handleError"
    />
  </div>
</template>

<style scoped lang="scss">
.chapter-frise {
  width: 100%;
  position: absolute;
  bottom: 0;
  display: grid;

  img {
    grid-area: 1 / -1;
    width: 100%;
  }

  img:nth-child(2) {
    animation: fadeIn 1200ms;
  }
}

@keyframes fadeIn {
  0% {
    opacity: 0;
  }
  20% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
</style>
