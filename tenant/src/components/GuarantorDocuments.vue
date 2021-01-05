<template>
  <div>
    <div v-if="guarantorStep === 0">
      <AskGuarantor @on-next-step="setGuarantorStep(1)"></AskGuarantor>
    </div>
    <div v-if="guarantorStep === 1">
      <div>
        <label class="rf-label" for="select"> Sélectionnez un choix </label>
        <select
          v-model="guarantorType"
          class="rf-select rf-mb-3w"
          id="select"
          name="select"
        >
          <option value="NATURAL_PERSON">Un garant physique classique</option>
          <option value="ORGANISM">
            Un organisme se porte garant pour moi (VISALE par exemple)
          </option>
          <option value="CORPORATION">Un garant moral</option>
        </select>
      </div>
    </div>
    <div v-if="guarantorType === 'NATURAL_PERSON'">
      <div>
        <div
          class="document-title"
          :class="{ selected: guarantorSubStep === 1 }"
          @click="updateSubstep(1)"
        >
          <i
            class="icon color--primary rf-p-1w"
            :class="guarantorSubStep === 1 ? 'icon-Arrow-Up' : 'icon-Arrow-Down'"
          ></i>
          <i
            class="icon color--primary rf-p-1w icon-User"
            :class="guarantorSubStep === 1 ? 'icon-Arrow-Up' : 'icon-Arrow-Down'"
          ></i>
          <h2>{{ $t("identification") }}</h2>
        </div>
        <Identification v-if="guarantorSubStep === 1"></Identification>
      </div>
      <div>
        <div
          class="document-title"
          :class="{ selected: guarantorSubStep === 2 }"
          @click="updateSubstep(2)"
        >
          <i
            class="icon color--primary rf-p-1w"
            :class="guarantorSubStep === 2 ? 'icon-Arrow-Up' : 'icon-Arrow-Down'"
          ></i>
          <i
            class="icon color--primary rf-p-1w icon-Home-2"
            :class="guarantorSubStep === 1 ? 'icon-Arrow-Up' : 'icon-Arrow-Down'"
          ></i>
          <h2>{{ $t("residency") }}</h2>
        </div>
        <Residency v-if="guarantorSubStep === 2"></Residency>
      </div>
      <div>
        <div
          class="document-title"
          :class="{ selected: guarantorSubStep === 3 }"
          @click="updateSubstep(3)"
        >
          <i
            class="icon color--primary rf-p-1w"
            :class="guarantorSubStep === 3 ? 'icon-Arrow-Up' : 'icon-Arrow-Down'"
          ></i>
          <i
            class="icon color--primary rf-p-1w icon-Suitcase"
            :class="guarantorSubStep === 1 ? 'icon-Arrow-Up' : 'icon-Arrow-Down'"
          ></i>
          <h2>{{ $t("professional") }}</h2>
        </div>
        <Professional v-if="guarantorSubStep === 3"></Professional>
      </div>
      <div>
        <div
          class="document-title"
          :class="{ selected: guarantorSubStep === 4 }"
          @click="updateSubstep(4)"
        >
          <i
            class="icon color--primary rf-p-1w"
            :class="guarantorSubStep === 4 ? 'icon-Arrow-Up' : 'icon-Arrow-Down'"
          ></i>
          <i
            class="icon color--primary rf-p-1w icon-Euro-Sign2"
            :class="guarantorSubStep === 1 ? 'icon-Arrow-Up' : 'icon-Arrow-Down'"
          ></i>
          <h2>{{ $t("financial") }}</h2>
        </div>
        <Financial v-if="guarantorSubStep === 4"></Financial>
      </div>
      <div>
        <div
          class="document-title"
          :class="{ selected: guarantorSubStep === 5 }"
          @click="updateSubstep(5)"
        >
          <i
            class="icon color--primary rf-p-1w"
            :class="guarantorSubStep === 5 ? 'icon-Arrow-Up' : 'icon-Arrow-Down'"
          ></i>
          <i
            class="icon color--primary rf-p-1w icon-Files"
            :class="guarantorSubStep === 1 ? 'icon-Arrow-Up' : 'icon-Arrow-Down'"
          ></i>
          <h2>{{ $t("tax") }}</h2>
        </div>
        <Tax v-if="guarantorSubStep === 5"></Tax>
      </div>
    </div>
    <div v-if="guarantorType === 'ORGANISM'">
      <OrganismCert></OrganismCert>
    </div>
    <div v-if="guarantorType === 'CORPORATION'">
      <div>
        <div
          class="document-title"
          :class="{ selected: guarantorSubStep === 1 }"
          @click="updateSubstep(1)"
        >
          <i
            class="icon color--primary rf-p-1w"
            :class="guarantorSubStep === 1 ? 'icon-Arrow-Up' : 'icon-Arrow-Down'"
          ></i>
          <i
            class="icon color--primary rf-p-1w icon-User"
            :class="guarantorSubStep === 1 ? 'icon-Arrow-Up' : 'icon-Arrow-Down'"
          ></i>
          <h2>{{ $t("representative-identification") }}</h2>
        </div>
        <CorporationIdentification
          v-if="guarantorSubStep === 1"
        ></CorporationIdentification>
      </div>
      <div>
        <div
          class="document-title"
          :class="{ selected: guarantorSubStep === 2 }"
          @click="updateSubstep(2)"
        >
          <i
            class="icon color--primary rf-p-1w"
            :class="guarantorSubStep === 2 ? 'icon-Arrow-Up' : 'icon-Arrow-Down'"
          ></i>
          <i
            class="icon color--primary rf-p-1w icon-Home-2"
            :class="guarantorSubStep === 1 ? 'icon-Arrow-Up' : 'icon-Arrow-Down'"
          ></i>
          <h2>{{ $t("corporation-identification") }}</h2>
        </div>
        <RepresentativeIdentification
          v-if="guarantorSubStep === 2"
        ></RepresentativeIdentification>
      </div>
    </div>
    <div class="rf-col-12 rf-mb-5w" v-if="guarantorType">
      <div v-if="guarantorType === 'naturalPerson'">
        J'ajoute un nouveau garant
      </div>
      <button
        class="rf-btn"
        type="submit"
        aria-disabled="documentsFilled()"
        :disabled="documentsFilled()"
      >
        Étape suivante - Valider le dossier
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Identification from "@/components/documents/Identification.vue";
import RepresentativeIdentification from "@/components/documents/RepresentativeIdentification.vue";
import CorporationIdentification from "@/components/documents/CorporationIdentification.vue";
import OrganismCert from "@/components/documents/OrganismCert.vue";
import Residency from "@/components/documents/Residency.vue";
import Professional from "@/components/documents/Professional.vue";
import Financial from "@/components/documents/Financial.vue";
import Tax from "@/components/documents/Tax.vue";
import AskGuarantor from "@/components/AskGuarantor.vue";
import { mapState } from "vuex";
import { Guarantor } from "df-shared/src/models/Guarantor";

