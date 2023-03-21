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
      dark: this.dark
    };
  }

  onClick() {
    this.$emit("on-click");
  }
}
</script>

<style lang="scss">
.fr-btn.dark {
  --blue-france-sun-113-625: #8585f6;
  --border-action-high-blue-france: var(--blue-france-sun-113-625);
  --text-action-high-blue-france: var(--blue-france-sun-113-625);

  background-color: transparent;
  &:hover {
    --hover-tint: rgba(52, 52, 52);
    background-color: var(--hover-tint);
  }
  &:active {
    --hover-tint: rgba(71, 71, 71);
    background-color: var(--hover-tint);
  }
}
</style>
