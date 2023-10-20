<template>
  <button
    :class="classes()"
    class="fr-btn"
    :title="props.title"
    @click="onClick"
  >
    <slot></slot>
  </button>
</template>

<script setup lang="ts">
import { withDefaults } from "vue";

const emit = defineEmits(["on-click"]);

const props = withDefaults(
  defineProps<{
    title?: string;
    primary?: boolean;
    size?: string;
  }>(),
  {
    primary: false,
    size: "normal"
  }
);

function classes() {
  return {
    "fr-btn--secondary": !props.primary,
    "fr-btn--lg": props.size === "large",
    "fr-btn--sm": props.size === "small",
    "fr-btn--icon": props.size === "icon"
  };
}

function onClick() {
  emit("on-click");
}
</script>