@Component({
  components: {
    AskGuarantor,
    Tax,
    Financial,
    Professional,
    Residency,
    Identification,
    RepresentativeIdentification,
    CorporationIdentification,
    OrganismCert
  },
  computed: {
    ...mapState({
      guarantorStep: "guarantorStep",
      selectedGuarantor: "selectedGuarantor",
      guarantorSubStep: "guarantorSubStep"
    })
  }
})
export default class GuarantorDocuments extends Vue {
  selectedGuarantor!: Guarantor;
  guarantorSubStep!: number;
  guarantorType = "";

  mounted() {
    if (this.selectedGuarantor.typeGuarantor) {
      this.guarantorType = this.selectedGuarantor.typeGuarantor;
    }
  }

  updateSubstep(s: number) {
    this.$store.commit("setGuarantorSubstep", s === this.guarantorSubStep ? 0 : s);
  }

  documentsFilled() {
    // TODO
    return false;
  }

  setGuarantorStep(n: number) {
    this.$store.commit("setGuarantorStep", n);
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
</style>

<i18n>
{
"en": {
"identification": "Pièce d’identité",
"residency": "Justificatif de domicile",
"professional": "Justificatif de situation professionelle et financière",
"financial": "Justificatif de revenu",
"tax": "Avis d’imposition",
"representative-identification": "Identité de la personne morale",
"corporation-identification": "Identité du représentant de la personne morale"
},
"fr": {
"identification": "Pièce d’identité",
"residency": "Justificatif de domicile",
"professional": "Justificatif de situation professionelle et financière",
"financial": "Justificatif de revenu",
"tax": "Avis d’imposition",
"representative-identification": "Identité de la personne morale",
"corporation-identification": "Identité du représentant de la personne morale"
}
}
</i18n>
