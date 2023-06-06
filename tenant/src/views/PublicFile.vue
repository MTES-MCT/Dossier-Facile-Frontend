<template>
  <div class="root">
    <div class="fr-container" v-if="!fileNotFound">
      <section class="background fr-pb-5w fr-mb-5w">
        <div class="fr-container">
          <div class="fr-col-md-8">
            <div class="fr-grid-col">
              <h1 class="fr-h1 color--white fr-mt-3w" v-if="user">
                {{ $t("publicfile.title", [getName()]) }}
              </h1>
              <p class="text-bold color--white">
                {{
                  $t("publicfile.description", [getStatus(), getIncomeSum()])
                }}
              </p>
            </div>
          </div>
        </div>
      </section>

      <FileReinsurance
        :dossierStatus="user.status"
        :taxDocumentStatus="taxDocumentStatus()"
        :franceConnectTenantCount="franceConnectTenantCount()"
        :tenantCount="user.tenants.length"
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
                :aria-selected="tabIndex === k"
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
            :class="{ 'fr-tabs__panel--selected': tabIndex === k }"
            role="tabpanel"
            tabindex="0"
          >
            <div>
              <h2 class="fr-h4">
                {{ $t("publicfile.personnal-file") }}
              </h2>
              <ul class="without-padding">
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
                  :tagLabel="
                    isTenantTaxChecked(tenant)
                      ? $t('publicfile.tax-verified').toString()
                      : undefined
                  "
                  :enableDownload="false"
                >
                  <template v-slot:postTag>
                    <div v-if="isTaxChecked()">
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
                <h2 class="fr-h4">
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
                        :tagLabel="
                          isTenantTaxChecked(g)
                            ? $t('publicfile.tax-verified')
                            : $t('tax')
                        "
                        :enableDownload="false"
                      >
                        <template v-slot:postTag>
                          <div v-if="isTaxChecked()">
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
      <section class="fr-mb-7w">
        <div class="fr-mt-3w fr-text-mention--grey">
          Le service fourni par DossierFacile ne saurait être assimilé à une
          garantie apportée par DossierFacile sur les dossiers ayant fait
          l’objet d’une labellisation. DossierFacile ne saurait être tenu
          responsable ni être engagé directement ou indirectement dans le cadre
          d'un litige entre un locataire et son bailleur ou tout autre
          intermédiaire.
        </div>
      </section>
      <section class="fr-mb-7w">
        <OwnerBanner></OwnerBanner>
      </section>
    </div>
    <div v-if="fileNotFound" class="not-found-container fr-mt-5w">
      <div>
        <NakedCard class="fr-p-5w">
          {{ $t("file.not-found") }}
        </NakedCard>
      </div>
    </div>
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
import OwnerBanner from "../components/OwnerBanner.vue";
import NakedCard from "df-shared/src/components/NakedCard.vue";

@Component({
  components: {
    FileReinsurance,
    FileRowListItem,
    OwnerBanner,
    NakedCard,
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
    return this.user?.tenants?.filter((t) => t.allowCheckTax == true).length;
  }

  getName() {
    if (this.user?.tenants === undefined) {
      return "";
    }
    if (this.user?.tenants.length === 2) {
      const userNames = this.user.tenants
        .map((o) => this.$options.filters?.fullName(o))
        .join(this.$i18n.t("file.and").toString());
      return userNames;
    }
    const userNames = this.user.tenants
      .map((o) => this.$options.filters?.fullName(o))
      .join(", ");
    return userNames;
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

  getStatus() {
    if (this.user?.applicationType) {
      return this.$i18n.t(this.user.applicationType);
    }
    return "";
  }

  getIncomeSum() {
    if (this.user?.tenants) {
      let sum = 0;
      for (const t of this.user.tenants) {
        const localsum = t.documents
          ?.filter((d: DfDocument) => {
            return d.documentCategory === "FINANCIAL";
          })
          .reduce((sum, current) => sum + (current.monthlySum || 0), 0);
        sum += localsum || 0;
      }
      if (sum === 0) {
        return this.$i18n.t("publicfile.no-income");
      }
      return this.$i18n.t("publicfile.income", [sum]);
    }
    return;
  }
  getDocs(tenant: User, docType: string) {
    return tenant.documents?.filter((d: DfDocument) => {
      return d.documentCategory === docType;
    });
  }
  isTenantTaxChecked(tenant: User) {
    return tenant.allowCheckTax;
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
</style>
