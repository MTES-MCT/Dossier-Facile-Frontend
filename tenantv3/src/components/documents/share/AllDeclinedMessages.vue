<template>
  <div
    v-if="
      documentDeniedReasons !== null &&
      ((documentDeniedReasons.selectedOptions &&
        documentDeniedReasons.selectedOptions.length > 0) ||
        documentDeniedReasons.comment) &&
      documentStatus !== 'VALIDATED'
    "
    class="fr-mt-3w"
  >
    <div
      class="m1"
      v-for="(o, k) in documentDeniedReasons.selectedOptions"
      :key="k"
    >
      <DeclinedMessage :message="o.label"></DeclinedMessage>
    </div>
    <div class="m1" v-if="documentDeniedReasons.comment">
      <DeclinedMessage
        :message="documentDeniedReasons.comment"
      ></DeclinedMessage>
    </div>
  </div>
</template>
<script setup lang="ts">
import DeclinedMessage from "df-shared-next/src/components/DeclinedMessage.vue";
import { DocumentDeniedReasons } from "df-shared-next/src/models/DocumentDeniedReasons";

  const props = withDefaults(defineProps<{
    documentDeniedReasons?: DocumentDeniedReasons | null;
    documentStatus?: string;
  }>(), {
    documentDeniedReasons: null,
    documentStatus: "",
  });
</script>

<style scoped lang="scss">
.m1 {
  margin: 0 0 1rem;
  &:last-child {
    margin-bottom: 0;
  }
}
</style>
