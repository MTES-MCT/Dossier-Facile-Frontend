<template>
  <div
    class="rf-mb-5w rf-p-2w br"
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
  background-color: var(--w);

  &:hover {
    border: 1px solid var(--tertiary);
    background-color: var(--bd300);
  }

  &.selected {
    border: 1px solid var(--tertiary);
    background-color: var(--bd300);
    box-shadow: 0 0 0.666em rgba(0, 0, 0, 0.25);
  }
}
</style>