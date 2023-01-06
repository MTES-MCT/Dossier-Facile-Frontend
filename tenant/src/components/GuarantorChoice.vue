<template>
  <div>
    <div>
      <div v-if="isMobile()" class="remark fr-mt-3w fr-mb-3w">
        <div class="fr-h5">{{ $t("remark-title") }}</div>
        <div v-html="$t('remark-text')"></div>
      </div>

      <div ref="guarantor-body-content">
        <NakedCard class="fr-p-md-5w">
          <div v-if="!isMobile()">
            <div class="text-bold fr-mb-1w">
              <h1 class="fr-h5">
                {{ $t("my-guarantor") }}
              </h1>
            </div>
            <TroubleshootingModal>
              <GuarantorChoiceHelp></GuarantorChoiceHelp>
            </TroubleshootingModal>
            <div class="remark fr-mt-3w">
              <div class="fr-h6">{{ $t("remark-title") }}</div>
              <div class="small-font" v-html="$t('remark-text')"></div>
            </div>
          </div>
          <div class="fr-mt-3w fr-mb-2w">
            {{ $t("ask-guarantor") }}
          </div>
          <TroubleshootingModal v-if="isMobile()">
            <GuarantorChoiceHelp></GuarantorChoiceHelp>
          </TroubleshootingModal>

          <div class="fr-grid-col">
            <div class="width--fit-content">
              <BigRadio
                val="NATURAL_PERSON"
                :value="tmpGuarantorType"
                @input="onSelectChange"
              >
                <div class="fr-grid-col spa">
                  <span>{{ $t("natural-person") }}</span>
                </div>
              </BigRadio>
            </div>
            <div class="width--fit-content">
              <BigRadio
                val="ORGANISM"
                :value="tmpGuarantorType"
                @input="onSelectChange"
              >
                <div class="fr-grid-col spa">
                  <span>{{ $t("organism") }}</span>
                </div>
              </BigRadio>
            </div>
            <div class="width--fit-content">
              <BigRadio
                val="LEGAL_PERSON"
                :value="tmpGuarantorType"
                @input="onSelectChange"
              >
                <div class="fr-grid-col spa">
                  <span>{{ $t("legal-person") }}</span>
                </div>
              </BigRadio>
            </div>
            <div class="width--fit-content">
              <BigRadio
                class="fr-mt-md-3w"
                val="NO_GUARANTOR"
                :value="tmpGuarantorType"
                @input="onSelectChange"
              >
                <div class="fr-grid-col spa">
                  <span>{{ $t("no-guarantor") }}</span>
                </div>
              </BigRadio>
            </div>
          </div>
        </NakedCard>
        <div
          v-if="tmpGuarantorType === 'NO_GUARANTOR'"
          class="bg-purple fr-mt-3w fr-p-5w"
        >
          <div class="fr-grid-row space-between">
            <div class="fr-h5">{{ $t("visale-title") }}</div>
            <img
              alt="logo visale"
              class="logo-visale"
              src="../assets/visale.svg"
            />
          </div>
          <p>{{ $t("visale-text") }}</p>
          <div style="text-align: right">
            <DfButton primary="true" @on-click="gotoVisale()">
              {{ $t("visale-btn") }}
            </DfButton>
          </div>
        </div>
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
import GuarantorIdentification from "./documents/naturalGuarantor/GuarantorIdentification.vue";
import RepresentativeIdentification from "./documents/legalPersonGuarantor/RepresentativeIdentification.vue";
import CorporationIdentification from "./documents/legalPersonGuarantor/CorporationIdentification.vue";
import OrganismCert from "./documents/organismGuarantor/OrganismCert.vue";
import GuarantorResidency from "./documents/naturalGuarantor/GuarantorResidency.vue";
import GuarantorProfessional from "./documents/naturalGuarantor/GuarantorProfessional.vue";
import GuarantorFinancial from "./documents/naturalGuarantor/GuarantorFinancial.vue";
import GuarantorTax from "./documents/naturalGuarantor/GuarantorTax.vue";
import { mapGetters, mapState } from "vuex";
import { Guarantor } from "df-shared/src/models/Guarantor";
import { User } from "df-shared/src/models/User";
import DfButton from "df-shared/src/Button/Button.vue";
import ConfirmModal from "df-shared/src/components/ConfirmModal.vue";
import VGouvFrButton from "df-shared/src/Button/v-gouv-fr-button/VGouvFrButton.vue";
import { AnalyticsService } from "../services/AnalyticsService";
import GuarantorFooter from "./footer/GuarantorFooter.vue";
import GuarantorChoiceHelp from "./helps/GuarantorChoiceHelp.vue";
import BigRadio from "df-shared/src/Button/BigRadio.vue";
import VGouvFrModal from "df-shared/src/GouvFr/v-gouv-fr-modal/VGouvFrModal.vue";
import NakedCard from "df-shared/src/components/NakedCard.vue";
import ProfileContainer from "./ProfileContainer.vue";
import { UtilsService } from "../services/UtilsService";
import TroubleshootingModal from "@/components/helps/TroubleshootingModal.vue";

