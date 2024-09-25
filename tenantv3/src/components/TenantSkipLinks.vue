<template>
  <SkipLinks :links="mySkipLinks"></SkipLinks>
</template>

<script setup lang="ts">
import SkipLinks from 'df-shared-next/src/components/SkipLinks.vue'
import useTenantStore from '../stores/tenant-store'
import { computed } from 'vue'

const store = useTenantStore()
const mySkipLinks = computed(() => store.skipLinks)
</script>

<style scoped lang="scss"></style>
