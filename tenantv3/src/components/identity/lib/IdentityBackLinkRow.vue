<template>
  <BackLinkRow :to="parentRoute" :is-button="false" :label="label" />
</template>

<script setup lang="ts">
import { useParentRoute } from '../../common/lib/useParentRoute'
import BackLinkRow from '@/components/common/BackLinkRow.vue'

defineProps<{ label: string }>()

const parentRoute = useParentRoute()
</script>
