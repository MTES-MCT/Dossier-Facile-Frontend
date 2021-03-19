<template>
  <span>
    <span
      v-if="status === 'TO_PROCESS'"
      class="text-warning material-icons md-18"
      >more_time</span
    >
    <span v-if="status === 'DECLINED'" class="text-danger material-icons md-18"
      >cancel</span
    >
    <span
      v-if="status === 'VALIDATED'"
      class="text-success material-icons md-18"
      >check_circle_outline</span
    >
  </span>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class FileStatusIcon extends Vue {
  @Prop({ default: "TO_PROCESS" }) status?: string;
}
</script>

<style scoped>
.material-icons {
  padding: 0.25rem;
}
</style>
