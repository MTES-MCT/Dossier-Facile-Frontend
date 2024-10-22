<template>
  <div>
    <div class="fr-ml-2w consumption-container">
      <span class="arrow-left"></span>
      <span class="consumption">{{ $props.consumption }}</span>
    </div>
    <div class="lbl">{{ label }}</div>
  </div>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    label?: string
    consumption?: number
  }>(),
  {
    label: 'A',
    consumption: 0
  }
)
</script>

<style scoped lang="scss">
.arrow-left {
  width: 0;
  height: 0;
  border-top: 12px solid transparent;
  border-bottom: 13px solid transparent;
  border-right: 10px solid #0063cb;
}

.consumption {
  background-color: #0063cb;
  padding: 1px 10px;
}

.consumption-container {
  display: flex;
}

.lbl {
  color: #929292;
  font-size: 0.8rem;
  margin-left: 35px;
  overflow: visible;
  position: absolute;
}
</style>
