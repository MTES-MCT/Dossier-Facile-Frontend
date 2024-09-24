<template>
  <div class="fr-alert fr-alert--info">
    <div v-html="t('tax-page.warning-no-accepted-doc')"></div>
    <img alt="Entête Impôt sur les revenus" src="../../../assets/images/tax-help.png" />
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>

<style scoped lang="scss"></style>
