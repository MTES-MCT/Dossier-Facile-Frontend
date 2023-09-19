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
<script lang="ts">
import DeclinedMessage from "df-shared/src/components/DeclinedMessage.vue";
import { DocumentDeniedReasons } from "df-shared/src/models/DocumentDeniedReasons";
import { Component, Prop, Vue } from "vue-property-decorator";

@Component({
  components: {
    DeclinedMessage,
  },
})
export default class AllDeclinedMessages extends Vue {
  @Prop({ default: null }) documentDeniedReasons?: DocumentDeniedReasons | null;
  @Prop({ default: "" }) documentStatus?: string;
}
</script>

<style scoped lang="scss">
.m1 {
  margin: 0 0 1rem;
  &:last-child {
    margin-bottom: 0;
  }
}
</style>
