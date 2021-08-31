<template>
  <div>
    <div>
      <div class="remark fr-mt-3w">
        <h3>{{ $t("remark-title") }}</h3>
        {{ $t("remark-text") }}
      </div>

      <div class="fr-mt-3w card-container">
        <NakedCard class="fr-pt-3w fr-pb-3w">
          <template v-slot:content>
            <div class="fr-pl-3v text-bold fr-mb-1w">
              {{ $t("ask-guarantor") }}
            </div>
            <v-gouv-fr-modal>
              <template v-slot:button>
                <span class="small-font">{{ $t("more-information") }}</span>
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

            <div class="fr-grid-col fr-mt-2w">
              <BigRadio
                val="NATURAL_PERSON"
                :value="tmpGuarantorType"
                @input="onSelectChange"
              >
                <div class="fr-grid-col spa">
                  <span>{{ $t("natural-person") }}</span>
                </div>
              </BigRadio>
              <BigRadio
                val="ORGANISM"
                :value="tmpGuarantorType"
                @input="onSelectChange"
              >
                <div class="fr-grid-col spa">
                  <span>{{ $t("organism") }}</span>
                </div>
              </BigRadio>
              <BigRadio
                val="LEGAL_PERSON"
                :value="tmpGuarantorType"
                @input="onSelectChange"
              >
                <div class="fr-grid-col spa">
                  <span>{{ $t("legal-person") }}</span>
                </div>
              </BigRadio>
              <BigRadio
                val="NO_GUARANTOR"
                :value="tmpGuarantorType"
                @input="onSelectChange"
              >
                <div class="fr-grid-col spa">
                  <span>{{ $t("no-guarantor") }}</span>
                </div>
              </BigRadio>
            </div>
          </template>
        </NakedCard>
      </div>

      <GuarantorFooter
        @on-back="goBack"
        @on-next="setGuarantorType"
      ></GuarantorFooter>
    </div>
    <ConfirmModal
      v-if="changeGuarantorVisible"
      @valid="validSelect()"
      @cancel="undoSelect()"
    >
      <span>{{ $t("will-delete-guarantor") }}</span>
    </ConfirmModal>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import GuarantorIdentification from "@/components/documents/GuarantorIdentification.vue";
import RepresentativeIdentification from "@/components/documents/RepresentativeIdentification.vue";
import CorporationIdentification from "@/components/documents/CorporationIdentification.vue";
import OrganismCert from "@/components/documents/OrganismCert.vue";
import GuarantorResidency from "@/components/documents/GuarantorResidency.vue";
import GuarantorProfessional from "@/components/documents/GuarantorProfessional.vue";
import GuarantorFinancial from "@/components/documents/GuarantorFinancial.vue";
import GuarantorTax from "@/components/documents/GuarantorTax.vue";
import { mapGetters, mapState } from "vuex";
import { Guarantor } from "df-shared/src/models/Guarantor";
import { User } from "df-shared/src/models/User";
import DfButton from "df-shared/src/Button/Button.vue";
import ConfirmModal from "df-shared/src/components/ConfirmModal.vue";
import VGouvFrButton from "df-shared/src/Button/v-gouv-fr-button/VGouvFrButton.vue";
import { AnalyticsService } from "../services/AnalyticsService";
import GuarantorFooter from "@/components/footer/GuarantorFooter.vue";
import GuarantorChoiceHelp from "./helps/GuarantorChoiceHelp.vue";
import BigRadio from "df-shared/src/Button/BigRadio.vue";
import VGouvFrModal from "df-shared/src/GouvFr/v-gouv-fr-modal/VGouvFrModal.vue";
import NakedCard from "df-shared/src/components/NakedCard.vue";
import ProfileContainer from "@/components/ProfileContainer.vue";

@Component({
  components: {
    DfButton,
    GuarantorTax,
    GuarantorFinancial,
    GuarantorProfessional,
    GuarantorResidency,
    GuarantorIdentification,
    RepresentativeIdentification,
    CorporationIdentification,
    OrganismCert,
    ConfirmModal,
    VGouvFrButton,
    GuarantorFooter,
    GuarantorChoiceHelp,
    BigRadio,
    VGouvFrModal,
    NakedCard,
    ProfileContainer
  },
  computed: {
    ...mapState({
      user: "user"
    }),
    ...mapGetters({
      guarantor: "guarantor"
    })
  }
})
export default class GuarantorDocuments extends Vue {
  user!: User;
  guarantor!: Guarantor;
  tmpGuarantorType = "";
  changeGuarantorVisible = false;

  mounted() {
    if (this.guarantor.typeGuarantor) {
      this.tmpGuarantorType = this.guarantor.typeGuarantor;
    }
  }

  onSelectChange(value: string) {
    this.tmpGuarantorType = value;
    if (this.guarantor.typeGuarantor !== null) {
      if (
        this.guarantor.typeGuarantor !== value &&
        (this.user.guarantors?.length || 0) > 0
      ) {
        this.changeGuarantorVisible = true;
      }
    }
    return false;
  }

