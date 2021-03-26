<template>
  <div class="v-gouv-fr-button">
    <button
      :class="`rf-btn ` + typeClass + sizeClass + iconClass"
      :disabled="disabled"
      :title="iconOnly ? label : undefined"
      @click="pushClick"
    >
      <span class="sr-only" v-if="iconOnly">{{ label }}</span>
      <template v-else>
        {{ label }}
      </template>
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
    }
  },
  computed: {
    //gets type class (primary or secondary)
    typeClass: function() {
      if (this.secondary && !this.primary) {
        return "rf-btn--secondary "; //trailing space for next classes
      }
      return "";
    },
    //gets size class (small, medium or large)
    sizeClass: function() {
      if (this.small) return "rf-btn--sm ";
      else if (this.large) return "rf-btn--lg ";
      return "";
    },
    //gets icon class
    iconClass: function() {
      if (
        this.icon === "" ||
        (this.iconPosition !== "left" && this.iconPosition !== "right")
      )
        return "";

      let computedIconClass = "rf-fi-" + this.icon;
      if (!this.iconOnly) {
        computedIconClass += " rf-btn--icon-" + this.iconPosition;
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
