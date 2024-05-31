<script setup>
import { ref } from "vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

const props = defineProps({
  sceneIndex: Number,
});

const textIndex = ref(1);
const personIndex = ref(1);
</script>

<template lang="">
  <div class="wrapper">
    <div class="person">
      {{ t("scene_" + (sceneIndex - 1) + ".person_" + personIndex) }} :
    </div>
    <div class="text">
      {{ t("scene_" + (sceneIndex - 1) + ".text_" + textIndex) }}
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
}

.person {
  font-size: 120%;
  margin-bottom: 3px;
}
</style>