  validSelect() {
    this.$store.dispatch("deleteAllGuarantors").then(
      () => {
        this.changeGuarantorVisible = false;
      },
      () => {
        Vue.toasted.global.error();
      }
    );
  }

  undoSelect() {
    this.tmpGuarantorType = this.guarantor.typeGuarantor || "";
    this.changeGuarantorVisible = false;
  }

  goBack() {
    this.$router.push({
      name: "TenantDocuments",
      params: { substep: "5" }
    });
  }

  setGuarantorType() {
    if (!this.tmpGuarantorType) {
      this.$toasted.show(this.$i18n.t("type-required").toString(), {
        type: "error",
        duration: 7000
      });
      return;
    }
    AnalyticsService.addGuarantor(this.guarantor.typeGuarantor || "");
    if (this.tmpGuarantorType === "NO_GUARANTOR") {
      this.$router.push({
        name: "ValidateFile"
      });
    }
    if (this.tmpGuarantorType != this.guarantor.typeGuarantor) {
      this.$store
        .dispatch("setGuarantorType", this.tmpGuarantorType)
        .then(() => {
          this.$router.push({
            name: "GuarantorDocuments",
            params: { substep: "1" }
          });
        });
    } else {
      this.$router.push({
        name: "GuarantorDocuments",
        params: { substep: "1" }
      });
    }
  }
}
</script>

<style scoped lang="scss">
@import "df-shared/src/scss/_variables.scss";

h2 {
  font-size: 1rem;
  margin: 0.5rem;
  display: inline-block;
  align-self: center;
}

.icon {
  align-self: center;
}

.document-title {
  border: 1px solid #ececec;
  border-radius: 5px;
  margin-bottom: 5px;
  cursor: pointer;
  display: flex;
}

.selected {
  background-color: $secondary;
}

.check {
  padding: 0.5rem;
  margin-left: auto;
  color: green;
}

.buttons {
  justify-content: space-between;
}

.guarantorselected {
  background-color: $light-blue-transparent;
}

.title-bar {
  display: flex;
  align-items: center;
  span {
    padding: 0.5rem;
    line-height: 1rem;
  }
}

.btn-group {
  width: fit-content;
}

h2 {
  line-height: 1.5rem;
}

.remark {
  background-color: #e5e5f4;
  padding: 1rem;
  border-radius: 0.25rem;
}

.card {
  padding: 1rem;
}

.card-container {
  @media all and (min-width: 992px) {
    width: 100%;
  }
}

.small-font {
  font-size: 14px;
}
</style>

<i18n>
{
"en": {
"identification": "Pièce d’identité",
"residency": "Justificatif de domicile",
"professional": "Justificatif de situation professionnelle",
"financial": "Justificatif de ressources",
"tax": "Avis d’imposition",
"representative-identification": "Identité de la personne morale",
"corporation-identification": "Identité du représentant de la personne morale",
"guarantor": "Guarantor",
"validate": "Validate",
"will-delete-guarantor": "Are you sure you want to change the type of guarantor?",
"validate-file": "Next step - Validate file",
"natural-person": "A classic physical guarantor",
"organism": "An organization",
"legal-person": "A corporation guarantor",
"no-guarantor": "I don't have a guarantor",
"more-information": "More information",
"ask-guarantor": "Do you want to add :",
"remark-title": "Remark",
"remark-text": "Adding a guarantor is by no means mandatory. If you do not wish to add a surety, you can select “I don't have a guarantor”. Your file will then be registered for investigation.",
"type-required": "Please select a choice"
},
"fr": {
"identification": "Pièce d’identité",
"residency": "Justificatif de domicile",
"professional": "Justificatif de situation professionnelle",
"financial": "Justificatif de ressources",
"tax": "Avis d’imposition",
"representative-identification": "Identité de la personne morale",
"corporation-identification": "Identité du représentant de la personne morale",
"guarantor": "Garant",
"validate": "Valider",
"will-delete-guarantor": "Êtes-vous sûr de vouloir changer le type de garant ?",
"validate-file": "Étape suivante - Valider le dossier",
"natural-person": "Un garant physique classique",
"organism": "Un organisme garant",
"legal-person": "Un garant moral",
"no-guarantor": "Je n'ai pas de garant",
"more-information": "En difficulté pour répondre à la question ?",
"ask-guarantor": "Souhaitez-vous ajouter :",
"remark-title": "Remarque",
"remark-text": "Ajouter un garant n’est en aucun cas obligatoire. Si vous ne souhaitez pas ajouter de garant, nous pouvez sélectionner « Je n'ai pas de garant ». Votre dossier sera alors enregistré pour être instruit.",
"type-required": "Veuillez sélectionner un choix"
}
}
</i18n>
