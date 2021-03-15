<template>
  <div class="rf-col-12 rf-mb-5w right">
    <button class="rf-btn" type="submit">
      <slot>
        {{ $t("confirm") }}
      </slot>
    </button>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component
export default class SubmitButton extends Vue {}
</script>

<style scoped lang="scss">
.right {
  display: flex;
  justify-content: flex-end;
}
</style>

<i18n>
{
  "en": {
    "confirm": "Confirm"
  },
  "fr": {
    "confirm": "Confirmer"
  }
}
</i18n>