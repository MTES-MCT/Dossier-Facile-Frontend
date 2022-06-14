<template>
  <div class="v-gouv-fr-button">
    <button
      :class="`fr-btn ` + typeClass + sizeClass + iconClass"
      :disabled="disabled"
      :title="iconOnly ? label : undefined"
      @click="pushClick"
      :type="btnType"
    >
      <template v-if="!$slots.default">
        <span class="sr-only" v-if="iconOnly">{{ label }}</span>
        <template v-else>
          {{ label }}
        </template>
      </template>
      <slot v-if="$slots.default"></slot>
    </button>
  </div>
</template>
<script>
export default {
  name: "v-gouv-fr-button",
  props: {
    disabled: {
      type: Boolean,
      default: false
    },
    icon: {
      type: String,
      default: ""
    },
    iconPosition: {
      type: String,
      default: "left"
    },
    iconOnly: {
      type: Boolean,
      default: false
    },
    label: {
      type: String,
      default: "Bouton"
    },
    primary: {
      type: Boolean,
      default: false
    },
    secondary: {
      type: Boolean,
      default: false
    },
    small: {
      type: Boolean,
      default: false
    },
    large: {
      type: Boolean,
      default: false
    },
    fullWidth: {
      type: Boolean,
      default: false
    },
    btnType: {
      type: String,
      default: "submit"
    }
  },
  computed: {
    //gets type class (primary or secondary)
    typeClass: function() {
      if (this.secondary && !this.primary) {
        return "fr-btn--secondary "; //trailing space for next classes
      }
      return "";
    },
    //gets size class (small, medium or large)
    sizeClass: function() {
      if (this.small) return "fr-btn--sm ";
      else if (this.large) return "fr-btn--lg ";
      else if (this.fullWidth) return "full-width ";
      return "";
    },
    //gets icon class
    iconClass: function() {
      if (
        this.icon === "" ||
        (this.iconPosition !== "left" && this.iconPosition !== "right")
      )
        return "";

      let computedIconClass = "fr-fi-" + this.icon;
      if (!this.iconOnly) {
        computedIconClass += " fr-btn--icon-" + this.iconPosition;
      }
      return computedIconClass;
    }
  },
  methods: {
    pushClick(e) {
      this.$emit("click", e);
    }
  }
};
</script>
