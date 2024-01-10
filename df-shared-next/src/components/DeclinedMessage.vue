<template>
  <div class="declined">
    <span class="fr-icon-message-2-fill fr-mr-1v" aria-hidden="true"></span>
    <span v-html="message"></span>
  </div>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{ message?: string }>(), {
  message: "",
});
</script>

<style scoped lang="scss">
@import "@gouvfr/dsfr/dist/utility/icons/icons-communication/icons-communication.css";

.declined {
  padding: 1rem 1rem 0.75rem;
  border-radius: 0.25rem;
  background-color: #fce5e7;
  color: #525252;
  line-height: 2;
}
</style>
