<script setup lang="ts">
import { RiBuilding4Line, RiCommunityFill, RiHome4Fill } from '@remixicon/vue'

defineProps<{
  type: string
}>()
</script>

<template>
  <div class="blue-text inline-block fr-m-1w">
    <RiHome4Fill v-if="type === 'HOUSE'" size="36px" />
    <RiBuilding4Line v-else-if="type === 'APARTMENT'" size="36px" />
    <RiCommunityFill v-else size="36px" />
  </div>
</template>
