<template>
  <button :class="classes()" class="fr-btn" :title="title" @click="onClick">
    <slot></slot>
  </button>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";

@Component
export default class DfButton extends Vue {
  @Prop() title!: string;
  @Prop({ default: false }) private primary?: boolean;
  @Prop({ default: "normal" }) private size?: string;

  classes() {
    return {
      "fr-btn--secondary": !this.primary,
      "fr-btn--lg": this.size === "large",
      "fr-btn--sm": this.size === "small",
      "fr-btn--icon": this.size === "icon"
    };
  }

  onClick() {
    this.$emit("on-click");
  }
}
</script>

<style lang="scss"></style>
