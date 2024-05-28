<script setup>
const props = defineProps({
  sceneIndex: Number,
});
</script>

<template lang="">
  <div class="icon"><img :src="'/assets/images/icons/' + props.sceneIndex  + '.png'" /></div>
</template>

<style scoped lang="scss">
img {
  width: 160px;
}
</style>
