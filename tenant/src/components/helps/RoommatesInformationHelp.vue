<template>
  <div>
    <p v-html="$t('roommatesinformationhelp.paragraph1')"></p>
    <p v-html="$t('roommatesinformationhelp.paragraph2')"></p>
    <p v-html="$t('roommatesinformationhelp.paragraph3')"></p>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component
export default class RoommatesInformationHelp extends Vue {}
</script>

<style scoped lang="scss">
p {
  overflow-wrap: break-word;
  word-wrap: break-word;
}
</style>
