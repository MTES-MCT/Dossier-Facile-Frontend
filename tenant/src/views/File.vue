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
              <div>
                <DfButton v-if="showProgressBar" primary="true"
                  >{{ $t("download-all-inprogress")
                  }}<span
                    ><ProgressIndicator diameter="22px" border="3px"
                  /></span>
                </DfButton>
                <DfButton
                  :disabled="user.status != 'VALIDATED'"
                  v-else
                  :title="$t('download-disabled-title')"
                  primary="true"
                  @on-click="download"
                  >{{ $t("download-all") }}</DfButton
                >
              </div>
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
                />
                <FileRowListItem
                  :label="$t('residency')"
                  :document="document(tenant, 'RESIDENCY')"
                />
                <FileRowListItem
                  :label="$t('professional')"
                  :document="document(tenant, 'PROFESSIONAL')"
                />
                <FileRowListItem
                  v-for="(doc, k) in getDocs(tenant, 'FINANCIAL')"
                  v-bind:key="doc.id"
                  :label="$t('financial') + (k >= 1 ? ' ' + (k + 1) : '')"
                  :document="doc"
                />
                <FileRowListItem
                  :label="$t('tax')"
                  :tagLabel="
                    isTenantTaxChecked(tenant) ? $t('tax-verified') : $t('tax')
                  "
                  :document="document(tenant, 'TAX')"
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
                      />
                      <FileRowListItem
                        :label="$t('identificationn')"
                        :document="document(g, 'IDENTIFICATION')"
                      />
                    </ul>
                    <ul
                      v-if="g.typeGuarantor === 'ORGANISM'"
                      class="without-padding"
                    >
                      <FileRowListItem
                        :label="$t('organism')"
                        :document="document(g, 'IDENTIFICATION')"
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
        <div class="text-center">
          <DfButton v-if="showProgressBar" primary="true"
            >{{ $t("download-all-inprogress")
            }}<span><ProgressIndicator diameter="22px" border="3px"/></span>
          </DfButton>
          <DfButton
            :disabled="user.status != 'VALIDATED'"
            v-else
            :title="$t('download-disabled-title')"
            primary="true"
            @on-click="download"
            >{{ $t("download-all") }}</DfButton
          >
        </div>
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
import DfButton from "df-shared/src/Button/Button.vue";
import { ProfileService } from "../services/ProfileService";
import { DfDocument } from "df-shared/src/models/DfDocument";
import FileReinsurance from "../components/FileReinsurance.vue";
import ProgressIndicator from "@/components/ProgressIndicator.vue";
import FileRowListItem from "../components/documents/FileRowListItem.vue";

@Component({
  components: {
    ProgressIndicator,
    DfButton,
    FileReinsurance,
    FileRowListItem
  }
})
export default class File extends Vue {
  user: FileUser | null = null;
  tabIndex = 0;
  showProgressBar = false;

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
          .map(o => this.$options.filters?.fullName(o))
          .join(this.$i18n.t("and").toString());
        return userNames;
      }
      const userNames = this.user.tenants
        .map(o => this.$options.filters?.fullName(o))
        .join(", ");
      return userNames;
    }
    return "";
  }

  private setUser() {
    const token = this.$route.params.token;
    ProfileService.getUserByToken(token).then((d: any) => {
      this.user = d.data;
      if (this.user) {
        this.user.tenants = this.user?.tenants?.sort((t1, t2) => {
          return t1.tenantType === "CREATE" && t2.tenantType !== "CREATE"
            ? -1
            : 1;
        });
      }
    });
  }

  mounted() {
    this.setUser();
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

  retryDownload(remainingCount: number) {
    setTimeout(() => {
      this.setUser();
      if (
        this.user?.dossierPdfDocumentStatus === "COMPLETED" &&
        this.user?.dossierPdfUrl
      ) {
        this.downloadFile(this.user?.dossierPdfUrl);
      } else if (remainingCount > 0) {
        this.retryDownload(remainingCount - 1);
      } else {
        this.showProgressBar = false;
        this.$toasted.show(this.$i18n.t("download-failed").toString(), {
          type: "error",
          duration: 10000
        });
      }
    }, 15000);
  }

  private downloadFile(url: string) {
    ProfileService.getFile(url)
      .then(response => {
        const blob = new Blob([response.data], { type: "application/pdf" });
        const link = document.createElement("a");
        link.href = window.URL.createObjectURL(blob);
        link.download = "dossierFacile-" + this.$route.params.token + ".pdf";
        link.click();
      })
      .catch(error => {
        console.error(error);
        Vue.toasted.global.error();
      })
      .finally(() => (this.showProgressBar = false));
  }

  download() {
    this.showProgressBar = true;
    if (
      this.user?.dossierPdfDocumentStatus === "COMPLETED" &&
      this.user?.dossierPdfUrl
    ) {
      this.downloadFile(this.user?.dossierPdfUrl);
    } else {
      ProfileService.postCreateFullPdf(this.$route.params.token)
        .then(() => {
          this.retryDownload(6);
        })
        .catch(error => {
          this.showProgressBar = false;
          console.error(error);
          Vue.toasted.global.error();
        });
    }
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
    "tax-verified": "Tax income certified with the tax services",
    "download-all": "Download the complete file (.pdf)",
    "download-all-inprogress": "Download in progress...",
    "ALONE": "Seul",
    "COUPLE": "En couple",
    "GROUP": "En colocation",
    "no-income": "sans revenu",
    "income": "avec un revenu net mensuel de {0}€",
    "organism": "Organism",
    "identification-legal-person": "Legal person identification",
    "and": " and ",
    "download-failed": "Download failed. Try again in few minutes.",
    "download-disabled-title": "The pdf file could be downloaded after files verification by operators."
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
    "tax-verified": "Revenu fiscal certifié auprès des services des impôts",
    "download-all": "Télécharger le dossier complet (.pdf)",
    "download-all-inprogress": "Téléchargement en cours...",
    "ALONE": "Seul",
    "COUPLE": "En couple",
    "GROUP": "En colocation",
    "no-income": "sans revenu",
    "income": "avec un revenu net mensuel de {0}€",
    "organism": "Certificat de l'organisme",
    "identification-legal-person": "Identification de la personne morale",
    "and": " et ",
    "download-failed": "Echec du téléchargement. Ressayez dans quelques minutes.",
    "download-disabled-title": "Le dossier pourra être téléchargé lorsque celui-ci aura été entièrement vérifié par DossierFacile."
  }
}
</i18n>
