<template>
<div>
      <p v-html="$t('nameinformationhelp.paragraph1')"></p>
      <p v-html="$t('nameinformationhelp.paragraph2')"></p>
      <p v-html="$t('nameinformationhelp.paragraph3')"></p>
</div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component
export default class NameInformationHelp extends Vue {
  expanded = false;
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.hidden {
  display: none;
}
</style>

