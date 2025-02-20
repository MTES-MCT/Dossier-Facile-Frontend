<template>
  <SkipLinks :links="mySkipLinks"></SkipLinks>
</template>

<script setup lang="ts">
import SkipLinks from 'df-shared-next/src/components/SkipLinks.vue'
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const mySkipLinks = computed(() => route.meta.skipLinks)
</script>
