<script setup lang="ts">
import HeaderComponent from './components/HeaderComponent.vue'
import FooterComponent from './components/FooterComponent.vue'
</script>

<template>
  <HeaderComponent />
  <main class="fr-container fr-mt-3w fr-mb-3w" role="main">
    <router-view />
  </main>
  <FooterComponent />
</template>

<style lang="scss">
@import '@gouvfr/dsfr/dist/dsfr/dsfr.min.css';
@import 'df-shared-next/src/scss/_main.scss';
</style>
