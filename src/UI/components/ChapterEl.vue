<script setup>
import { TITLES_SCENE } from '../../utils/constants/config';

const props = defineProps({
  id: Number,
  active: Boolean
});
</script>

<template>
  <div class="chapter-element" :class="{ active: props.active }">
    <img :src="'/assets/images/chapter-icons/' + props.id  + '.png'" />
    <h4 class="chapter-element__title">{{ TITLES_SCENE[props.id] }}</h4>
  </div>
</template>

<style lang="scss" scoped>
.chapter-element{
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 20px;
  opacity: 0.4;


  &.active {
    opacity: 1;

    img{
      border: solid 2px black;
      border-radius: 100%;
    }
  }

  img {
    width: 100px;
  }

  &__title{
    margin: 10px 0 0 0;
  }
}
</style>