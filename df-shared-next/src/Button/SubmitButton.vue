<template>
  <div class="fr-col-12 fr-mb-5w right">
    <button class="fr-btn" type="submit">
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