@Component({
  components: {
    TroubleshootingModal,
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
      guarantor: "guarantor",
      coTenants: "coTenants"
    })
  }
})
export default class GuarantorDocuments extends Vue {
  user!: User;
  coTenants!: User[];
  guarantor!: Guarantor;
  tmpGuarantorType = "";
  changeGuarantorVisible = false;

  updated() {
    // each dom update involved a scrollToEnd
    this.$nextTick(() => this.scrollToEnd());
  }
  scrollToEnd() {
    const element: any = this.$refs["guarantor-body-content"];
    window.scrollTo(0, element.lastElementChild.offsetTop);
  }

  getLocalStorageKey() {
    return "guarantorType_" + this.user.email;
  }

  beforeMount() {
    this.$store.dispatch("updateSelectedGuarantor", this.user.id);
    if (this.guarantor.typeGuarantor) {
      this.tmpGuarantorType = this.guarantor.typeGuarantor;
      localStorage.setItem(
        this.getLocalStorageKey(),
        this.guarantor.typeGuarantor
      );
    } else {
      const localType = localStorage.getItem(this.getLocalStorageKey());
      if (localType) {
        this.tmpGuarantorType = localType;
      }
    }
  }

  onSelectChange(value: string) {
    this.tmpGuarantorType = value;
    localStorage.setItem(this.getLocalStorageKey(), value);
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
    AnalyticsService.addGuarantor(this.tmpGuarantorType || "");
    if (this.tmpGuarantorType === "NO_GUARANTOR") {
      if (this.user.applicationType === "COUPLE") {
        this.$router.push({
          name: "CoTenantDocuments",
          params: {
            step: "4",
            substep: "0",
            tenantId: this.coTenants[0].id.toString()
          }
        });
      } else {
        this.$router.push({
          name: "ValidateFile"
        });
      }
    }
    if (
      this.tmpGuarantorType != this.guarantor.typeGuarantor ||
      (this.user.guarantors?.length || 0) <= 0
    ) {
      this.$store
        .dispatch("setGuarantorType", { typeGuarantor: this.tmpGuarantorType })
        .then(() => {
          this.$router.push({
            name: "GuarantorDocuments",
            params: { substep: "0" }
          });
        });
    } else {
      this.$router.push({
        name: "GuarantorList"
      });
    }
  }

  gotoVisale() {
    window.open("https://www.visale.fr", "_blank");
  }

  isMobile() {
    return UtilsService.isMobile();
  }
}
</script>

<style scoped lang="scss">
@import "df-shared/src/scss/_variables.scss";

.remark {
  background-color: #e5e5f4;
  padding: 1rem;
  border-radius: 0.25rem;
}

.logo-visale {
  width: 138px;
  height: 45px;
  margin-bottom: 1rem;
}

.width--fit-content {
  @media all and (min-width: 768px) {
    width: fit-content;
  }
}
</style>

<i18n>
{
"en": {
  "my-guarantor": "My guarantor",
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
  "ask-guarantor": "Do you want to add :",
  "remark-title": "Remark",
  "remark-text": "Adding a guarantor is by no means mandatory. If you do not wish to add a surety, you can select “I don't have a guarantor”.<br> Your file will then be registered for investigation.",
  "type-required": "Please select a choice",
  "visale-title": "Do you know Visale ?",
  "visale-text": "Visale is the guarantor of your future accommodation if you are between 18 and 30 years old OR if you are employees over 30 years old (subject to conditions).",
  "visale-btn": "Discover Visale"
},
"fr": {
  "my-guarantor": "Mon garant",
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
  "ask-guarantor": "Souhaitez-vous ajouter :",
  "remark-title": "Remarque",
  "remark-text": "Ajouter un garant n’est en aucun cas obligatoire. Si vous ne souhaitez pas ajouter de garant, vous pouvez sélectionner « Je n'ai pas de garant ».<br> Votre dossier sera alors enregistré pour être instruit.",
  "type-required": "Veuillez sélectionner un choix",
  "visale-title": "Connaissez-vous Visale ?",
  "visale-text": "Visale est le garant de votre futur logement si vous avez entre 18 et 30 ans OU si vous êtes salariés de + de 30 ans (soumis à conditions).",
  "visale-btn": "Découvrir Visale"
}
}
</i18n>
