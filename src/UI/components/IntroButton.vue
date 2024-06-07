<template>
  <p class="intro-button" @click="$emit('click')">
    <slot></slot>
  </p>
</template>

<style>
.intro-button {
    cursor: pointer;
    font-family: var(--ff-rubik);
    text-transform: uppercase;
    color: var(--c-text-turquoise);
    font-weight: 500;
    letter-spacing: 0.12em;
}
</style>