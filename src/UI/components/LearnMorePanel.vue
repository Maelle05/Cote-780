<script setup>
import { useI18n } from "vue-i18n"
import { computed } from "vue"

const { t } = useI18n()

const props = defineProps({
  sceneIndex: Number,
})
</script>

<template lang="">
  <div class="learn-more-panel">
    <div class="learn-more-panel__text">
      <p>
        {{ t(`scene_${props.sceneIndex}.infos`) }}
      </p>
    </div>
    <div class="learn-more-panel__image">
      <img
        :src="`/assets/images/learn-more/${props.sceneIndex}.jpg`"
        :alt="t(`scene_${props.sceneIndex}.alt`)"
      />
    </div>
    <div class="learn-more-panel__url">
      <a :href="t(`scene_${props.sceneIndex}.url`)">{{ t(`global.more`) }}</a>
    </div>
  </div>
</template>

<style scoped lang="scss">
.learn-more-panel {
  background-color: var(--c-background-beige-light);
  border: 1px solid var(--c-stroke-beige-light);
  padding: 24px 32px 32px 32px;
  border-radius: 16px;
  color: var(--c-text-dark);
  max-width: 320px;
  display: flex;
  flex-direction: column;
  gap: 24px;
  font-size: 16px;
  box-shadow: 0 0 40px #FFFBF280, 0 0 4px #FFFBF280;
}

.learn-more-panel__text {
  line-height: 150%;
}

.learn-more-panel__image {
  text-align: center;

  img {
    max-width: 95%;
    border: 4px solid #fff;
    transform: rotate(-3deg);
    box-shadow: 0 0 4px rgba(0, 0, 0, 0.25);
  }
}

.learn-more-panel__url {
  align-self: flex-end;
  position: relative;

  a {
    color: inherit;
    text-decoration: underline;
    text-decoration-thickness: 0.08em;
    text-underline-offset: 0.3em;
    display: flex;
    gap: 0.3em;
    z-index: 1;
    position: relative;
  }

  a::before {
    content: url("/assets/images/icons/loupe.svg");
  }

  &::before {
    z-index: 0;
    height: 200%;
    width: 100%;
    top: -40%;
    background-color: #F7F8F2;
    border-radius: 100%;
    filter: blur(10px);
    display: block;
    content: '';
    position: absolute;
  }
}
</style>
