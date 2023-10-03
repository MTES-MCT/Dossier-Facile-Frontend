<script setup lang="ts">
import Header from "./components/Header.vue";
import Footer from "./components/Footer.vue";
</script>

<template>
  <Header />
  <main class="fr-container fr-mt-3w fr-mb-3w" role="main">
    <router-view />
  </main>
  <Footer />
</template>

<style lang="scss">
@import "../../node_modules/@gouvfr/dsfr/dist/dsfr/dsfr.min.css";
@import "../../node_modules/@gouvfr/dsfr/dist/utility/icons/icons-system/icons-system.min.css";
@import "df-shared-next/src/scss/_main.scss";
</style>