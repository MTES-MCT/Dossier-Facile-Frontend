<template>
  <div v-if="document">
    <div
      v-for="(m, k) in document.documentDeniedReasons.checkedOptions"
      :key="k"
    >
      <DeclinedMessage :message="m"></DeclinedMessage>
    </div>
    <div v-if="document.documentDeniedReasons.comment">
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
