<script setup>
import { useI18n } from "vue-i18n"

const { t } = useI18n()

const props = defineProps({
  isVisible: Boolean,
})
</script>

<template lang="">
  <div
    :class="`credits__container credits__container--${
      isVisible ? 'visible' : 'hidden'
    }`"
  >
    <div class="credits">
      <div class="credits__element">
        <p v-html="t('credits.line_1')"></p>
      </div>
      <div
        class="credits__element credits__element--flex"
        v-for="index in [1, 2, 3, 4]"
      >
        <p v-html="t(`credits.role_${index}`)" class="credits__role"></p>
        <p class="credits__names">
          <span
            v-html="name"
            v-for="name in t(`credits.name_${index}`).split(',')"
          >
          </span>
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.credits__container {
  position: absolute;
  height: 100vh;
  width: 70%;
  right: 0;
  top: 0;
  color: #fff;
  font-family: var(--ff-rubik);
  pointer-events: none;
  user-select: none;
  transition: opacity 1200ms;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
  overflow: hidden;

  &.credits__container--hidden {
    opacity: 0;
  }
}

.credits {
  max-width: 450px;
  display: flex;
  flex-direction: column;
  gap: 32px;
  line-height: 150%;
  font-size: 12px;
  transform: translateY(100vh);
}

.credits__container.credits__container--visible {
  .credits {
    animation: animCredits 15s linear forwards;
  }
}

@keyframes animCredits {
  100% {
    transform: translateY(0vh);
  }
}

.credits__element {
  text-align: center;
}

.credits__role {
  margin-bottom: 8px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-weight: 200;
}

.credits__names {
  display: flex;
  flex-direction: column;
}
</style>
