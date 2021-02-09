<template>
  <button :class="classes()" class="rf-btn" :title="title" @click="onClick">
    <slot></slot>
  </button>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";

@Component
export default class DfButton extends Vue {
  @Prop() private title!: string;
  @Prop({ default: false }) private primary?: boolean;
  @Prop({ default: "normal" }) private size?: string;

  classes() {
    return {
      "rf-btn--secondary": !this.primary,
      "rf-btn--lg": this.size === "large",
      "rf-btn--sm": this.size === "small"
    };
  }

  onClick() {
    this.$emit("on-click");
  }
}
</script>

<style lang="scss"></style>
