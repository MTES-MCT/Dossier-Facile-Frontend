<template>
  <p class="rf-tag" :class="getClass()">
    <span>{{ $t(status) }}</span>
  </p>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class StatusTag extends Vue {
  @Prop({ default: "EMPTY" }) status!: string;

  getClass() {
    switch (this.status) {
      case "TO_PROCESS":
        return "to-process";
      case "VALIDATED":
        return "validated";
      case "DECLINED":
        return "declined";
    }
  }
}
</script>

<style scoped lang="scss">
/* TODO : use var */
.to-process {
  color: #000074;
  background-color: #ededf2;
}
.validated {
  color: #169b62;
  background-color: #e3ebd3;
}
.declined {
  color: white;
  background-color: #f07f87;
}
</style>

<i18n>
{
  "en": {
    "EMPTY": "Empty",
    "TO_PROCESS":"To process",
    "VALIDATED":"Validated",
    "DECLINED":"Declined",
    "INCOMPLETE":"Incomplete"
  },
  "fr": {
    "EMPTY": "Absent",
    "TO_PROCESS":"En cours de traitement",
    "VALIDATED":"Vérifié",
    "DECLINED":"Modification demandée",
    "INCOMPLETE":"Non terminé"
  }
}
</i18n>