<template>
  <div class="root">
    <div class="fr-container" v-if="!fileNotFound">
      <FileHeader :user="user"></FileHeader>

      <FileReinsurance
        :dossierStatus="user?.status || 'TO_PROCESS'"
        :taxDocumentStatus="taxDocumentStatus()"
        :franceConnectTenantCount="franceConnectTenantCount()"
        :tenantCount="user?.tenants?.length || 0"
        :taxChecked="isTaxChecked()"
      ></FileReinsurance>

      <section class="fr-mt-5w fr-mb-3w">
        <div class="fr-tabs">
          <ul class="fr-tabs__list" role="tablist" aria-label="tab-list">
            <li
              v-for="(tenant, k) in getTenants()"
              v-bind:key="`li${k}`"
              role="presentation"
            >
              <button
                class="fr-tabs__tab fr-tabs__tab--icon-right"
                :class="{ 'fr-fi-icon-fc-right': tenant.franceConnect }"
                :id="`tabpanel-${k}`"
                :tabindex="tabIndex === k ? 0 : -1"
                role="tab"
                aria-selected="false"
                :aria-controls="`tabpanel-${k}-panel`"
                @click="tabIndex = k"
              >
                {{ tenant | fullName }}
              </button>
            </li>
          </ul>
          <div
            v-for="(tenant, k) in getTenants()"
            v-bind:key="`t${k}`"
            :id="`tabpanel-${k}-panel`"
            class="fr-tabs__panel"
            aria-selected="false"
            role="tabpanel"
            tabindex="k"
          >
            <div>
              <h2 class="fr-h4">
                {{ $t("publicfile.personnal-file") }}
              </h2>
              <ul class="without-padding">
                <RowListItem
                  v-if="tenant.clarification !== undefined"
                  :label="$tc('tenantpanel.clarification-title')"
                  :subLabel="tenant.clarification"
                />
                <FileRowListItem
                  :label="$t('publicfile.identification')"
                  :document="document(tenant, 'IDENTIFICATION')"
                  :enableDownload="false"
                />
                <FileRowListItem
                  :label="$t('publicfile.residency')"
                  :document="document(tenant, 'RESIDENCY')"
                  :enableDownload="false"
                />
                <FileRowListItem
                  :label="$t('publicfile.professional')"
                  :document="document(tenant, 'PROFESSIONAL')"
                  :enableDownload="false"
                />
                <FileRowListItem
                  v-for="(doc, k) in getDocs(tenant, 'FINANCIAL')"
                  v-bind:key="doc.id"
                  :label="
                    $t('publicfile.financial') + (k >= 1 ? ' ' + (k + 1) : '')
                  "
                  :document="doc"
                  :enableDownload="false"
                />
                <FileRowListItem
                  :label="$t('publicfile.tax')"
                  :document="document(tenant, 'TAX')"
                  :tagLabel="getTaxDocumentBadgeLabel(tenant)"
                  :enableDownload="false"
                >
                  <template v-slot:postTag>
                    <div v-if="isTaxAuthentic(tenant)">
                      <img
                        src="../assets/images/icons/dgfip-icon.png"
                        alt="Logo DGFIP"
                        class="icon-dgfip"
                      />
                    </div>
                  </template>
                </FileRowListItem>
              </ul>
              <div v-if="hasGuarantor(tenant)">
                <h2 class="fr-h4 fr-mt-5w">
                  {{ $t("publicfile.guarant") }}
                </h2>
                <div v-if="tenant.guarantors">
                  <div v-for="g in tenant.guarantors" v-bind:key="g.id">
                    <ul
                      v-if="g.typeGuarantor === 'NATURAL_PERSON'"
                      class="without-padding"
                    >
                      <div>
                        <b>{{ g | fullName }}</b>
                      </div>
                      <FileRowListItem
                        :label="$t('publicfile.identification')"
                        :document="document(g, 'IDENTIFICATION')"
                        :enableDownload="false"
                      />
                      <FileRowListItem
                        :label="$t('publicfile.residency')"
                        :document="document(g, 'RESIDENCY')"
                        :enableDownload="false"
                      />
                      <FileRowListItem
                        :label="$t('publicfile.professional')"
                        :document="document(g, 'PROFESSIONAL')"
                        :enableDownload="false"
                      />
                      <FileRowListItem
                        v-for="(doc, k) in getDocs(g, 'FINANCIAL')"
                        v-bind:key="doc.id"
                        :label="
                          $t('publicfile.financial') +
                          (k >= 1 ? ' ' + (k + 1) : '')
                        "
                        :document="doc"
                        :enableDownload="false"
                      />
                      <FileRowListItem
                        :label="$t('publicfile.tax')"
                        :document="document(g, 'TAX')"
                        :tagLabel="getTaxDocumentBadgeLabel(g)"
                        :enableDownload="false"
                      >
                        <template v-slot:postTag>
                          <div v-if="isTaxAuthentic(g)">
                            <img
                              src="../assets/images/icons/dgfip-icon.png"
                              alt="Logo DGFIP"
                              class="icon-dgfip"
                            />
                          </div>
                        </template>
                      </FileRowListItem>
                    </ul>
                    <ul
                      v-if="g.typeGuarantor === 'LEGAL_PERSON'"
                      class="without-padding"
                    >
                      <FileRowListItem
                        :label="$t('publicfile.identification-legal-person')"
                        :document="document(g, 'IDENTIFICATION_LEGAL_PERSON')"
                        :enableDownload="false"
                      />
                      <FileRowListItem
                        :label="$t('publicfile.identification')"
                        :document="document(g, 'IDENTIFICATION')"
                        :enableDownload="false"
                      />
                    </ul>
                    <ul
                      v-if="g.typeGuarantor === 'ORGANISM'"
                      class="without-padding"
                    >
                      <FileRowListItem
                        :label="$t('publicfile.organism')"
                        :document="document(g, 'IDENTIFICATION')"
                        :enableDownload="false"
                      />
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
    <div v-if="fileNotFound" class="not-found-container fr-mt-5w">
      <FileNotFound></FileNotFound>
    </div>
    <section class="fr-container fr-mb-7w">
      <div class="fr-mt-3w fr-text--sm fr-label--disabled">
        {{ $t("file.disclaimer") }}
      </div>
      <OwnerBanner></OwnerBanner>
    </section>
  </div>
