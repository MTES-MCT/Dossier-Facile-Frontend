<template>
  <div style="display: flex">
    <button
      class="rf-btn rf-btn--secondary rf-fi-eye-line"
      title="View"
      @click="view"
      v-if="canView"
    >
      <span class="sr-only"> Edit </span>
    </button>
    <button
      class="rf-btn rf-btn--secondary rf-fi-edit-line"
      title="Edit"
      @click="edit"
    >
      <span class="sr-only"> Edit </span>
    </button>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class ViewEditBtn extends Vue {
  @Prop({ default: true }) canView!: boolean;

  view() {
    this.$emit("view");
  }
  edit() {
    this.$emit("edit");
  }
}
</script>

<style scoped lang="scss">
.rf-btn {
  border-radius: 50%;
  box-shadow: none;
}
</style>
