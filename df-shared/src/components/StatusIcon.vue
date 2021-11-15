<template>
  <div class="icons" v-if="getStatus()">
    <span class="material-icons-outlined">{{ getStatus() }}</span>
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
        return "arrow_forward";
      case "PENDING":
        return "attachment";
      case "TO_PROCESS":
        return "schedule";
      case "VALIDATED":
        return "verified";
      case "DECLINED":
        return "report_gmailerrorred";
    }
    return undefined;
  }
}
</script>

<style scoped lang="scss">
.icons {
  padding-top: 4px;
  line-height: 16px;
  margin-right: 0.5rem;
}
.icons > span {
  font-size: 16px;
}
</style>
