<script setup>
import { DialoguesManager } from "@/utils/core/DialoguesManager";
import { watch } from "vue";
import { ref, reactive, watchEffect } from "vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

const props = defineProps({
  sceneIndex: Number,
});

const dialogues = new DialoguesManager();
dialogues.toggle();
</script>

<template>
  <div class="wrapper" :aria-hidden="dialogues.hidden.value">
    <div class="person">
      {{
        t(
          "scene_" + (sceneIndex - 1) + ".person_" + dialogues.personIndex.value
        )
      }}
      :
    </div>
    <div class="text">
      {{
        t("scene_" + (sceneIndex - 1) + ".text_" + dialogues.textIndex.value)
      }}
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
