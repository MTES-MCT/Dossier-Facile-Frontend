<template>
  <div>
    <div>
      <div
        class="document-title title-bar"
        :class="{ selected: tenantSubStep === 1 }"
        @click="updateSubstep(1)"
      >
        <span v-if="tenantSubStep === 1" class="color--primary material-icons"
          >keyboard_arrow_up</span
        >
        <span v-if="tenantSubStep !== 1" class="color--primary material-icons"
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
      <div v-if="tenantSubStep === 1">
        <Identification></Identification>
        <ProfileFooter @on-back="goBack" @on-next="goNext"></ProfileFooter>
      </div>
    </div>
    <div>
      <div
        class="document-title title-bar"
        :class="{ selected: tenantSubStep === 2 }"
        @click="updateSubstep(2)"
      >
        <span v-if="tenantSubStep === 2" class="color--primary material-icons"
          >keyboard_arrow_up</span
        >
        <span v-if="tenantSubStep !== 2" class="color--primary material-icons"
          >keyboard_arrow_down</span
        >
        <span class="color--primary material-icons">home</span>
        <h2>{{ $t("residency") }}</h2>
        <span class="spacer"></span>
        <span v-if="hasDoc('RESIDENCY')" class="color--primary material-icons"
          >check_circle_outline</span
        >
      </div>
      <div v-if="tenantSubStep === 2">
        <Residency></Residency>
        <ProfileFooter @on-back="goBack" @on-next="goNext"></ProfileFooter>
      </div>
    </div>
    <div>
      <div
        class="document-title title-bar"
        :class="{ selected: tenantSubStep === 3 }"
        @click="updateSubstep(3)"
      >
        <span v-if="tenantSubStep === 3" class="color--primary material-icons"
          >keyboard_arrow_up</span
        >
        <span v-if="tenantSubStep !== 3" class="color--primary material-icons"
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
      <div v-if="tenantSubStep === 3">
        <Professional></Professional>
        <ProfileFooter @on-back="goBack" @on-next="goNext"></ProfileFooter>
      </div>
    </div>
    <div>
      <div
        class="document-title title-bar"
        :class="{ selected: tenantSubStep === 4 }"
        @click="updateSubstep(4)"
      >
        <span v-if="tenantSubStep === 4" class="color--primary material-icons"
          >keyboard_arrow_up</span
        >
        <span v-if="tenantSubStep !== 4" class="color--primary material-icons"
          >keyboard_arrow_down</span
        >
        <span class="color--primary material-icons">euro</span>
        <h2>{{ $t("financial") }}</h2>
        <span class="spacer"></span>
        <span v-if="isFinancialValid()" class="color--primary material-icons"
          >check_circle_outline</span
        >
      </div>
      <div v-if="tenantSubStep === 4">
        <Financial></Financial>
        <ProfileFooter @on-back="goBack" @on-next="goNext"></ProfileFooter>
      </div>
    </div>
    <div>
      <div
        class="document-title title-bar"
        :class="{ selected: tenantSubStep === 5 }"
        @click="updateSubstep(5)"
      >
        <span v-if="tenantSubStep === 5" class="color--primary material-icons"
          >keyboard_arrow_up</span
        >
        <span v-if="tenantSubStep !== 5" class="color--primary material-icons"
          >keyboard_arrow_down</span
        >
        <span class="color--primary material-icons">content_copy</span>
        <h2>{{ $t("tax") }}</h2>
        <span class="spacer"></span>
        <span v-if="isTaxValid()" class="color--primary material-icons"
          >check_circle_outline</span
        >
      </div>
      <div v-if="tenantSubStep === 5">
        <Tax></Tax>
        <ProfileFooter @on-back="goBack" @on-next="goNext"></ProfileFooter>
      </div>
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
import { AnalyticsService } from "@/services/AnalyticsService";
import ProfileFooter from "@/components/footer/ProfileFooter.vue";

@Component({
  components: {
    Tax,
    Financial,
    Professional,
    Residency,
    Identification,
    ProfileFooter
  },
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
      this.isFinancialValid() &&
      this.isTaxValid()
    );
  }

  goToGuarantor() {
    AnalyticsService.validateFunnel();
    this.$store.commit("setGuarantorStep", 0);
    this.$store.commit("setStep", 3);
  }

  hasDoc(docType: string) {
    // FIXME check for status TO_PROCESS or VALIDATED
    const f = this.user.documents?.find(d => {
      return d.documentCategory === docType;
    })?.files;
    return f && f.length > 0;
  }

  isFinancialValid() {
    const docs = this.user.documents?.filter(d => {
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
    const doc = this.user.documents?.find(d => {
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

  goBack() {
    this.$store.commit("setStep", 1);
  }

  goNext() {
    if (this.tenantSubStep < 5) {
      this.updateSubstep(this.tenantSubStep + 1);
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

.title-bar {
  display: flex;
  align-items: center;
  span {
    padding: 0.5rem;
    line-height: 1rem;
  }
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
"tax": "Avis d’imposition"
},
"fr": {
"identification": "Pièce d’identité",
"residency": "Justificatif de domicile",
"professional": "Justificatif de situation professionnelle",
"financial": "Justificatif de ressources",
"tax": "Avis d’imposition"
}
}
</i18n>
