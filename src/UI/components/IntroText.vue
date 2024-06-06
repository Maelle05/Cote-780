<script setup>
import { defineProps } from 'vue'

const props = defineProps({
  text: String
})
</script>

<template>
  <p>
    {{ props.text }}
  </p>
</template>

<style scoped>
</style>