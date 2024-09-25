<template>
  <div>
    <p v-html="t('guarantorchoicehelp.paragraph1')"></p>
    <p v-html="t('guarantorchoicehelp.paragraph2')"></p>
    <p v-html="t('guarantorchoicehelp.paragraph3')"></p>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.hidden {
  display: none;
}

p {
  overflow-wrap: break-word;
  word-wrap: break-word;
}
</style>
