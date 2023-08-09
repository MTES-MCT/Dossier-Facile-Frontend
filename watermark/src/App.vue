<script setup lang="ts">
import Header from "./components/Header.vue";
import Footer from "./components/Footer.vue";
import WatermarkingPage from "./components/WatermarkingPage.vue";
</script>

<template>
  <Header />
  <main class="fr-container" role="main">
    <WatermarkingPage />
  </main>
  <Footer />
</template>

<style lang="scss">
@import "../../node_modules/@gouvfr/dsfr/dist/dsfr/dsfr.min.css";
@import "df-shared-next/src/scss/_main.scss";
</style>