<template>
  <div class="announcement fr-pt-2w fr-pb-2w" v-if="isVisible()">
    <div class="fr-container">
      {{ MESSAGE }}
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";

@Component
export default class Announcement extends Vue {
  MESSAGE = `${process.env.VUE_APP_ANNOUNCEMENT_MESSAGE}`;

  isVisible() {
    return this.MESSAGE.trim().length > 0;
  }
}
</script>

<style scoped lang="scss">
.announcement {
  background-color: #45a07a;
  color: #fff;
}
</style>
