<script setup>
import { ref } from 'vue'

let count = ref(0)
</script>

<template>
  <p>Current component: A</p>
  <span style="margin-right: 20px">count: {{ count }}</span>
  <button @click="count++">+</button>
</template>
