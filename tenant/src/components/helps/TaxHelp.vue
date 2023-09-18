<template>
  <div>
    <p v-html="$t('taxhelp.paragraph1')"></p>
    <p v-html="$t('taxhelp.paragraph2')"></p>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component
export default class TaxHelp extends Vue {
  expanded = false;
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.hidden {
  display: none;
}
</style>
