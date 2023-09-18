<template>
  <div>
    <p v-html="$t('coupleinformationhelp.paragraph1')"></p>
    <p v-html="$t('coupleinformationhelp.paragraph2')"></p>
    <p v-html="$t('coupleinformationhelp.paragraph3')"></p>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component
export default class CoupleInformationHelp extends Vue {}
</script>

<style scoped lang="scss">
p {
  overflow-wrap: break-word;
  word-wrap: break-word;
}
</style>
