<template>
  <RiTimeLine v-if="status === 'TO_PROCESS'" size="18px" class="text-warning" aria-hidden="true" />
  <RiCloseCircleFill
    v-if="status === 'DECLINED' || status === 'INCOMPLETE'"
    size="18px"
    class="text-danger"
    aria-hidden="true"
  />
  <RiCheckboxCircleLine
    v-if="status === 'VALIDATED'"
    size="18px"
    class="text-success"
    aria-hidden="true"
  />
</template>

<script setup lang="ts">
import { RiCheckboxCircleLine, RiCloseCircleFill, RiTimeLine } from '@remixicon/vue'

withDefaults(defineProps<{ status?: string }>(), { status: 'INCOMPLETE' })
</script>
