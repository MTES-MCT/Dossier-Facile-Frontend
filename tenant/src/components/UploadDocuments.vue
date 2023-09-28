<template>
  <div class="fr-mb-15w">
    <div v-if="substep <= 1">
      <Identification></Identification>
      <ProfileFooter @on-back="goBack" @on-next="goNext"></ProfileFooter>
    </div>
    <div v-if="substep === 2">
      <Residency
        @on-back="goBack"
        @on-next="checkResidencyAndGoNext"
      ></Residency>
    </div>
    <div v-if="substep === 3">
      <Professional></Professional>
      <ProfileFooter @on-back="goBack" @on-next="goNext"></ProfileFooter>
    </div>
    <div v-if="substep === 4">
      <Financial @on-back="goBack" @on-next="goNext"></Financial>
    </div>
    <div v-if="substep === 5">
      <Tax @on-back="goBack" @on-next="goNext"></Tax>
    </div>
    <ConfirmModal
      v-if="showNbDocumentsResidencyTenant"
      :validate-btn-text="$tc('uploaddocuments.accept-warning')"
      :cancel-btn-text="$tc('uploaddocuments.ignore-warning')"
      @cancel="cancelAndgoNext()"
      @close="showNbDocumentsResidencyTenant = false"
      @valid="showNbDocumentsResidencyTenant = false"
    >
      <p
        v-html="$t('uploaddocuments.warning-need-residency-documents-tenant')"
      ></p>
    </ConfirmModal>
    <ConfirmModal
      v-if="showNbDocumentsResidency"
      :validate-btn-text="$tc('uploaddocuments.accept-warning')"
      :cancel-btn-text="$tc('uploaddocuments.ignore-warning')"
      @cancel="cancelAndgoNext()"
      @close="showNbDocumentsResidency = false"
      @valid="showNbDocumentsResidency = false"
    >
      <p v-html="$t('uploaddocuments.warning-need-residency-documents')"></p>
    </ConfirmModal>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import Identification from "./documents/tenant/Identification.vue";
import Residency from "./documents/tenant/Residency.vue";
import Professional from "./documents/tenant/Professional.vue";
import Financial from "./documents/tenant/Financial.vue";
import Tax from "./documents/tenant/Tax.vue";
import { mapState } from "vuex";
import { User } from "df-shared/src/models/User";
import { AnalyticsService } from "../services/AnalyticsService";
import ProfileFooter from "./footer/ProfileFooter.vue";
import { DocumentService } from "@/services/DocumentService";
import ConfirmModal from "df-shared/src/components/ConfirmModal.vue";

@Component({
  components: {
    Tax,
    Financial,
    Professional,
    Residency,
    Identification,
    ProfileFooter,
    ConfirmModal,
  },
  computed: {
    ...mapState({
      user: "user",
    }),
  },
})
export default class UploadDocuments extends Vue {
  @Prop({ default: 0 }) substep!: number;
  user!: User;
  showNbDocumentsResidency = false;
  showNbDocumentsResidencyTenant = false;

  updateSubstep(s: number) {
    this.$router.push({
      name: "TenantDocuments",
      params: { substep: this.substep === s ? "0" : s.toString() },
    });
  }

  goToGuarantor() {
    AnalyticsService.validateFunnel();
    if (this.user.guarantors.length > 0) {
      this.$router.push({
        name: "GuarantorList",
      });
      return;
    }
    this.$router.push({
      name: "GuarantorChoice",
    });
  }

  goBack() {
    if (this.substep > 1) {
      this.$router.push({
        name: "TenantDocuments",
        params: { substep: (this.substep - 1).toString() },
      });
    } else {
      this.$router.push({
        name: "TenantType",
      });
    }
  }

  checkResidencyAndGoNext() {
    const docs = DocumentService.getDocs("RESIDENCY", this.user);
    if (docs.length === 1) {
      const d = docs[0];
      if (d.subCategory === "TENANT") {
        const nbPages = d.files?.reduce(
          (s, a) => s + (a.numberOfPages || 0),
          0
        );
        if ((nbPages || 0) < 3) {
          this.showNbDocumentsResidencyTenant = true;
          AnalyticsService.missingResidencyDocumentDetected();
          return;
        }
      } else if (
        d.subCategory === "GUEST_PARENTS" ||
        d.subCategory === "GUEST"
      ) {
        const nbPages = d.files?.reduce(
          (s, a) => s + (a.numberOfPages || 0),
          0
        );
        if ((nbPages || 0) < 3) {
          this.showNbDocumentsResidency = true;
          AnalyticsService.missingResidencyDocumentDetected();
          return;
        }
      }
    }
    this.goNext();
  }

  cancelAndgoNext() {
    AnalyticsService.forceMissingResidencyDocument();
    this.goNext();
  }

  goNext() {
    if (this.substep < 5) {
      this.updateSubstep(this.substep + 1);
    } else {
      this.goToGuarantor();
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
