<template>
  <div class="icons" v-if="getStatus()">
    <i :class="getStatus()" aria-hidden="true"></i>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class StatusIcon extends Vue {
  @Prop() status!: string;

  getStatus() {
    switch (this.status) {
      case "EMPTY":
        return "ri-arrow-right-line";
      case "FILLED":
        return "ri-attachment-line";
      case "TO_PROCESS":
        return "ri-time-line";
      case "VALIDATED":
        return "ri-verified-badge-line";
      case "DECLINED":
        return "ri-close-circle-fill";
      case "NAME":
        return "ri-pass-valid-line";
      case "ALONE":
        return "ri-user-line";
      case "COUPLE":
        return "ri-group-line";
      case "GROUP":
        return "ri-team-line";
    }
    return undefined;
  }
}
</script>

<style scoped lang="scss">
.icons {
  margin-right: 0.5rem;
}
.icons > span {
  font-size: 16px;
}
</style>
