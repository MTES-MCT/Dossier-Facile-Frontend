<template>
  <div class="icons" v-if="getStatus()">
    <span class="material-icons-outlined" aria-hidden="true">{{
      getStatus()
    }}</span>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from "vue";
const props = defineProps<{
  status: string;
}>();

function getStatus() {
  switch (props.status) {
    case "EMPTY":
      return "arrow_forward";
    case "FILLED":
      return "attachment";
    case "TO_PROCESS":
      return "schedule";
    case "VALIDATED":
      return "verified";
    case "DECLINED":
      return "report_gmailerrorred";
    case "NAME":
      return "badge";
    case "ALONE":
      return "person";
    case "COUPLE":
      return "group";
    case "GROUP":
      return "groups";
  }
  return undefined;
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
