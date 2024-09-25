<template>
  <p v-html="t('documenthelp.paragraph1')"></p>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
</script>

<style scoped lang="scss">
.hidden {
  display: none;
}
</style>
