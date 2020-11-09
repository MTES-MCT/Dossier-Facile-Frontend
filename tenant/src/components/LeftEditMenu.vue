<template>
  <div class="left-edit-menu">
    <ul>
      <li>1 - je renseigne mes informations</li>
      <li>2 - je joins mes documents</li>
      <li>3 - je renseigne mon garant</li>
    </ul>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component
export default class LeftEditMenu extends Vue {}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
@import "../node_modules/df-shared/src/scss/_variables.scss";

.left-edit-menu {
  background-color: $brick;
}
</style>

<i18n>
{
"en": {
},
"fr": {
}
}
</i18n>
