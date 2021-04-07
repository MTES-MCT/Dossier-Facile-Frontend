<template>
  <div>
    <p>
      {{ $t("add-guarantor-question") }}

      <v-gouv-fr-modal>
        <template v-slot:button>
          {{ $t("more-information") }}
        </template>
        <template v-slot:title>
          {{ $t("more-information") }}
        </template>
        <template v-slot:content>
          <p>
            <GuarantorChoiceHelp></GuarantorChoiceHelp>
          </p>
        </template>
      </v-gouv-fr-modal>

      <button class="rf-btn" @click="addGuarantor()">
        {{ $t("add-guarantor-btn") }}
      </button>
    </p>
    <div class="bg--blue info rf-p-2w rf-mt-2w rf-mb-2w border--radius">
      <h4 class="rf-mt-0">{{ $t("remark") }}</h4>
      <p>
        {{ $t("not-required") }}
      </p>
      <DfButton class="rf-btn" @on-click="goValidateFile">
        {{ $t("validate") }}
      </DfButton>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import DfButton from "df-shared/src/Button/Button.vue";
import VGouvFrModal from "df-shared/src/GouvFr/v-gouv-fr-modal/VGouvFrModal.vue";
import GuarantorChoiceHelp from "./helps/GuarantorChoiceHelp.vue";

@Component({
  components: { DfButton, VGouvFrModal, GuarantorChoiceHelp }
})
export default class AskGuarantor extends Vue {
  addGuarantor() {
    this.$emit("on-next-step");
  }

  goValidateFile() {
    this.$store.commit("setStep", 4);
  }
}
</script>

<i18n>
{
    "en": {
        "add-guarantor-question": "Si vous le souhaitez nous vous proposons d'ajouter un garant.",
        "add-guarantor-btn": "Ajouter un garant",
        "remark": "Remarque",
        "not-required": "Ajouter un garant n'est en aucun cas obligatoire. Si vous ne souhaitez pas ajouter de garant, vous pouvez cliquer directement sur le bouton ci-dessous «Valider mon dossier». Votre dossier sera alors enregistré pour être instruit.",
        "validate": "Valider mon dossier",
        "more-information": "More information"
    },
    "fr": {
        "add-guarantor-question": "Si vous le souhaitez nous vous proposons d'ajouter un garant.",
        "add-guarantor-btn": "Ajouter un garant",
        "remark": "Remarque",
        "not-required": "Ajouter un garant n'est en aucun cas obligatoire. Si vous ne souhaitez pas ajouter de garant, vous pouvez cliquer directement sur le bouton ci-dessous «Valider mon dossier». Votre dossier sera alors enregistré pour être instruit.",
        "validate": "Valider mon dossier",
        "more-information": "Plus d'informations"
    }
}

</i18n>

<style lang="scss" scoped></style>
