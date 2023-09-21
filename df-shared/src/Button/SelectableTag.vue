<template>
  <button
    class="fr-tag"
    :aria-pressed="isEqual(value, val)"
    @click="setValue()"
    type="button"
  >
    <slot></slot>
  </button>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";

@Component
export default class BigRadio extends Vue {
  @Prop() val!: unknown;
  @Prop() value!: unknown;

  setValue() {
    this.$emit("input", this.val);
  }

  isEqual(value: any, val: any) {
    if (value.key && val.key) {
      return value.key === val.key;
    }
    return value === val;
  }
}
</script>
