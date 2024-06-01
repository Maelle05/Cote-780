<script setup>
import { EVENTS } from "../../utils/constants/events";
import { INIT_SCENE } from "../../utils/constants/config";
import { state } from "../../utils/State";
import { ref } from "vue";
import { DialoguesManager } from "@/utils/core/DialoguesManager";

let currentScene = ref(INIT_SCENE);

const dialogueManager = new DialoguesManager();

// functions that mutate state and trigger updates
function next() {
  currentScene.value = (currentScene.value + 1) % 8;
  state.emit(EVENTS.CHANGE_SCENE, currentScene.value);
}

function previous() {
  currentScene.value = (currentScene.value - 1) % 8;
  state.emit(EVENTS.CHANGE_SCENE, currentScene.value);
}

function changeStepAnim() {
  state.emit(EVENTS.CHANGE_SCENE_STEP);
}

function nextDialogue() {
  dialogueManager.nextText();
}

state.on(EVENTS.CHANGE_SCENE, (e) => {
  currentScene.value = e;
});
</script>

<template>
  <div class="wrapper">
    <button @click="previous">Go previous scene</button>
    <button @click="next">Go next scene</button>
    <button @click="nextDialogue">Go next Dialogue</button>
    <button
      class="wrapper__top"
      @click="changeStepAnim"
      v-if="
        currentScene == 2 ||
        currentScene == 4 ||
        currentScene == 3 ||
        currentScene == 5
      "
    >
      Change step scene
    </button>
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
