<template>
  <div>
    <div>
      <div
        class="document-title"
        :class="{ selected: tenantSubStep === 1 }"
        @click="updateSubstep(1)"
      >
        <i
          class="icon color--primary rf-p-1w"
          :class="tenantSubStep === 1 ? 'icon-Arrow-Up' : 'icon-Arrow-Down'"
        ></i>
        <i
          class="icon color--primary rf-p-1w icon-User"
          :class="tenantSubStep === 1 ? 'icon-Arrow-Up' : 'icon-Arrow-Down'"
        ></i>
        <h2>{{ $t("identification") }}</h2>
        <i
          v-if="hasDoc('IDENTIFICATION')"
          class="color--primary icon-Yes check"
        ></i>
      </div>
      <Identification v-if="tenantSubStep === 1"></Identification>
    </div>
    <div>
      <div
        class="document-title"
        :class="{ selected: tenantSubStep === 2 }"
        @click="updateSubstep(2)"
      >
        <i
          class="icon color--primary rf-p-1w"
          :class="tenantSubStep === 2 ? 'icon-Arrow-Up' : 'icon-Arrow-Down'"
        ></i>
        <i
          class="icon color--primary rf-p-1w icon-Home-2"
          :class="tenantSubStep === 1 ? 'icon-Arrow-Up' : 'icon-Arrow-Down'"
        ></i>
        <h2>{{ $t("residency") }}</h2>
        <i v-if="hasDoc('RESIDENCY')" class="color--primary icon-Yes check"></i>
      </div>
      <Residency v-if="tenantSubStep === 2"></Residency>
    </div>
    <div>
      <div
        class="document-title"
        :class="{ selected: tenantSubStep === 3 }"
        @click="updateSubstep(3)"
      >
        <i
          class="icon color--primary rf-p-1w"
          :class="tenantSubStep === 3 ? 'icon-Arrow-Up' : 'icon-Arrow-Down'"
        ></i>
        <i
          class="icon color--primary rf-p-1w icon-Suitcase"
          :class="tenantSubStep === 1 ? 'icon-Arrow-Up' : 'icon-Arrow-Down'"
        ></i>
        <h2>{{ $t("professional") }}</h2>
        <i
          v-if="hasDoc('PROFESSIONAL')"
          class="color--primary icon-Yes check"
        ></i>
      </div>
      <Professional v-if="tenantSubStep === 3"></Professional>
    </div>
    <div>
      <div
        class="document-title"
        :class="{ selected: tenantSubStep === 4 }"
        @click="updateSubstep(4)"
      >
        <i
          class="icon color--primary rf-p-1w"
          :class="tenantSubStep === 4 ? 'icon-Arrow-Up' : 'icon-Arrow-Down'"
        ></i>
        <i
          class="icon color--primary rf-p-1w icon-Euro-Sign2"
          :class="tenantSubStep === 1 ? 'icon-Arrow-Up' : 'icon-Arrow-Down'"
        ></i>
        <h2>{{ $t("financial") }}</h2>
        <i v-if="hasDoc('FINANCIAL')" class="color--primary icon-Yes check"></i>
      </div>
      <Financial v-if="tenantSubStep === 4"></Financial>
    </div>
    <div>
      <div
        class="document-title"
        :class="{ selected: tenantSubStep === 5 }"
        @click="updateSubstep(5)"
      >
        <i
          class="icon color--primary rf-p-1w"
          :class="tenantSubStep === 5 ? 'icon-Arrow-Up' : 'icon-Arrow-Down'"
        ></i>
        <i
          class="icon color--primary rf-p-1w icon-Files"
          :class="tenantSubStep === 1 ? 'icon-Arrow-Up' : 'icon-Arrow-Down'"
        ></i>
        <h2>{{ $t("tax") }}</h2>
        <i v-if="isTaxValid()" class="color--primary icon-Yes check"></i>
      </div>
      <Tax v-if="tenantSubStep === 5"></Tax>
    </div>
    <div class="rf-col-12 rf-mb-5w">
      <button
        class="rf-btn"
        type="submit"
        aria-disabled="!documentsFilled()"
        :disabled="!documentsFilled()"
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
import { mapState } from "vuex";
import { User } from "df-shared/src/models/User";
@Component({
  components: { Tax, Financial, Professional, Residency, Identification },
  computed: {
    ...mapState({
      tenantSubStep: "tenantSubStep",
      user: "user"
    })
  }
})
export default class UploadDocuments extends Vue {
  tenantSubStep!: number;
  user!: User;

  updateSubstep(s: number) {
    this.$store.commit("setTenantSubstep", s === this.tenantSubStep ? 0 : s);
  }

  documentsFilled() {
    return (
      this.hasDoc("IDENTIFICATION") &&
      this.hasDoc("PROFESSIONAL") &&
      this.hasDoc("RESIDENCY") &&
      this.hasDoc("FINANCIAL") &&
      this.isTaxValid()
    );
  }

  goToGuarantor() {
    this.$store.commit("setStep", 3);
  }

  hasDoc(docType: string) {
    const f = this.user.documents?.find(d => {
      return d.documentCategory === docType;
    })?.files;
    return f && f.length > 0;
  }

  isTaxValid() {
    const doc = this.user.documents?.find(d => {
      return d.documentCategory === 'TAX';
    });
    if (!doc) {
      return false;
    }
    if (doc.files) {
      return true;
    }
    if (doc.documentSubCategory !== 'my-name') {
      return true;
    }

    return false;
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
