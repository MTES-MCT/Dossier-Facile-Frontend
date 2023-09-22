<template>
  <span>
    <i
      v-if="status === 'TO_PROCESS'"
      class="text-warning ri-time-line"
      style="font-size: 18px"
    ></i>
    <i
      v-if="status === 'DECLINED'"
      class="ri-close-circle-fill text-danger"
      style="font-size: 18px"
    ></i>
    <i
      v-if="status === 'VALIDATED'"
      class="text-success ri-checkbox-circle-line"
      style="font-size: 18px"
    ></i>
  </span>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class FileStatusIcon extends Vue {
  @Prop({ default: "TO_PROCESS" }) status?: string;
}
</script>
