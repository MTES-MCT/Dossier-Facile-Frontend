<template>
  <div :style="cssVars()" class="progress-indicator">
    <div :style="cssVars()"></div>
    <div :style="cssVars()"></div>
    <div :style="cssVars()"></div>
    <div :style="cssVars()"></div>
  </div>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    diameter: string;
    border: string;
    color: string;
  }>(),
  {
    diameter: "48px",
    border: "6px",
    color: "white"
  }
);

function cssVars() {
  return {
    "--diameter": props.diameter,
    "--border": props.border,
    "--color": props.color
  };
}
</script>

<style lang="scss" scoped>
.progress-indicator {
  display: inline-block;
  position: relative;
  width: var(--diameter);
  height: var(--diameter);
}

.progress-indicator div {
  width: var(--diameter);
  height: var(--diameter);
  box-sizing: border-box;
  display: block;
  position: absolute;
  margin: var(--border);
  border: var(--border) solid var(--color);
  border-radius: 50%;
  animation: progress-indicator 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
  border-color: var(--color) transparent transparent transparent;
}

.progress-indicator div:nth-child(1) {
  animation-delay: -0.45s;
}

.progress-indicator div:nth-child(2) {
  animation-delay: -0.3s;
}

.progress-indicator div:nth-child(3) {
  animation-delay: -0.15s;
}

@keyframes progress-indicator {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
