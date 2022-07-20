<script setup lang="ts">
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://vuejs.org/api/sfc-script-setup.html#script-setup
import HelloWorld from './components/HelloWorld.vue'
import { useI18n } from "vue-i18n";

const { t } = useI18n();
</script>

<template>
  <div>
    {{ t('hello')}} {{ t('x') }}
  </div>
  <HelloWorld msg="Vite + Vue" />
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>

<i18n>
{
  "en": {
    "x": "x"
  },
  "fr": {
    "x": "Y"
  }
}
</i18n>
