<template>
  <div class="left-edit-menu">
    <ul>
      <li class="active">1 - je renseigne mes informations</li>
      <li :class="step > 0 ? 'active' : ''">2 - je joins mes documents</li>
      <li :class="step > 1 ? 'active' : ''">3 - je renseigne mon garant</li>
    </ul>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class LeftEditMenu extends Vue {
  @Prop({ default: 0 }) private step?: number;
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
@import "df-shared/src/scss/_variables.scss";

.left-edit-menu {
  background-color: $brick;
}

.active {
  color: $primary;
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
