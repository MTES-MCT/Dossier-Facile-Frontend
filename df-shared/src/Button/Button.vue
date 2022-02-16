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
const emit = defineEmits(["on-click"]);

const props = defineProps<{
  title: { type: string; required: true };
  primary: { type: boolean; required: false; default: false };
  size: { type: string; required: false; default: "normal" };
}>();

function classes() {
  return {
    "fr-btn--secondary": !props.primary,
    "fr-btn--lg": props.size === "large",
    "fr-btn--sm": props.size === "small",
    "fr-btn--icon": props.size === "icon",
  };
}

function onClick() {
  emit("on-click");
}
</script>

<style lang="scss"></style>
