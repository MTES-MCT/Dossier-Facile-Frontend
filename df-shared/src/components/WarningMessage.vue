<template>
  <div class="rf-callout">
    <p class="rf-callout__text">
      <slot></slot>
    </p>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component
export default class WarningMessage extends Vue {}
</script>