</template>

<script lang="ts">
import { Guarantor } from "df-shared/src/models/Guarantor";
import { User } from "df-shared/src/models/User";
import { FileUser } from "df-shared/src/models/FileUser";
import { Vue, Component } from "vue-property-decorator";
import { ProfileService } from "../services/ProfileService";
import { DfDocument } from "df-shared/src/models/DfDocument";
import FileReinsurance from "../components/FileReinsurance.vue";
import FileRowListItem from "../components/documents/FileRowListItem.vue";
import FileHeader from "../components/FileHeader.vue";
import OwnerBanner from "../components/OwnerBanner.vue";
import NakedCard from "df-shared/src/components/NakedCard.vue";
import RowListItem from "@/components/documents/RowListItem.vue";
import FileNotFound from "@/views/FileNotFound.vue";

@Component({
  components: {
    FileNotFound,
    RowListItem,
    FileReinsurance,
    FileRowListItem,
    OwnerBanner,
    NakedCard,
    FileHeader,
  },
})
export default class File extends Vue {
  user: FileUser | null = null;
  tabIndex = 0;
  fileNotFound = false;

  franceConnectTenantCount() {
    return this.user?.tenants?.filter((t) => t.franceConnect == true).length;
  }

  isTaxChecked() {
    const hasAuthenticTax = (user: User) =>
      user.documents?.some(
        (document: DfDocument) =>
          document.documentCategory === "TAX" &&
          document.authenticityStatus === "AUTHENTIC"
      );
    return this.user?.tenants?.some((t) => hasAuthenticTax(t));
  }

  mounted() {
    const token = this.$route.params.token;
    ProfileService.getPublicUserByToken(token)
      .then((d: any) => {
        this.user = d.data;
        if (this.user) {
          this.user.tenants = this.user?.tenants?.sort((t1, t2) => {
            return t1.tenantType === "CREATE" && t2.tenantType !== "CREATE"
              ? -1
              : 1;
          });
        }
      })
      .catch(() => {
        this.fileNotFound = true;
      });
    window.Beacon("init", "e9f4da7d-11be-4b40-9514-ac7ce3e68f67");
  }
  beforeDestroy() {
    window.Beacon("destroy");
  }

  getTenants() {
    const users: User[] = [];
    this.user?.tenants?.forEach((t) => {
      if (
        t.firstName &&
        t.lastName &&
        t.firstName !== "" &&
        t.lastName !== ""
      ) {
        users.push(t);
      }
    });

    return users;
  }
  taxDocumentStatus() {
    const taxStatuses = this.user?.tenants?.map(
      (tenant) => this.document(tenant, "TAX")?.documentStatus
    );

    if (taxStatuses?.every((docStatus) => docStatus === "VALIDATED")) {
      return "ok";
    } else if (
      taxStatuses?.every(
        (docStatus) => docStatus === "VALIDATED" || docStatus === "TO_PROCESS"
      )
    ) {
      return "to_process";
    }
    return "nok";
  }

  document(u: User | Guarantor, s: string) {
    return u.documents?.find((d) => {
      return d.documentCategory === s;
    });
  }

  hasGuarantor(tenant: User) {
    return tenant.guarantors && tenant.guarantors.length > 0;
  }

  getDocs(tenant: User, docType: string) {
    return tenant.documents?.filter((d: DfDocument) => {
      return d.documentCategory === docType;
    });
  }

  isTaxAuthentic(user: User | Guarantor) {
    const document = this.document(user, "TAX") as DfDocument;
    return document.authenticityStatus === "AUTHENTIC";
  }

  getTaxDocumentBadgeLabel(user: User | Guarantor): string {
    const document = this.document(user, "TAX") as DfDocument;
    return this.isTaxAuthentic(user)
      ? this.$tc("file.tax-verified")
      : this.$tc("documents.status." + document.documentStatus);
  }
}
</script>

<style scoped lang="scss">
.background {
  width: 100%;
  top: 0;
  left: 0;
  background-size: cover !important;
  background-position: 50% 50% !important;
  background-image: url("../assets/cover-features.webp");

  @media (max-width: 768px) {
    background-image: url("../assets/cover-features-mobile.webp");
  }

  z-index: 0;
}
.root {
  width: 100%;
  background-color: var(--bf100-g750);
}
.without-padding {
  padding: 0;
}

.fr-tabs {
  background-color: var(--background-default-grey);
}

.fr-fi-icon-fc-right {
  flex-direction: row-reverse;

  &:before {
    content: "";
    background-color: transparent;
    background-image: url("../assets/images/icons/franceconnect-icon.png");
    background-size: contain;
    background-position: center;
    background-repeat: no-repeat;
    height: 21px;
    width: 24px;
    margin-left: 0.5rem;
  }
}

.icon-dgfip {
  height: 46px;
  margin-left: 2rem;
}

.not-found-container {
  width: 100vw;
  display: flex;
  justify-content: center;
}

.fr-badge {
  --text-default-grey: #fff;
  --background-contrast-grey: #1d2437;
}
</style>