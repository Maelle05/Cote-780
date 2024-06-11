<script setup>
const props = defineProps({
  sceneIndex: Number,
  isVisible: Boolean,
})
</script>

<template lang="">
  <div ref='container' :class="`collection-cairns__container collection-cairns__container--${isVisible ? 'visible' : 'hidden'}`">
    <div class="collection-cairns">
      <p>COLLECTION CAIRNS</p>
    </div>
  </div>
</template>

<style scoped lang="scss">
.collection-cairns__container {
  left: 0;
  top: 0;
  width: 100%;
  height: 100vh;
  color: #fff;
  font-family: var(--ff-rubik);
  display: grid;
  align-items: center;
  justify-content: center;

  &.collection-cairns__container--hidden {
    opacity: 0;
    pointer-events: none;
  }
}
</style>