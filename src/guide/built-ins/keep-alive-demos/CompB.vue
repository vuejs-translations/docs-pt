<script setup>
import { ref } from 'vue'

let msg = ref('')
</script>

<template>
  <p>Current component: B</p>
  <span style="margin-right: 20px">Message is: {{ msg }}</span>
  <input v-model="msg">
</template>
