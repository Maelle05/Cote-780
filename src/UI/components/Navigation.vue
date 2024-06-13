<script setup>
import NavigationElement from "./NavigationElement.vue";
import LearnMorePanel from "./LearnMorePanel.vue";

import { app } from "@/App";
import { state } from "../../utils/State";
import { EVENTS } from "../../utils/constants/events";

import { useI18n } from "vue-i18n";
import { ref } from "vue";

const { t } = useI18n();

const props = defineProps({
  sceneIndex: Number,
});

const isLearnMorePanelOpen = ref(false);

const isSoundOn = ref(true);

const onClickMap = () => {
  state.emit(EVENTS.ASK_CHANGE_SCENE, 1);
};

const onClickSound = () => {
  if (app.audio === undefined) return;

  if (app.audio.isPlaying()) {
    app.audio.setMute(true);
    isSoundOn.value = false;
  } else {
    app.audio.setMute(false);
    isSoundOn.value = true;
  }
};

const onClickLearnMore = () => {
  if (isLearnMorePanelOpen.value === false) {
    isLearnMorePanelOpen.value = true;
  } else {
    isLearnMorePanelOpen.value = false;
  }
};

const isMapBtnVisible = () => {
  if (props.sceneIndex === 0 || props.sceneIndex === 1) {
    return false;
  }

  return true;
};

const isSoundBtnVisible = () => {
  if (props.sceneIndex === 1) {
    return false;
  }

  return true;
};

const isLearnMoreBtnVisible = () => {
  if (
    t(`scene_${props.sceneIndex}.infos`) === `scene_${props.sceneIndex}.infos`
  ) {
    return false;
  }

  return true;
};
</script>

<template lang="">
  <div class="navigation__container">
    <div class="navigation">
      <NavigationElement
        @click="onClickLearnMore"
        :icon="isLearnMorePanelOpen ? 'close' : 'learn-more'"
        :isVisible="isLearnMoreBtnVisible()"
      ></NavigationElement>
      <NavigationElement
        @click="onClickMap"
        icon="map"
        :isVisible="isMapBtnVisible()"
      ></NavigationElement>
      <NavigationElement
        @click="onClickSound"
        :icon="isSoundOn ? 'sound-on' : 'sound-off'"
        :isVisible="isSoundBtnVisible()"
      ></NavigationElement>
    </div>
    <LearnMorePanel
      :sceneIndex="props.sceneIndex"
      :class="`navigation__learn-more navigation__learn-more--${
        isLearnMorePanelOpen && !isOnMap ? 'visible' : 'hidden'
      }`"
    >
    </LearnMorePanel>
  </div>
</template>

<style scoped lang="scss">
.navigation__container {
  position: fixed;
  right: 48px;
  top: 24px;
  display: flex;
  flex-direction: column;
  gap: 24px;
  z-index: 100;
  pointer-events: all;
  font-family: var(--ff-rubik);
}

.navigation {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 16px;
}

.navigation__learn-more {
  transition: opacity 400ms ease-in-out, transform 400ms ease-in-out;
}
.navigation__learn-more.navigation__learn-more--hidden {
  transform: translateY(40px);
  opacity: 0;
  pointer-events: none;
}
</style>
