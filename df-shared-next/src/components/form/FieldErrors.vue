<template>
  <ul :id role="list">
    <li v-for="error of errors" :key="error" class="fr-error-text">
      <slot>{{ error }}</slot>
    </li>
  </ul>
</template>

<script setup lang="ts">
defineProps<{
  errors: string[]
  id: string
}>()
</script>
