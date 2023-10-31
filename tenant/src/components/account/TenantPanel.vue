<template>
  <div>
    <div class="main-information">
      <h3 class="fr-h4">{{ $t("tenantpanel.my-files") + tenant.firstName }}</h3>
      <ul class="fr-p-0">
        <RowListItem
          v-if="!isCotenant"
          :label="$tc('tenantpanel.clarification-title')"
          :subLabel="tenant.clarification"
          @click-edit="goToValidationPage()"
        />
        <RowListItem
          :label="tenant | fullName"
          @click-edit="gotoTenantName()"
        />
        <FileRowListItem
          :label="$tc('tenantpanel.identification')"
          :document="document(tenant, 'IDENTIFICATION')"
          enableDownload="force"
          @click-edit="setTenantStep(1)"
        />
        <FileRowListItem
          :label="$tc('tenantpanel.residency')"
          :document="document(tenant, 'RESIDENCY')"
          @click-edit="setTenantStep(2)"
        />
        <FileRowListItem
          :label="$tc('tenantpanel.professional')"
          :sub-label="getProfessionalSubCategory(tenant)"
          :document="document(tenant, 'PROFESSIONAL')"
          @click-edit="setTenantStep(3)"
        />
        <span v-if="documents(tenant, 'FINANCIAL').length > 1">
          <FileRowListItem
            v-for="doc in documents(tenant, 'FINANCIAL')"
            v-bind:key="doc.id"
            :label="$tc('tenantpanel.financial')"
            :sub-label="$tc(`documents.subcategory.${doc.subCategory}`)"
            :document="doc"
            @click-edit="setTenantStep(4)"
          />
        </span>
        <FileRowListItem
          v-else
          :label="$tc('tenantpanel.financial')"
          :document="document(tenant, 'FINANCIAL')"
          @click-edit="setTenantStep(4)"
        />
        <FileRowListItem
          :label="$tc('tenantpanel.tax')"
          :document="document(tenant, 'TAX')"
          @click-edit="setTenantStep(5)"
        />
      </ul>
    </div>

    <GuarantorsSection :tenant="tenant" />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { ValidationObserver, ValidationProvider } from "vee-validate";
import { User } from "df-shared/src/models/User";
import { DfDocument } from "df-shared/src/models/DfDocument";
import DfButton from "df-shared/src/Button/Button.vue";
import ColoredTag from "df-shared/src/components/ColoredTag.vue";
import { AnalyticsService } from "@/services/AnalyticsService";
import DeleteAccount from "@/components/DeleteAccount.vue";
import GuarantorsSection from "@/components/account/GuarantorsSection.vue";
import PartnersSection from "@/components/account/PartnersSection.vue";
import RowListItem from "@/components/documents/RowListItem.vue";
import FileRowListItem from "@/components/documents/FileRowListItem.vue";
import { DocumentTypeConstants } from "@/components/documents/share/DocumentTypeConstants";

@Component({
  components: {
    PartnersSection,
    GuarantorsSection,
    ValidationProvider,
    ValidationObserver,
    DfButton,
    ColoredTag,
    DeleteAccount,
    RowListItem,
    FileRowListItem,
  },
})
export default class TenantPanel extends Vue {
  @Prop() tenant!: User;
  @Prop({ default: false }) isCotenant!: boolean;

  getStatus(docType: string) {
    if (docType === "FINANCIAL") {
      const docs = this.tenant.documents?.filter((d) => {
        return d.documentCategory === "FINANCIAL";
      });
      return this.isFinancialValid(docs || []);
    }
    const doc = this.tenant.documents?.find((d: DfDocument) => {
      return d.documentCategory === docType;
    });
    return doc?.documentStatus || "EMPTY";
  }

  isFinancialValid(docs: DfDocument[]) {
    if (!docs || docs.length === 0) {
      return "INCOMPLETE";
    }

    for (const doc of docs) {
      if (!doc.noDocument && (doc.files?.length || 0) <= 0) {
        return "INCOMPLETE";
      }
    }

    for (const doc of docs) {
      if (doc.documentStatus === "DECLINED") {
        return "DECLINED";
      }
    }

    for (const doc of docs) {
      if (doc.documentStatus === "TO_PROCESS") {
        return "TO_PROCESS";
      }
    }

    return "VALIDATED";
  }

  gotoTenantName() {
    if (this.isCotenant) {
      this.$router.push({
        name: "CoTenantDocuments",
        params: {
          tenantId: this.tenant?.id.toString(),
          step: "4",
          substep: "0",
        },
      });
    } else {
      this.$router.push({ name: "TenantName" });
    }
  }

  goToValidationPage() {
    this.$router.push({ name: "ValidateFile" });
  }

