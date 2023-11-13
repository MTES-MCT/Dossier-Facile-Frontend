<template>
  <div class="declined" v-html="'🤖 ' + message"></div>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{ message?: string }>(), {
  message: "",
});
</script>

<style scoped lang="scss">
.declined {
  padding: 1rem 1rem 0.75rem;
  border-radius: 0.25rem;
  background-color: #fce5e7;
  color: #525252;
  line-height: 2;
}
</style>
