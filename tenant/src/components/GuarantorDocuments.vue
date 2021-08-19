<template>
  <div>
    <div>
      <div v-if="guarantorStep <= 1">
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

        <div class="fr-grid-row space-around">
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

        <GuarantorFooter
          @on-back="goBack"
          @on-next="setGuarantorType"
        ></GuarantorFooter>
      </div>
      <div v-if="guarantorStep === 2">
        <div v-if="guarantorType === 'NATURAL_PERSON'">
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
                @on-next="goNext"
              ></GuarantorFooter>
            </div>
          </div>
        </div>
        <div v-if="guarantorType === 'ORGANISM'">
          <OrganismCert></OrganismCert>
        </div>
        <div v-if="guarantorType === 'LEGAL_PERSON'">
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
            <CorporationIdentification
              v-if="guarantorSubStep === 1"
            ></CorporationIdentification>
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
            <RepresentativeIdentification
              v-if="guarantorSubStep === 2"
            ></RepresentativeIdentification>
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
import { Component, Vue, Watch } from "vue-property-decorator";
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
    VGouvFrModal
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
  guarantorSubStep!: number;
  guarantorType = "";
  tmpGuarantorType = "";
  changeGuarantorVisible = false;

  mounted() {
    if (this.guarantor.typeGuarantor) {
      this.guarantorType = this.guarantor.typeGuarantor;
      this.tmpGuarantorType = this.guarantor.typeGuarantor;
    }
  }

  @Watch("guarantor")
  onGuarantorChange(val: Guarantor) {
    this.guarantorType = val.typeGuarantor || "";
  }

  updateSubstep(s: number) {
    this.$store.commit(
      "setGuarantorSubstep",
      s === this.guarantorSubStep ? 0 : s
    );
  }

  documentsFilled() {
    return (
      (this.guarantorType === "NATURAL_PERSON" &&
        this.hasDoc("IDENTIFICATION") &&
        this.hasDoc("PROFESSIONAL") &&
        this.hasDoc("RESIDENCY") &&
        this.isFinancialValid() &&
        this.isTaxValid()) ||
      (this.guarantorType === "LEGAL_PERSON" &&
        this.hasDoc("IDENTIFICATION") &&
        this.hasDoc("IDENTIFICATION_LEGAL_PERSON")) ||
      (this.guarantorType === "ORGANISM" && this.hasDoc("IDENTIFICATION"))
    );
  }

  hasDoc(docType: string) {
    const f = this.guarantor.documents?.find(d => {
      return d.documentCategory === docType;
    })?.files;
    return f && f.length > 0;
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
    const docs = this.guarantor.documents?.filter(d => {
      return d.documentCategory === "FINANCIAL";
    });
    if (!docs || docs.length === 0) {
      return false;
    }

    for (const doc of docs) {
      if (!doc.noDocument && (doc.files?.length || 0) <= 0) {
        return false;
      }
    }

    return true;
  }

  isTaxValid() {
    const doc = this.guarantor.documents?.find(d => {
      return d.documentCategory === "TAX";
    });
    if (!doc) {
      return false;
    }
    if (doc.files) {
      return true;
    }
    if (doc.documentSubCategory !== "my-name") {
      return true;
    }

    return false;
  }

  setGuarantorType() {
    AnalyticsService.addGuarantor(this.guarantorType);
    if (this.tmpGuarantorType === "NO_GUARANTOR") {
      this.$store.commit("setStep", 4);
    }
    if (this.tmpGuarantorType != this.guarantorType) {
      this.$store.dispatch("setGuarantorType", this.tmpGuarantorType);
    } else {
      this.$store.commit("setGuarantorStep", 2);
    }
  }

  onSelectChange(value: string) {
    this.tmpGuarantorType = value;
    if (this.guarantorType !== null) {
      if (
        this.guarantorType !== value &&
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
    this.tmpGuarantorType = this.guarantorType;
    this.changeGuarantorVisible = false;
  }

  goBack() {
    if (this.guarantorSubStep > 1) {
      this.updateSubstep(this.guarantorSubStep - 1);
    } else {
      this.$store.commit("setStep", 2);
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
"organism": "An organization (VISALE for example)",
"legal-person": "A corporation guarantor",
"no-guarantor": "I want to continue without a guarantor",
"more-information": "More information"
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
"organism": "Un organisme (VISALE…)",
"legal-person": "Un garant moral",
"no-guarantor": "Je veux poursuivre sans garant",
"more-information": "Plus d'informations"
}
}
</i18n>
