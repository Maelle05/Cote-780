<script setup>
import { useI18n } from "vue-i18n"

const { t } = useI18n()
</script>

<template>
  <div class="mobile-disclaimer">
    <div class="mobile-disclaimer__image">
      <img src="/assets/images/milo-dance.gif" alt="">
    </div>
    <div class="mobile-disclaimer__text">
      <p v-html="t('global.mobile')"></p>
    </div>
  </div>
</template>

<style scoped lang="scss">
.mobile-disclaimer {
  height: 100vh;
  width: 100%;
  position: absolute;
  top: 0;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 24px;
  font-family: monospace;
  color: var(--c-text-dark);
  font-weight: 500;
  text-align: center;
  box-sizing: border-box;
  font-size: 14px;
  line-height: 150%;

  > * {
    padding: 24px;
  }

  img {
    width: 100%;
    max-width: 300px;
    border-radius: 16px;
  }
}
</style>
