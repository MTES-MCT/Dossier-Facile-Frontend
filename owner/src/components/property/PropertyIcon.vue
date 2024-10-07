<script setup lang="ts">
defineProps<{
  type: string
}>()
</script>

<template>
  <div class="blue-text inline-block fr-m-1w">
    <i v-if="type === 'HOUSE'" class="fs-36 ri-home-4-fill"></i>
    <i v-else-if="type === 'APARTMENT'" class="fs-36 ri-building-4-line"></i>
    <i v-else class="fs-36 ri-community-fill"></i>
  </div>
</template>
