<template>
  <div
    class="br"
    :class="{ selected: value === val, big: big }"
    @click="setValue()"
  >
    <slot></slot>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";

@Component
export default class BigRadio extends Vue {
  @Prop() val!: unknown;
  @Prop() value!: unknown;
  @Prop({ default: false }) big!: boolean;

  setValue() {
    this.$emit("input", this.val);
  }
}
</script>

<style scoped lang="scss">
.br {
  padding: 0.5rem;
  margin: 0.25rem;
  font-size: 0.9rem;
  cursor: pointer;
  border: 1px solid var(--g300);
  border-radius: 0.4rem;
  text-align: center;
  background-color: var(--w);
  @media all and (min-width: 992px) {
    max-width: 15rem;
  }

  &:hover {
    border: 1px solid var(--primary);
    background-color: var(--primary);
    color: white;
    box-shadow: 0 0 0.666em rgba(0, 0, 0, 0.25);
    &.big {
      color: var(--g800);
      background-color: var(--bf200-bf300);
    }
  }

  &.selected {
    border: 1px solid var(--primary);
    background-color: var(--primary);
    color: white;
    &.big {
      color: var(--g800);
      background-color: var(--bf200-bf300);
    }
  }
}

.big {
  @media all and (min-width: 992px) {
    height: 12rem;
    width: 10rem;
  }
  width: 100%;
  padding: 1rem;
  font-size: 1rem;
}

.small {
  color: none;
  &.selected {
    background-color: var(--primary);
    color: white;
  }
}
</style>
