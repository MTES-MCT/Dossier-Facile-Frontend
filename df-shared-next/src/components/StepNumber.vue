<template>
  <div class="step-number" :class="{ active: active }">{{ number }}</div>
</template>
<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class StepNumber extends Vue {
  @Prop() number!: number;
  @Prop({ default: false }) active!: boolean;
}
</script>
<style lang="scss" scoped>
.step-number {
  background-color: white;
  border: 1px solid var(--g400-t);
  margin: 0 5px;
  border-radius: 50%;
  display: inline-block;
  height: 2.25rem;
  width: 2.25rem;
  min-width: 2.25rem;
  line-height: 2.25rem;
  text-align: center;
  z-index: 1;
}

.active .step-number {
  background-color: var(--primary);
  color: white;
}
</style>
