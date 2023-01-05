<template>
  <label class="fr-label" :for="forInput">
    <slot></slot>
    <span v-if="required" style="color:red"> *</span>
    <span> :</span>
  </label>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class FieldLabel extends Vue {
  @Prop({ default: false }) required!: boolean;
  @Prop() label!: string;
  @Prop() forInput?: string;
}
</script>

<style scoped lang="scss"></style>
