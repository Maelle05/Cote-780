<script setup>
import { EVENTS } from "../../utils/constants/events";
import { state } from "../../utils/State";

function next() {
  state.emit(EVENTS.GO_NEXT);
}

function previous() {
  state.emit(EVENTS.GO_PREV);
}

</script>

<template>
  <div class="wrapper">
    <button @click="previous"> Prev </button>
    <button @click="next"> Next </button>
  </div>
</template>

<style scoped lang="scss">
.wrapper {
  position: absolute;
  bottom: 10px;
  right: 10px;
  cursor: pointer;
  pointer-events: all;
  display: flex;
  gap: 5px;

  &__top {
    position: absolute;
    bottom: 24px;
    right: 0;
  }
}
</style>
