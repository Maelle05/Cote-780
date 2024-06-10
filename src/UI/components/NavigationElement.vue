<script setup>
const props = defineProps({
  icon: String,
  isVisible: Boolean
})
</script>

<template lang="">
  <div :class="`navigation-element navigation-element--${isVisible ? 'visible' : 'hidden'}`">
    <img :src="`/assets/images/icons/${icon}.png`" alt="">
  </div>
</template>

<style scoped lang="scss">
  .navigation-element {
    cursor: pointer;
    border-radius: 100%;
    background-color: rgba(255, 255, 255, 0.4);
    height: 36px;
    width: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    transition: opacity 800ms;
  }

  .navigation-element--hidden {
    opacity: 0;
    pointer-events: none;
  }
</style> 
