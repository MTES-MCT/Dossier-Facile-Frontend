<template>
  <div
    v-if="
      document &&
        document.documentDeniedReasons &&
        document.documentStatus !== 'VALIDATED'
    "
    class="fr-mt-3w"
  >
    <div
      class="m1"
      v-for="(m, k) in document.documentDeniedReasons.checkedOptions"
      :key="k"
    >
      <DeclinedMessage :message="m"></DeclinedMessage>
    </div>
    <div class="m1" v-if="document.documentDeniedReasons.comment">
      <DeclinedMessage
        :message="document.documentDeniedReasons.comment"
      ></DeclinedMessage>
    </div>
  </div>
</template>
<script lang="ts">
import DeclinedMessage from "df-shared/src/components/DeclinedMessage.vue";
import { Component, Prop, Vue } from "vue-property-decorator";

@Component({
  components: {
    DeclinedMessage
  }
})
export default class Identification extends Vue {
  @Prop() document?: Document;
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
