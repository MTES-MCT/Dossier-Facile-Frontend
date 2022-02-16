<script setup lang="ts">
import { useStore } from "vuex";
import { computed } from "vue";
import { useI18n } from 'vue-i18n'

const { t } = useI18n();

defineProps<{}>();

const store = useStore();

const count = computed(() => store.getters.count);

function increaseCount() {
  store.commit("increment");
}
</script>

<template>

  <p>
    Recommendeauied IDE setup: {{ t("helloi")}} {{ t("message" )}}
    <a href="https://code.visualstudio.com/" target="_blank">VSCode</a>
    +
    <a href="https://github.com/johnsoncodehk/volar" target="_blank">Volar</a>
  </p>

  <p>See <code>README.md</code> for more information.</p>

  <p>
    <a href="https://vitejs.dev/guide/features.html" target="_blank">
      Vite Docs
    </a>
    |
    <a href="https://v3.vuejs.org/" target="_blank">Vue 3 Docs</a>
  </p>

  <button type="button" @click="increaseCount">count is: {{ count }}</button>
  <p>
    Edit
    <code>components/HelloWorld.vue</code> to test hot module replacement.
  </p>
</template>

<style scoped>
a {
  color: #42b983;
}

label {
  margin: 0 0.5em;
  font-weight: bold;
}

code {
  background-color: #eee;
  padding: 2px 4px;
  border-radius: 4px;
  color: #304455;
}
</style>

<i18n>
{
  "en": {
    "helloi": "narusite"
  },
  "fr": {
    "helloi": "narusitxarnusix "
  }
}
</i18n>