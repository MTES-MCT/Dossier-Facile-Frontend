<template>
  <button
    :disabled="disabled"
    :class="classes()"
    class="fr-btn"
    :title="title"
    @click="onClick"
  >
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
  @Prop({ default: false }) disabled?: boolean;
  @Prop({ default: false }) dark?: boolean;

  classes() {
    return {
      "fr-btn--secondary": !this.primary,
      "fr-btn--lg": this.size === "large",
      "fr-btn--sm": this.size === "small",
      "fr-btn--icon": this.size === "icon",
      dark: this.dark,
    };
  }

  onClick() {
    this.$emit("on-click");
  }
}
</script>

<style lang="scss">
.fr-btn.dark {
  color: rgb(0, 0, 145);
  background-color: rgb(133, 133, 246);

  &:hover {
    --hover-tint: rgb(177, 177, 249);
    background-color: var(--hover-tint);
  }
  &:active {
    --active-tint: rgb(198, 198, 251);
    background-color: var(--active-tint);
  }
}
</style>
