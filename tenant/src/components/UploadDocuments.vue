<template>
  <div>
    <div>
      <div
        class="document-title"
        :class="{ selected: substep === 1 }"
        @click="updateSubstep(1)"
      >
        <i
          class="icon color--primary rf-p-1w"
          :class="substep === 1 ? 'icon-Arrow-Up' : 'icon-Arrow-Down'"
        ></i>
        <i
          class="icon color--primary rf-p-1w icon-User"
          :class="substep === 1 ? 'icon-Arrow-Up' : 'icon-Arrow-Down'"
        ></i>
        <h2>{{ $t("identification") }}</h2>
      </div>
      <Identification v-if="substep === 1"></Identification>
    </div>
    <div>
      <div
        class="document-title"
        :class="{ selected: substep === 2 }"
        @click="updateSubstep(2)"
      >
        <i
          class="icon color--primary rf-p-1w"
          :class="substep === 2 ? 'icon-Arrow-Up' : 'icon-Arrow-Down'"
        ></i>
        <i
          class="icon color--primary rf-p-1w icon-Home-2"
          :class="substep === 1 ? 'icon-Arrow-Up' : 'icon-Arrow-Down'"
        ></i>
        <h2>{{ $t("residency") }}</h2>
      </div>
      <Residency v-if="substep === 2"></Residency>
    </div>
    <div>
      <div
        class="document-title"
        :class="{ selected: substep === 3 }"
        @click="updateSubstep(3)"
      >
        <i
          class="icon color--primary rf-p-1w"
          :class="substep === 3 ? 'icon-Arrow-Up' : 'icon-Arrow-Down'"
        ></i>
        <i
          class="icon color--primary rf-p-1w icon-Suitcase"
          :class="substep === 1 ? 'icon-Arrow-Up' : 'icon-Arrow-Down'"
        ></i>
        <h2>{{ $t("professional") }}</h2>
      </div>
      <Professional v-if="substep === 3"></Professional>
    </div>
    <div>
      <div
        class="document-title"
        :class="{ selected: substep === 4 }"
        @click="updateSubstep(4)"
      >
        <i
          class="icon color--primary rf-p-1w"
          :class="substep === 4 ? 'icon-Arrow-Up' : 'icon-Arrow-Down'"
        ></i>
        <i
          class="icon color--primary rf-p-1w icon-Euro-Sign2"
          :class="substep === 1 ? 'icon-Arrow-Up' : 'icon-Arrow-Down'"
        ></i>
        <h2>{{ $t("financial") }}</h2>
      </div>
      <Financial v-if="substep === 4"></Financial>
    </div>
    <div>
      <div
        class="document-title"
        :class="{ selected: substep === 5 }"
        @click="updateSubstep(5)"
      >
        <i
          class="icon color--primary rf-p-1w"
          :class="substep === 5 ? 'icon-Arrow-Up' : 'icon-Arrow-Down'"
        ></i>
        <i
          class="icon color--primary rf-p-1w icon-Files"
          :class="substep === 1 ? 'icon-Arrow-Up' : 'icon-Arrow-Down'"
        ></i>
        <h2>{{ $t("tax") }}</h2>
      </div>
      <Tax v-if="substep === 5"></Tax>
    </div>
    <div class="rf-col-12 rf-mb-5w">
      <button
        class="rf-btn"
        type="submit"
        aria-disabled="documentsFilled()"
        :disabled="documentsFilled()"
        @click="goToGuarantor()"
      >
        Suivant
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Identification from "@/components/documents/Identification.vue";
import Residency from "@/components/documents/Residency.vue";
import Professional from "@/components/documents/Professional.vue";
import Financial from "@/components/documents/Financial.vue";
import Tax from "@/components/documents/Tax.vue";
@Component({
  components: { Tax, Financial, Professional, Residency, Identification }
})
export default class UploadDocuments extends Vue {
  substep = 0;

  updateSubstep(s: number) {
    this.substep = s === this.substep ? 0 : s;
  }

  documentsFilled() {
    // TODO
    return false;
  }

  goToGuarantor() {
    this.$store.commit("setStep", 3);
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
"tax": "Avis d’imposition"
},
"fr": {
"identification": "Pièce d’identité",
"residency": "Justificatif de domicile",
"professional": "Justificatif de situation professionelle et financière",
"financial": "Justificatif de revenu",
"tax": "Avis d’imposition"
}
}
</i18n>
