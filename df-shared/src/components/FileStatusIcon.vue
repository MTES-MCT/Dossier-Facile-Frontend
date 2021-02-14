<template>
  <span>
    <span v-if="status === 'PENDING'" class="text-warning material-icons">more_time</span>
    <span v-if="status === 'CANCEL'" class="text-danger material-icons">cancel</span>
    <span v-if="status === 'VALID'" class="text-success material-icons">check_circle_outline</span>
  </span>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class FileStatusIcon extends Vue {
    
  @Prop({ default: "PENDING" }) status?: string;

}
</script>