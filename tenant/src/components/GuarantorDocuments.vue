<template>
  <div>
    <div>
      <div v-if="guarantorStep <= 1">
        <div class="remark fr-mt-3w">
          <h3>{{ $t("remark-title") }}</h3>
          {{ $t("remark-text") }}
        </div>

        <div class="card-container">
          <NakedCard class="fr-mt-3w">
            <template v-slot:content>
              <div class="fr-pl-3v">{{ $t("ask-guarantor") }}</div>
              <v-gouv-fr-modal>
                <template v-slot:button>
                  <span class="small-font fr-mt-1w">{{
                    $t("more-information")
                  }}</span>
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
      <div v-if="guarantorStep === 2">
        <div v-if="guarantor.typeGuarantor === 'NATURAL_PERSON'">
          <div>
            <div class="fr-grid-row">
              <div
                class="fr-grid-row fr-mr-3w fr-mb-3w btn-group"
                :class="{ guarantorselected: guarantor === g }"
                v-for="(g, k) in user.guarantors"
                :key="k"
              >
                <DfButton @on-click="selectGuarantor(k)">
                  <span>
                    {{ getName(g, k) }}
                  </span>
                </DfButton>
                <DfButton size="icon" @on-click="remove(g)">
                  <span class="material-icons text-danger">delete_forever</span>
                </DfButton>
              </div>
            </div>
            <div
              class="document-title title-bar"
              :class="{ selected: guarantorSubStep === 1 }"
              @click="updateSubstep(1)"
            >
              <span
                v-if="guarantorSubStep === 1"
                class="color--primary material-icons"
                >keyboard_arrow_up</span
              >
              <span
                v-if="guarantorSubStep !== 1"
                class="color--primary material-icons"
                >keyboard_arrow_down</span
              >
              <span class="color--primary material-icons">person</span>
              <h2>{{ $t("identification") }}</h2>
              <span class="spacer"></span>
              <span
                v-if="hasDoc('IDENTIFICATION')"
                class="color--primary material-icons"
                >check_circle_outline</span
              >
            </div>
            <div v-if="guarantorSubStep === 1">
              <GuarantorIdentification></GuarantorIdentification>
              <GuarantorFooter
                @on-back="goBack"
                @on-next="goNext"
              ></GuarantorFooter>
            </div>
          </div>
          <div>
            <div
              class="document-title title-bar"
              :class="{ selected: guarantorSubStep === 2 }"
              @click="updateSubstep(2)"
            >
              <span
                v-if="guarantorSubStep === 2"
                class="color--primary material-icons"
                >keyboard_arrow_up</span
              >
              <span
                v-if="guarantorSubStep !== 2"
                class="color--primary material-icons"
                >keyboard_arrow_down</span
              >
              <span class="color--primary material-icons">home</span>
              <h2>{{ $t("residency") }}</h2>
              <span class="spacer"></span>
              <span
                v-if="hasDoc('RESIDENCY')"
                class="color--primary material-icons"
                >check_circle_outline</span
              >
            </div>
            <div v-if="guarantorSubStep === 2">
              <GuarantorResidency></GuarantorResidency>
              <GuarantorFooter
                @on-back="goBack"
                @on-next="goNext"
              ></GuarantorFooter>
            </div>
          </div>
          <div>
            <div
              class="document-title title-bar"
              :class="{ selected: guarantorSubStep === 3 }"
              @click="updateSubstep(3)"
            >
              <span
                v-if="guarantorSubStep === 3"
                class="color--primary material-icons"
                >keyboard_arrow_up</span
              >
              <span
                v-if="guarantorSubStep !== 3"
                class="color--primary material-icons"
                >keyboard_arrow_down</span
              >
              <span class="color--primary material-icons">work</span>
              <h2>{{ $t("professional") }}</h2>
              <span class="spacer"></span>
              <span
                v-if="hasDoc('PROFESSIONAL')"
                class="color--primary material-icons"
                >check_circle_outline</span
              >
            </div>
            <div v-if="guarantorSubStep === 3">
              <GuarantorProfessional></GuarantorProfessional>
              <GuarantorFooter
                @on-back="goBack"
                @on-next="goNext"
              ></GuarantorFooter>
            </div>
          </div>
          <div>
            <div
              class="document-title title-bar"
              :class="{ selected: guarantorSubStep === 4 }"
              @click="updateSubstep(4)"
            >
              <span
                v-if="guarantorSubStep === 4"
                class="color--primary material-icons"
                >keyboard_arrow_up</span
              >
              <span
                v-if="guarantorSubStep !== 4"
                class="color--primary material-icons"
                >keyboard_arrow_down</span
              >
              <span class="color--primary material-icons">euro</span>
              <h2>{{ $t("financial") }}</h2>
              <span class="spacer"></span>
              <span
                v-if="isFinancialValid()"
                class="color--primary material-icons"
                >check_circle_outline</span
              >
            </div>
            <div v-if="guarantorSubStep === 4">
              <GuarantorFinancial
                @on-back="goBack"
                @on-next="goNext"
              ></GuarantorFinancial>
            </div>
          </div>
          <div>
            <div
              class="document-title title-bar"
              :class="{ selected: guarantorSubStep === 5 }"
              @click="updateSubstep(5)"
            >
              <span
                v-if="guarantorSubStep === 5"
                class="color--primary material-icons"
                >keyboard_arrow_up</span
              >
              <span
                v-if="guarantorSubStep !== 5"
                class="color--primary material-icons"
                >keyboard_arrow_down</span
              >
              <span class="color--primary material-icons">content_copy</span>
              <h2>{{ $t("tax") }}</h2>
              <span class="spacer"></span>
              <span v-if="isTaxValid()" class="color--primary material-icons"
                >check_circle_outline</span
              >
            </div>
            <div v-if="guarantorSubStep === 5">
              <GuarantorTax></GuarantorTax>
              <GuarantorFooter
                @on-back="goBack"
                @on-next="nextStep"
              ></GuarantorFooter>
            </div>
          </div>
          <div v-if="guarantorSubStep === 0">
            <GuarantorFooter
              @on-back="goBack"
              @on-next="goNext"
            ></GuarantorFooter>
          </div>
        </div>
        <div v-if="guarantor.typeGuarantor === 'ORGANISM'">
          <OrganismCert></OrganismCert>
          <GuarantorFooter
            @on-back="goBack"
            @on-next="nextStep"
          ></GuarantorFooter>
        </div>
        <div v-if="guarantor.typeGuarantor === 'LEGAL_PERSON'">
          <div>
            <div
              class="document-title title-bar"
              :class="{ selected: guarantorSubStep === 1 }"
              @click="updateSubstep(1)"
            >
              <span
                v-if="guarantorSubStep === 1"
                class="color--primary material-icons"
                >keyboard_arrow_up</span
              >
              <span
                v-if="guarantorSubStep !== 1"
                class="color--primary material-icons"
                >keyboard_arrow_down</span
              >
              <span class="color--primary material-icons">person</span>
              <h2>{{ $t("representative-identification") }}</h2>
            </div>
            <div v-if="guarantorSubStep === 1">
              <CorporationIdentification></CorporationIdentification>
              <GuarantorFooter
                @on-back="goBack"
                @on-next="goNext"
              ></GuarantorFooter>
            </div>
          </div>
          <div>
            <div
              class="document-title title-bar"
              :class="{ selected: guarantorSubStep === 2 }"
              @click="updateSubstep(2)"
            >
              <span
                v-if="guarantorSubStep === 2"
                class="color--primary material-icons"
                >keyboard_arrow_up</span
              >
              <span
                v-if="guarantorSubStep !== 2"
                class="color--primary material-icons"
                >keyboard_arrow_down</span
              >
              <span class="color--primary material-icons">home</span>
              <h2>{{ $t("corporation-identification") }}</h2>
            </div>
            <div v-if="guarantorSubStep === 2">
              <RepresentativeIdentification></RepresentativeIdentification>
              <GuarantorFooter
                @on-back="goBack"
                @on-next="nextStep"
              ></GuarantorFooter>
            </div>
          </div>
          <div v-if="guarantorSubStep === 0">
            <GuarantorFooter
              @on-back="goBack"
              @on-next="goNext"
            ></GuarantorFooter>
          </div>
        </div>
      </div>
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
import { UtilsService } from "../services/UtilsService";

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
    NakedCard
  },
  computed: {
    ...mapState({
      guarantorStep: "guarantorStep",
      guarantorSubStep: "guarantorSubStep",
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
  guarantorStep!: number;
  guarantorSubStep!: number;
  tmpGuarantorType = "";
  changeGuarantorVisible = false;

  mounted() {
    if (this.guarantor.typeGuarantor) {
      this.tmpGuarantorType = this.guarantor.typeGuarantor;
    }
  }

  updateSubstep(s: number) {
    this.$store.commit(
      "setGuarantorSubstep",
      s === this.guarantorSubStep ? 0 : s
    );
  }

  hasDoc(docType: string) {
    return UtilsService.guarantorHasDoc(docType, this.guarantor);
  }

  setGuarantorStep(n: number) {
    this.$store.commit("setGuarantorStep", n);
  }

  nextStep() {
    this.$store.commit("setStep", 4);
  }

  getName(g: Guarantor, k: number) {
    if (g.lastName) {
      return `${g.lastName} ${g.firstName}`;
    }
    return this.$i18n.t("guarantor") + " " + (k + 1);
  }

  selectGuarantor(k: number) {
    this.$store.commit("selectGuarantor", k);
  }

  remove(g: Guarantor) {
    this.$store.dispatch("deleteGuarantor", g).then(null, () => {
      Vue.toasted.global.error();
    });
  }

  isFinancialValid() {
    return UtilsService.isGuarantorFinancialValid(this.guarantor);
  }

  isTaxValid() {
    return UtilsService.isGuarantorTaxValid(this.guarantor);
  }

  setGuarantorType() {
    if (!this.tmpGuarantorType) {
      return;
    }
    AnalyticsService.addGuarantor(this.guarantor.typeGuarantor || "");
    if (this.tmpGuarantorType === "NO_GUARANTOR") {
      this.$store.commit("setStep", 4);
    }
    if (this.tmpGuarantorType != this.guarantor.typeGuarantor) {
      this.$store.dispatch("setGuarantorType", this.tmpGuarantorType);
    } else {
      this.$store.commit("setGuarantorStep", 2);
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
    if (this.guarantorSubStep > 1) {
      this.updateSubstep(this.guarantorSubStep - 1);
    } else {
      if (this.guarantorStep > 1) {
        this.$store.commit("setGuarantorStep", 0);
      } else {
        this.$store.commit("setStep", 2);
      }
    }
  }

  goNext() {
    if (this.guarantorSubStep < 5) {
      this.updateSubstep(this.guarantorSubStep + 1);
    } else {
      this.nextStep();
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
  border-radius: 0.25rem;
}

.card-container {
  @media all and (min-width: 992px) {
    width: fit-content;
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
"remark-text": "Adding a guarantor is by no means mandatory. If you do not wish to add a surety, you can select “I don't have a guarantor”. Your file will then be registered for investigation."
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
"remark-text": "Ajouter un garant n’est en aucun cas obligatoire. Si vous ne souhaitez pas ajouter de garant, nous pouvez sélectionner « Je n'ai pas de garant ». Votre dossier sera alors enregistré pour être instruit."
}
}
</i18n>
