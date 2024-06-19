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
const hasLearnMorePanelBeenOpen = ref(false);

const isSoundOn = ref(true);

const onClickMap = () => {
  state.emit(EVENTS.ASK_TRANSITION, 1);
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
  app.audio.ui.play("magic_action_2");
};

const onClickLearnMore = () => {
  if (hasLearnMorePanelBeenOpen.value === false) {
    hasLearnMorePanelBeenOpen.value = true;
  }

  if (isLearnMorePanelOpen.value === false) {
    isLearnMorePanelOpen.value = true;
    app.audio.ui.play("magic_action_2");
    app.audio.ui.play("texture_opening");
  } else {
    isLearnMorePanelOpen.value = false;
    app.audio.ui.play("back", 0.3);
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

const onHover = () => {
  if (!app.audio) return;

  app.audio.ui.play("click");
};
</script>

<template lang="">
  <div class="navigation__container">
    <div class="navigation">
      <NavigationElement
        @click="onClickLearnMore"
        @mouseenter="onHover"
        :icon="isLearnMorePanelOpen ? 'close' : 'learn-more'"
        :isVisible="isLearnMoreBtnVisible()"
        :isAnimated="hasLearnMorePanelBeenOpen ? false : true"
      ></NavigationElement>
      <!-- <NavigationElement
        @click="onClickMap"
        icon="map"
        :isVisible="isMapBtnVisible()"
      ></NavigationElement> -->
      <NavigationElement
        @click="onClickSound"
        @mouseenter="onHover"
        :icon="isSoundOn ? 'sound-on' : 'sound-off'"
        :isVisible="isSoundBtnVisible()"
        :isAnimated="false"
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
  pointer-events: none;
}

.navigation {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 16px;
  pointer-events: all;
}

.navigation__learn-more {
  transition: opacity 400ms ease-in-out, transform 400ms ease-in-out;
  pointer-events: all;
}
.navigation__learn-more.navigation__learn-more--hidden {
  transform: translateY(40px);
  opacity: 0;
  pointer-events: none;
}
</style>
