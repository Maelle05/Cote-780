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
    <div class="credits__cta">
      <span>
        <a target="_blank" :href="t('credits.url')">{{ t("credits.cta") }}</a>
      </span>
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
  font-size: 18px;
  transform: translateY(100vh);
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

.credits__cta {
  cursor: pointer;
  font-family: var(--ff-rubik);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-weight: 400;
  color: #fff;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translateX(-50%);
  display: grid;
  align-items: center;
  justify-content: center;
  text-shadow: 0 0 0 #ffffff7e;
  transition: letter-spacing 600ms, opacity 600ms, text-shadow 600ms;
  opacity: 0;
  pointer-events: none;

  &.credits__cta--hidden {
    opacity: 0;
    pointer-events: none;
  }

  span {
    grid-area: 1 / -1;
    position: relative;
    z-index: 1;
    text-align: center;
    font-size: 18px;
    font-weight: 400;
    text-decoration: underline;
    text-decoration-thickness: 0.07em;
    text-underline-offset: 0.4em;
  }

  a {
    color: #fff;
  }

  &::before,
  &::after {
    opacity: 0.2;
    position: absolute;
    width: 140%;
    left: -20%;
    height: 90px;
    display: block;
    content: "";
    background-size: contain;
    background-repeat: no-repeat;
    transition: opacity 600ms;
  }

  &::before {
    background-image: url("/assets/images/ui/ornaments-1.svg");
    background-position: left;
  }

  &::after {
    background-image: url("/assets/images/ui/ornaments-2.svg");
    background-position: right;
  }

  &:hover {
    text-shadow: 0 0 14px #ffffff96;
    letter-spacing: 0.16em;

    &::before,
    &::after {
      opacity: 0.5;
    }
  }
}

.credits__container.credits__container--visible {
  .credits {
    animation: animCredits 15s linear forwards;
  }

  .credits__cta {
    animation: fadeIn 800ms 14s linear forwards;
  }
}

@keyframes animCredits {
  100% {
    transform: translateY(-105vh);
  }
}

@keyframes fadeIn {
  100% {
    pointer-events: all;
    opacity: 1;
  }
}
</style>
