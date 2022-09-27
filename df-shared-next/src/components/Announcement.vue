<script setup lang="ts">
const MESSAGE = `${import.meta.env.VITE_ANNOUNCEMENT_MESSAGE}`;

function isVisible() {
  return MESSAGE.trim().length > 0;
}
</script>

<template>
  <div class="announcement fr-pt-2w fr-pb-2w" v-if="isVisible()">
    <div class="fr-container">
      {{ MESSAGE }}
    </div>
  </div>
</template>

<style scoped lang="scss">
.announcement {
  background-color: #45a07a;
  color: #fff;
}
</style>
