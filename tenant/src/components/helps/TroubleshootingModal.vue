<template>
  <v-gouv-fr-modal>
    <template v-slot:button>
      {{ $t("more-information") }}
    </template>
    <template v-slot:title>
      {{ $t("more-information") }}
    </template>
    <template v-slot:content>
      <p>
        <slot></slot>
      </p>
    </template>
  </v-gouv-fr-modal>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import VGouvFrModal from "df-shared/src/GouvFr/v-gouv-fr-modal/VGouvFrModal.vue";

@Component({
  components: {
    VGouvFrModal
  }
})
export default class TroubleshootingModal extends Vue {}
</script>

<i18n>
{
  "en": {
    "more-information": "Having trouble finding the right document?"
  },
  "fr": {
    "more-information": "En difficulté pour répondre à la question ?"
  }
}
</i18n>
