<template>
  <div class="icons">
    <div v-if="status === 'TODO'">
      <span class="material-icons-outlined">arrow_forward</span>
    </div>
    <div v-if="status === 'PENDING'">
      <span class="material-icons-outlined">attachment</span>
    </div>
    <div v-if="status === 'TO_PROCESS'">
      <span class="material-icons-outlined">schedule</span>
    </div>
    <div v-if="status === 'VALIDATED'">
      <span class="material-icons-outlined">verified</span>
    </div>
    <div v-if="status === 'DECLINED'">
      <span class="material-icons-outlined">report_gmailerrorred</span>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class StatusIcon extends Vue {
  @Prop() status!: string;
}
</script>

<style scoped lang="scss">
.icons {
  padding-top: 4px;
  line-height: 16px;
  margin-right: 0.5rem;
}
.icons > div > span {
  font-size: 16px;
}
</style>
