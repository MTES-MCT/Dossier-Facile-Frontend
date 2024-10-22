<template>
  <span>
    <i v-if="status === 'TO_PROCESS'" class="text-warning ri-time-line" style="font-size: 18px"></i>
    <i
      v-if="status === 'DECLINED' || status === 'INCOMPLETE'"
      class="ri-close-circle-fill text-danger"
      style="font-size: 18px"
    ></i>
    <i
      v-if="status === 'VALIDATED'"
      class="text-success ri-checkbox-circle-line"
      style="font-size: 18px"
    ></i>
  </span>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    status?: string
  }>(),
  {
    status: 'INCOMPLETE'
  }
)
</script>
