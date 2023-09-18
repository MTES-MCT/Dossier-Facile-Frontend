<template>
  <div class="fr-alert fr-alert--info">
    <div v-html="$t('tax-page.warning-no-accepted-doc')"></div>
    <img src="../../../assets/images/tax-help.png" />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component
export default class WarningTaxDeclaration extends Vue {}
</script>

<style scoped lang="scss"></style>
