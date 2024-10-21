<template>
  <div class="svg-box">
    <svg
      v-if="state === 'pending'"
      class="svg-box-content"
      viewbox="0, 0, 112, 112"
      :height="radius * 2 + 12"
      :width="radius * 2 + 12"
    >
      <circle
        class="progress-ring-circle"
        :stroke="color"
        stroke-width="6"
        :stroke-dasharray="circumference"
        :stroke-dashoffset="strokeDashoffset"
        fill="transparent"
        :r="radius"
        :cx="radius + 6"
        :cy="radius + 6"
      />
      <text x="22" y="25" class="small" text-anchor="middle">
        {{ Math.floor(percentage) + '%' }}
      </text>
    </svg>
    <svg v-if="state === 'done'" width="42" height="42" viewBox="0 0 24 24">
      <path d="M0 0h24v24H0z" fill="none" />
      <path
        d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"
        :fill="color"
      />
    </svg>

    <svg v-if="state === 'error'" width="42" height="42" viewBox="0 0 24 24">
      <path d="M0 0h24v24H0z" fill="none" />
      <path
        d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"
        :fill="errorColor"
      />
    </svg>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'

const props = withDefaults(
  defineProps<{
    percentage: number
    color?: string
    errorColor?: string
    state?: string
  }>(),
  {
    percentage: 0,
    color: '#42b983',
    errorColor: '#f66',
    state: 'pending'
  }
)

const radius = 16
const circumference = radius * 2 * Math.PI
const strokeDashoffset = ref(circumference)

// TODO
// @Watch("percentage")
function onPercentageChanged(val: number, oldVal: number) {
  const offset = circumference - (val / 100) * circumference
  strokeDashoffset.value = offset
}
onMounted(() => {
  onPercentageChanged(props.percentage, 0)
})
</script>

<style scoped lang="scss">
.progress-ring-circle {
  transition: stroke-dashoffset 0.3s;
  transform: rotate(-90deg);
  transform-origin: 50% 50%;
}
.small {
  font-size: 10px;
}
.svg-box {
  display: block;
}
</style>
