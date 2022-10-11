<template>
  <div class="root">
    <div class="fr-container">
      <section class="background fr-pb-5w fr-mb-5w">
        <div class="fr-container">
          <div class="fr-col-md-8">
            <div class="fr-grid-col">
              <h1 class="fr-h1 color--white fr-mt-3w" v-if="user">
                {{ $t("title", [getName()]) }}
              </h1>
              <p class="text-bold color--white">
                {{ $t("description", [getStatus(), getIncomeSum()]) }}
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
              <h2
                class="fr-h4"
                v-if="tenant.typeGuarantor === 'NATURAL_PERSON'"
              >
                {{ $t("guarant") }}
              </h2>
              <h2
                class="fr-h4"
                v-if="tenant.typeGuarantor !== 'NATURAL_PERSON'"
              >
                {{ $t("personnal-file") }}
              </h2>
              <ul class="without-padding">
                <FileRowListItem
                  :label="$t('identification')"
                  :document="document(tenant, 'IDENTIFICATION')"
                  :enableDownload="false"
                />
                <FileRowListItem
                  :label="$t('residency')"
                  :document="document(tenant, 'RESIDENCY')"
                  :enableDownload="false"
                />
                <FileRowListItem
                  :label="$t('professional')"
                  :document="document(tenant, 'PROFESSIONAL')"
                  :enableDownload="false"
                />
                <FileRowListItem
                  v-for="(doc, k) in getDocs(tenant, 'FINANCIAL')"
                  v-bind:key="doc.id"
                  :label="$t('financial') + (k >= 1 ? ' ' + (k + 1) : '')"
                  :document="doc"
                  :enableDownload="false"
                />
                <FileRowListItem
                  :label="$t('tax')"
                  :document="document(tenant, 'TAX')"
                  :tagLabel="
                    isTenantTaxChecked(tenant) ? $t('tax-verified') : $t('tax')
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
                  {{ $t("guarant") }}
                </h2>
                <div v-if="tenant.guarantors">
                  <div v-for="g in tenant.guarantors" v-bind:key="g.id">
                    <ul
                      v-if="g.typeGuarantor === 'LEGAL_PERSON'"
                      class="without-padding"
                    >
                      <FileRowListItem
                        :label="$t('identification-legal-person')"
                        :document="document(g, 'IDENTIFICATION_LEGAL_PERSON')"
                        :enableDownload="false"
                      />
                      <FileRowListItem
                        :label="$t('identificationn')"
                        :document="document(g, 'IDENTIFICATION')"
                        :enableDownload="false"
                      />
                    </ul>
                    <ul
                      v-if="g.typeGuarantor === 'ORGANISM'"
                      class="without-padding"
                    >
                      <FileRowListItem
                        :label="$t('organism')"
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

@Component({
  components: {
    FileReinsurance,
    FileRowListItem
  }
})
export default class File extends Vue {
  user: FileUser | null = null;
  tabIndex = 0;

  franceConnectTenantCount() {
    return this.user?.tenants?.filter(t => t.franceConnect == true).length;
  }

  isTaxChecked() {
    return this.user?.tenants?.filter(t => t.allowCheckTax == true).length;
  }

  getName() {
    if (this.user?.tenants !== undefined) {
      if (this.user?.tenants.length === 2) {
        const userNames = this.user.tenants
          .map(o => `${o.firstName} ${o.lastName}`)
          .join(this.$i18n.t("and").toString());
        return userNames;
      }
      const userNames = this.user.tenants
        .map(o => `${o.firstName} ${o.lastName}`)
        .join(", ");
      return userNames;
    }
    return "";
  }

  mounted() {
    const token = this.$route.params.token;
    ProfileService.getPublicUserByToken(token).then((d: any) => {
      this.user = d.data;
      if (this.user) {
        this.user.tenants = this.user?.tenants?.sort((t1, t2) => {
          return t1.tenantType === "CREATE" && t2.tenantType !== "CREATE"
            ? -1
            : 1;
        });
      }
    });
    window.Beacon("init", "e9f4da7d-11be-4b40-9514-ac7ce3e68f67");
  }
  beforeDestroy() {
    window.Beacon("destroy");
  }

  getTenants() {
    const users: (User | Guarantor)[] = [];
    this.user?.tenants?.forEach(t => {
      if (
        t.firstName &&
        t.lastName &&
        t.firstName !== "" &&
        t.lastName !== ""
      ) {
        users.push(t);
        if (t.guarantors && t.guarantors.length > 0) {
          t.guarantors.forEach(g => {
            if (g.typeGuarantor === "NATURAL_PERSON") {
              users.push(g);
            }
          });
        }
      }
    });

    return users;
  }
  taxDocumentStatus() {
    const taxStatuses = this.user?.tenants?.map(
      tenant => this.document(tenant, "TAX")?.documentStatus
    );

    if (taxStatuses?.every(docStatus => docStatus === "VALIDATED")) {
      return "ok";
    } else if (
      taxStatuses?.every(
        docStatus => docStatus === "VALIDATED" || docStatus === "TO_PROCESS"
      )
    ) {
      return "to_process";
    }
    return "nok";
  }

  document(u: User | Guarantor, s: string) {
    return u.documents?.find(d => {
      return d.documentCategory === s;
    });
  }

  hasGuarantor(tenant: User) {
    if (!tenant.guarantors || tenant.guarantors.length <= 0) {
      return false;
    }
    for (const g of tenant.guarantors) {
      if (g.typeGuarantor !== "NATURAL_PERSON") {
        return true;
      }
    }
    return false;
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
      for (const t of this.user?.tenants) {
        const localsum = t.documents
          ?.filter((d: DfDocument) => {
            return d.documentCategory === "FINANCIAL";
          })
          .reduce((sum, current) => sum + (current.monthlySum || 0), 0);
        sum += localsum || 0;
      }
      if (sum === 0) {
        return this.$i18n.t("no-income");
      }
      return this.$i18n.t("income", [sum]);
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
  background-image: url("../assets/cover-features.png");

  @media (max-width: 768px) {
    background-image: url("../assets/cover-features-mobile.png");
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
</style>

<i18n>
{
  "en": {
    "title": "Rent file of {0}",
    "description": "{0} {1}",
    "guarant": "Guarantee",
    "personnal-file": "Personal files",
    "identification": "Identification",
    "residency": "Residency",
    "professional": "Professional",
    "financial": "Financial",
    "tax": "Tax",
    "ALONE": "Seul",
    "COUPLE": "En couple",
    "GROUP": "En colocation",
    "no-income": "sans revenu",
    "income": "avec un revenu net mensuel de {0}€",
    "organism": "Organism",
    "identification-legal-person": "Legal person identification",
    "and": " and "
  },
  "fr": {
    "title": "Dossier locataire de {0}",
    "description": "{0} {1}",
    "guarant": "Pièces du garant",
    "personnal-file": "Pièces du candidat",
    "identification": "Pièce d’identité",
    "residency": "Justificatif de domicile",
    "professional": "Justificatif de situation professionnelle",
    "financial": "Justificatif de ressources",
    "tax": "Avis d’imposition",
    "ALONE": "Seul",
    "COUPLE": "En couple",
    "GROUP": "En colocation",
    "no-income": "sans revenu",
    "income": "avec un revenu net mensuel de {0}€",
    "organism": "Certificat de l'organisme",
    "identification-legal-person": "Identification de la personne morale",
    "and": " et "
  }
}
</i18n>
