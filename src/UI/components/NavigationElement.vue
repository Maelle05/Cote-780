<script setup>
import { app } from "@/App";

const props = defineProps({
  icon: String,
  isVisible: Boolean
})

const handleMouseEnter = () => {
  if (app.audio === undefined) return;

  // [WIP][son] add UI sound here
}

const handleClick = () => {
  if (app.audio === undefined) return;

  // [WIP][son] add UI sound here
}
</script>

<template lang="">
  <div 
    @click="handleClick" 
    @mouseenter="handleMouseEnter" 
    :class="`navigation-element navigation-element--${isVisible ? 'visible' : 'hidden'}`">
    <img :src="`/assets/images/icons/${icon}.svg`" alt="">
  </div>
</template>

<style scoped lang="scss">
  .navigation-element {
    cursor: pointer;
    border-radius: 100%;
    background-color: var(--c-turquoise-dark);
    height: 42px;
    width: 42px;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    transition: opacity 800ms;
    box-shadow: 0 0 0 #ffffff8a;
    border: 1px solid transparent;
    transition: opacity 1000ms, background-color 600ms, border 600ms, box-shadow 600ms;

    img {
      height: 26px;
      width: 26px;
    }

    &:hover {
      border: 1px solid #fff;
      background-color: var(--c-turquoise-medium);
      box-shadow: 0 0 12px #ffffff42;
    }
  }

  .navigation-element--hidden {
    opacity: 0;
    pointer-events: none;
  }
</style> 
