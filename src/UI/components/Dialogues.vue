<script setup>
import { EVENTS } from "@/utils/constants/events";
import { state } from "@/utils/State";
import { ref } from "vue";

const hasDialogue = ref(false)
const person = ref('')
const text = ref('')

state.on(EVENTS.UPDATE_DIALOGUE, (e) => {
  if(e){
    person.value = e.person
    text.value = e.text
    hasDialogue.value = true
  } else {
    hasDialogue.value = false
  }
})

</script>

<template>
  <div class="wrapper" v-if="hasDialogue">
    <div class="person">
      {{ person }} :
    </div>
    <div class="text">
      {{ text }}
    </div>
  </div>
</template>

<style scoped lang="scss">
.wrapper {
  background-color: white;
  padding: 7px 15px;
  border-radius: 4px;
  color: black;
  width: fit-content;
  max-width: 30%;
  position: absolute;
  left: 5px;
  bottom: 5px;
  opacity: 1;
  transition: 0.5s;
}

.person {
  font-size: 120%;
  margin-bottom: 3px;
}

.text {
  transition: 1s;
}

[aria-hidden="true"] {
  opacity: 0;
}
</style>
