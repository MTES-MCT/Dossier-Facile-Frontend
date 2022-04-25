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

      <FileReinsurance></FileReinsurance>

      <section class="fr-mt-5w fr-mb-3w">
        <div class="fr-tabs">
          <ul class="fr-tabs__list" role="tablist" aria-label="tab-list">
            <li
              v-for="(tenant, k) in getTenants()"
              v-bind:key="`li${k}`"
              role="presentation"
            >
              <button
                class="fr-tabs__tab fr-fi-checkbox-line fr-tabs__tab--icon-left"
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
            <div class="fr-prose">
              <h4
                class="fr-h4"
                v-if="tenant.typeGuarantor === 'NATURAL_PERSON'"
              >
                {{ $t("guarant") }}
              </h4>
              <h4
                class="fr-h4"
                v-if="tenant.typeGuarantor !== 'NATURAL_PERSON'"
              >
                {{ $t("personnal-file") }}
              </h4>
              <div class="fr-grid-row file-item">
                <span>{{ $t("identification") }}</span
                ><DfButton @on-click="open(tenant, 'IDENTIFICATION')">{{
                  $t("see")
                }}</DfButton>
              </div>
              <div class="fr-grid-row file-item">
                <span>{{ $t("residency") }}</span
                ><DfButton @on-click="open(tenant, 'RESIDENCY')">{{
                  $t("see")
                }}</DfButton>
              </div>
              <div class="fr-grid-row file-item">
                <span>{{ $t("professional") }}</span
                ><DfButton @on-click="open(tenant, 'PROFESSIONAL')">{{
                  $t("see")
                }}</DfButton>
              </div>
              <div
                class="fr-grid-row file-item"
                v-for="(doc, k) in getDocs(tenant, 'FINANCIAL')"
                v-bind:key="doc.id"
              >
                <span>{{ $t("financial") }} {{ k >= 1 ? k + 1 : "" }}</span
                ><DfButton @on-click="openDoc(doc)">{{ $t("see") }}</DfButton>
              </div>
              <div class="fr-grid-row file-item">
                <span>{{ $t("tax") }}</span
                ><DfButton @on-click="open(tenant, 'TAX')">{{
                  $t("see")
                }}</DfButton>
              </div>
              <div v-if="hasGuarantor(tenant)">
                <h4 class="fr-h4">
                  {{ $t("guarant") }}
                </h4>
                <div v-if="tenant.guarantors">
                  <div v-for="g in tenant.guarantors" v-bind:key="g.id">
                    <div v-if="g.typeGuarantor === 'LEGAL_PERSON'">
                      <div class="fr-grid-row file-item">
                        <span>{{ $t("identification-legal-person") }}</span
                        ><DfButton
                          @on-click="open(g, 'IDENTIFICATION_LEGAL_PERSON')"
                          >{{ $t("see") }}</DfButton
                        >
                      </div>
                      <div class="fr-grid-row file-item">
                        <span>{{ $t("identification") }}</span
                        ><DfButton @on-click="open(g, 'IDENTIFICATION')">{{
                          $t("see")
                        }}</DfButton>
                      </div>
                    </div>
                    <div v-if="g.typeGuarantor === 'ORGANISM'">
                      <div class="fr-grid-row file-item">
                        <span>{{ $t("organism") }}</span
                        ><DfButton @on-click="open(g, 'IDENTIFICATION')">{{
                          $t("see")
                        }}</DfButton>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section class="fr-mb-7w fix-mt">
        <DfButton v-if="showProgressBar" primary="true"
          >{{ $t("download-all-inprogress")
          }}<span><ProgressIndicator diameter="22px" border="3px"/></span>
        </DfButton>
        <DfButton v-else primary="true" @on-click="download">{{
          $t("download-all")
        }}</DfButton>
        <p class="fr-mt-3w">
          Si le téléchargement ne fonctionne pas du premier coup, attendez
          quelques minutes et recommencez !
        </p>
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

@Component({
  components: {
    ProgressIndicator,
    DfButton,
    FileReinsurance
  }
})
export default class File extends Vue {
  user: FileUser | null = null;
  tabIndex = 0;
  showProgressBar = false;

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

  open(u: User | Guarantor, s: string) {
    const doc = u.documents?.find(d => {
      return d.documentCategory === s;
    });
    if (doc?.name) {
      this.openDoc(doc);
    }
  }

  openDoc(doc: DfDocument) {
    window.open(doc.name, "_blank");
  }

  retryDownload() {
    setTimeout(() => {
      this.setUser();
      if (this.user?.dossierPdfUrl) {
        this.showProgressBar = false;
        this.downloadFile(this.user?.dossierPdfUrl);
      } else {
        this.retryDownload();
      }
    }, 7000);
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
    if (this.user?.dossierPdfUrl) {
      this.downloadFile(this.user?.dossierPdfUrl);
    } else {
      ProfileService.postCreateFullPdf(this.$route.params.token)
        .then(() => {
          this.retryDownload();
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
    return;
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

.file-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: var(--g200);
  margin-top: 1rem;
  margin-bottom: 1rem;
  padding: 0.5rem;
}

.fr-tabs {
  background-color: var(--background-default-grey);
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
    "see": "See",
    "download-all": "Download the complete file (.pdf)",
    "download-all-inprogress": "Download in progress...",
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
    "see": "Voir",
    "download-all": "Télécharger le dossier complet (.pdf)",
    "download-all-inprogress": "Téléchargement en cours...",
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