  setTenantStep(n: number) {
    AnalyticsService.editFromAccount(n);
    if (this.isCotenant) {
      this.$router.push({
        name: "CoTenantDocuments",
        params: {
          tenantId: this.tenant?.id.toString(),
          step: "4",
          substep: n.toString(),
        },
      });
    } else {
      this.$router.push({
        name: "TenantDocuments",
        params: { substep: n.toString() },
      });
    }
  }

  document(u: User, s: string) {
    return u.documents?.find((d) => {
      return d.documentCategory === s;
    });
  }

  documents(g: User, docType: string): DfDocument[] {
    return (
      (g.documents?.filter((d: DfDocument) => {
        return d.documentCategory === docType;
      }) as DfDocument[]) || []
    );
  }

  getProfessionalSubCategory(u: User): string {
    const professionalDocument = this.document(u, "PROFESSIONAL");
    const translationKey = DocumentTypeConstants.PROFESSIONAL_DOCS.find(
      (doc) => doc.value === professionalDocument?.subCategory
    )?.key;
    return this.$tc(translationKey || "");
  }
}
</script>

<style scoped lang="scss">
.main-bar {
  display: flex;
}

.main {
  background-color: var(--background-default-grey);
}

.fr-callout-white {
  background-color: var(--background-default-grey);
  &.warning {
    box-shadow: inset 0.25rem 0 0 0 var(--error) !important;
  }
}

h1 {
  color: var(--bf500);
  font-size: 2rem;
}

h2 {
  color: var(--bf500);
  font-size: 2rem;
}

.align--center {
  text-align: center;
  margin: auto;
}

.bg-white {
  box-shadow: 0 2px 6px 0 rgba(0, 0, 18, 0.16);
  background: var(--grey-1000-50);
}

.fr-btn.delete-btn {
  background-color: var(--error);
  --color-hover: rgba(246, 0, 0, 0.5);
  --color-active: rgba(255, 91, 91, 0.5);
}

.grp {
  display: block;
  position: relative;
}

.grp-btn {
  border-left: 1px solid var(--background-default-grey);
  position: relative;
}

.grp-modal {
  position: absolute;
  border-radius: 5px;
  right: 0;
  left: auto;
  width: max-content;
  z-index: 2;
  padding: 1rem;
  width: 330px;

  @media all and (max-width: 768px) {
    max-width: 300px;
  }

  &:before {
    top: -16px;
    right: 9px;
    left: auto;
    border: 8px solid transparent;
    border-bottom: 8px solid var(--color-border-overlay);
    position: absolute;
    display: inline-block;
    content: "";
  }
}

.copy-btn {
  max-width: 100%;
  > button {
    width: 100%;
    text-align: justify;
    border-radius: 0.25rem;
    padding: 1rem;
    font-size: 1rem;
    box-shadow: 0 0.5px 4px 0 #cecece;
    border: 1px solid transparent;

    -webkit-transition: all 0.5s linear;
    -moz-transition: all 0.5s linear;
    -o-transition: all 0.5s linear;
    transition: all 0.5s linear;

    &:hover {
      box-shadow: none;
      border: 1px solid var(--primary);
      box-shadow: 0 0.5px 4px 0 transparent;
      background-image: none;
    }

    &.copied {
      color: var(--primary);
      background-color: var(--background-action-low-blue-france);
      border: 1px solid var(--primary);
      box-shadow: 0 0.5px 4px 0 transparent;
      -webkit-transition: all 0.5s linear;
      -moz-transition: all 0.5s linear;
      -o-transition: all 0.5s linear;
      transition: all 0.5s linear;
    }
  }
}

p {
  word-break: break-word;
}

.edit-btn {
  position: absolute;
  right: 0;
  top: 0;

  box-shadow: none;
}

.description:first-letter {
  text-transform: uppercase;
}

.header-title {
  display: flex;
  justify-content: center;
  align-items: center;
}

hr {
  border: 0;
  margin-left: 20%;
  margin-right: 20%;
  border-top: 1px solid var(--g400);
}

.fr-tile__body {
  overflow: auto;
}

.cleana {
  &:after {
    content: none;
  }
  &:focus {
    outline-style: auto;
    outline-width: 2px;
    outline-offset: 4px;
    outline-color: #0a76f6;
  }
}

.alert-container {
  display: flex;
  flex-direction: row-reverse;
}

.red-alert {
  background-color: var(--error);
  color: white;
  border-radius: 2px;
  margin-right: 0;
  margin-left: auto;
  padding: 0.5rem;
}

.name-email-tile {
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
}

.dflex {
  display: flex;
  align-items: center;
}

.mobile-margin {
  @media all and (max-width: 768px) {
    margin-bottom: 1rem;
  }
}

.btn-container {
  margin-left: auto;

  @media all and (max-width: 600px) {
    width: 100%;
  }
}

.share-file-description {
  max-width: fit-content;
}
</style>
