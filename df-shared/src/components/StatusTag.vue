<template>
  <p class="rf-tag">
    <span>{{ $t(status) }}</span>
  </p>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class StatusTag extends Vue {
  @Prop({ default: "EMPTY" }) status!: string;
}
</script>

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