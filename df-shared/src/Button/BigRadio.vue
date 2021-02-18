<template>
  <div
    class="rf-m-2w rf-p-2w br"
    :class="{ selected: value === val }"
    @click="setValue()"
  >
    <slot></slot>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";

@Component
export default class BigRadio extends Vue {
  @Prop() val!: string;
  @Prop() value!: string;

  setValue() {
    this.$emit("input", this.val);
  }
}
</script>

<style scoped lang="scss">
.br {
  height: 9rem;
  width: 8rem;
  cursor: pointer;
  border-radius: 10%;
  text-align: center;
  border: 1px solid var(--g300);

  box-shadow: 8px 8px 12px 0 rgba(0, 0, 15, 0.2),
    -8px -8px 12px 0 rgba(240, 240, 255, 0.5);

  &:hover {
    border: 1px solid var(--tertiary);
    background-color: var(--bd300);
  }

  &.selected {
    border: 1px solid var(--tertiary);
    background-color: var(--bd300);

    box-shadow: inset 6px 6px 10px 0 rgba(0, 0, 0, 0.2),
      inset -6px -6px 10px 0 rgba(255, 255, 255, 0.5);
  }
}
</style>