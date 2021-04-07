<template>
  <div>
    <div v-if="guarantorStep === 0">
      <AskGuarantor @on-next-step="setGuarantorStep(1)"></AskGuarantor>
    </div>
    <div>
      <div v-if="guarantorStep === 1">
        <label class="rf-label" for="select"> Sélectionnez un choix </label>
        <select
          v-model="tmpGuarantorType"
          class="rf-select rf-mb-3w"
          id="select"
          name="select"
          @change="onSelectChange()"
        >
          <option value="NATURAL_PERSON">Un garant physique classique</option>
          <option value="ORGANISM">
            Un organisme se porte garant pour moi (VISALE par exemple)
          </option>
          <option value="LEGAL_PERSON">Un garant moral</option>
        </select>
        <div>
          <DfButton
            class="rf-btn"
            primary="true"
            @on-click="setGuarantorType()"
          >
            {{ $t("validate") }}
          </DfButton>
        </div>
      </div>
      <div v-if="guarantorStep === 2">
        <div v-if="guarantorType === 'NATURAL_PERSON'">
          <div>
            <div class="rf-grid-row">
              <div
                class="rf-grid-row rf-mr-3w rf-mb-3w btn-group"
                :class="{ guarantorselected: guarantor === g }"
                v-for="(g, k) in user.guarantors"
                :key="k"
              >
                <DfButton @on-click="selectGuarantor(k)">
                  <span>
                    {{ getName(g, k) }}
                  </span>
                </DfButton>
                <DfButton size="icon" @on-click="remove(k)">
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
            <GuarantorIdentification
              v-if="guarantorSubStep === 1"
            ></GuarantorIdentification>
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
            <GuarantorResidency
              v-if="guarantorSubStep === 2"
            ></GuarantorResidency>
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
            <GuarantorProfessional
              v-if="guarantorSubStep === 3"
            ></GuarantorProfessional>
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
            <GuarantorFinancial
              v-if="guarantorSubStep === 4"
            ></GuarantorFinancial>
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
            <GuarantorTax v-if="guarantorSubStep === 5"></GuarantorTax>
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
        <div class="rf-col-12 rf-mb-5w">
          <div class="rf-grid-row rf-mb-3w buttons">
            <button
              v-if="guarantorType === 'NATURAL_PERSON'"
              class="rf-btn rf-btn--secondary rf-mb-2w rf-mt-2w"
              type="submit"
              @click="addNaturalGuarantor()"
            >
              J'ajoute un nouveau garant
            </button>
            <button
              class="rf-btn"
              type="submit"
              aria-disabled="!documentsFilled()"
              :disabled="!documentsFilled()"
              @click="nextStep()"
            >
              Étape suivante - Valider le dossier
            </button>
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
import AskGuarantor from "@/components/AskGuarantor.vue";
import { mapGetters, mapState } from "vuex";
import { Guarantor } from "df-shared/src/models/Guarantor";
import { User } from "df-shared/src/models/User";
import DfButton from "df-shared/src/Button/Button.vue";
import ConfirmModal from "df-shared/src/components/ConfirmModal.vue";

@Component({
  components: {
    AskGuarantor,
    DfButton,
    GuarantorTax,
    GuarantorFinancial,
    GuarantorProfessional,
    GuarantorResidency,
    GuarantorIdentification,
    RepresentativeIdentification,
    CorporationIdentification,
    OrganismCert,
    ConfirmModal
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

  addNaturalGuarantor() {
    this.$store.dispatch("addNaturalGuarantor");
  }

  getName(g: Guarantor, k: number) {
    if (g.lastName) {
      return `${g.lastName} ${g.firstName}`;
    }
    return this.$i18n.t("guarantor") + " " + k;
  }

  selectGuarantor(k: number) {
    this.$store.commit("selectGuarantor", k);
  }

  remove(k: number) {
    this.$store.dispatch("deleteGuarantor", k).then(null, () => {
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
    if (this.tmpGuarantorType != this.guarantorType) {
      this.$store.dispatch("setGuarantorType", this.tmpGuarantorType);
    } else {
      this.$store.commit("setGuarantorStep", 2);
    }
  }

  onSelectChange() {
    if (this.guarantorType !== null) {
      if (
        this.guarantorType !== this.tmpGuarantorType &&
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
"will-delete-guarantor": "Are you sure you want to change the type of guarantor?"
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
"will-delete-guarantor": "Êtes-vous sûr de vouloir changer le type de garant ?"
}
}
</i18n>
