<template>
  <v-gouv-fr-modal>
    <template v-slot:button>
      {{ $t("troubleshootingmodal.more-information") }}
    </template>
    <template v-slot:title>
      {{ $t("troubleshootingmodal.more-information") }}
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
    VGouvFrModal,
  },
})
export default class TroubleshootingModal extends Vue {}
</script>
