<template>
  <div class="announcement fr-pt-2w fr-pb-2w">
    <div class="fr-container">
      <slot></slot>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";

@Component
export default class Announcement extends Vue {}
</script>

<style scoped lang="scss">
.announcement {
  background-color: #45a07a;
  color: #fff;
}
</style>
