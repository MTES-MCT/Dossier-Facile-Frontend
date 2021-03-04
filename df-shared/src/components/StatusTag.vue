<template>
  <p class="rf-tag">
    <span>{{ $t(status) }}</span>
  </p>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class StatusTag extends Vue {
  @Prop() status!: string;
}
</script>

<i18n>
{
  "en": {
    "TO_PROCESS":"to process",
    "VALIDATED":"validated",
    "DECLINED":"declined",
    "INCOMPLETE":"incomplete"
  },
  "fr": {
    "TO_PROCESS":"non vérifié",
    "VALIDATED":"vérifié",
    "DECLINED":"modification demandée",
    "INCOMPLETE":"non terminé"
  }
}
</i18n>