<template>
  <div class="root rf-container">
    <section class="background rf-pb-5w rf-mb-3w">
      <div class="rf-container">
        <div class="rf-col-md-8">
          <div class="rf-grid-col">
            <h1 class="rf-h1 color--white" v-if="user">
              {{ $t("title", [getName()]) }}
            </h1>
            <p class="text-bold color--white">
              {{ $t("description", [getStatus(), getIncomeSum()]) }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <section class="rf-mb-3w">
      <div id="rf-tabs" class="rf-tabs">
        <ul class="rf-tabs__list" role="tablist">
          <li v-for="(tenant, k) in getTenants()" v-bind:key="tenant.id">
            <button
              class="rf-tabs__tab rf-fi-checkbox-line rf-tabs__tab--icon-left"
              tabindex="0"
              role="tab"
              :aria-selected="tabIndex === k"
              :aria-controls="`rf-tabpanel-${k}`"
              @click="tabIndex = k"
            >
              {{ tenant.firstName }}
              {{ tenant.lastName }}
            </button>
            <div
              :id="`rf-tabpanel-${k}`"
              class="rf-tabs__panel"
              role="tabpanel"
              tabindex="0"
              v-show="tabIndex === k"
            >
              <div class="rf-prose">
                <h4 class="rf-h4">{{ $t("personnal-file") }}</h4>
                <div class="rf-grid-row file-item">
                  <span>{{ $t("identification") }}</span
                  ><DfButton @on-click="open(tenant, 'IDENTIFICATION')">{{
                    $t("see")
                  }}</DfButton>
                </div>
                <div class="rf-grid-row file-item">
                  <span>{{ $t("residency") }}</span
                  ><DfButton @on-click="open(tenant, 'RESIDENCY')">{{
                    $t("see")
                  }}</DfButton>
                </div>
                <div class="rf-grid-row file-item">
                  <span>{{ $t("professional") }}</span
                  ><DfButton @on-click="open(tenant, 'PROFESSIONAL')">{{
                    $t("see")
                  }}</DfButton>
                </div>
                <div class="rf-grid-row file-item">
                  <span>{{ $t("financial") }}</span
                  ><DfButton @on-click="open(tenant, 'FINANCIAL')">{{
                    $t("see")
                  }}</DfButton>
                </div>
                <div class="rf-grid-row file-item">
                  <span>{{ $t("tax") }}</span
                  ><DfButton @on-click="open(tenant, 'TAX')">{{
                    $t("see")
                  }}</DfButton>
                </div>
                <div v-if="hasGuarantor(tenant)">
                  <h4 class="rf-h4">
                    {{ $t("guarant") }}
                  </h4>
                  <div v-if="tenant.guarantors">
                    <div v-for="g in tenant.guarantors" v-bind:key="g.id">
                      <div v-if="g.typeGuarantor === 'LEGAL_PERSON'">
                        <div class="rf-grid-row file-item">
                          <span>{{ $t("identification-legal-person") }}</span
                          ><DfButton
                            @on-click="
                              open(tenant, 'IDENTIFICATION_LEGAL_PERSON')
                            "
                            >{{ $t("see") }}</DfButton
                          >
                        </div>
                        <div class="rf-grid-row file-item">
                          <span>{{ $t("identification") }}</span
                          ><DfButton
                            @on-click="open(tenant, 'IDENTIFICATION')"
                            >{{ $t("see") }}</DfButton
                          >
                        </div>
                      </div>
                      <div v-if="g.typeGuarantor === 'ORGANISM'">
                        <div class="rf-grid-row file-item">
                          <span>{{ $t("organism") }}</span
                          ><DfButton
                            @on-click="open(tenant, 'IDENTIFICATION')"
                            >{{ $t("see") }}</DfButton
                          >
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </section>
    <section class="rf-mb-7w fix-mt" :style="`margin-top: ${tabsSize}`">
      <DfButton primary="true" @on-click="download">{{
        $t("download-all")
      }}</DfButton>
    </section>
  </div>
</template>

<script lang="ts">
import { Guarantor } from "df-shared/src/models/Guarantor";
import { User } from "df-shared/src/models/User";
import { FileUser } from "df-shared/src/models/FileUser";
import { Vue, Component } from "vue-property-decorator";
import DfButton from "df-shared/src/Button/Button.vue";
import { ProfileService } from "@/services/ProfileService";
import { DfDocument } from "df-shared/src/models/DfDocument";

@Component({
  components: {
    DfButton
  }
})
export default class File extends Vue {
  user: FileUser | null = null;
  tabIndex = 0;
  tabsSize = "600px";

  getName() {
    if (this.user?.tenants !== undefined) {
      return `${this.user.tenants[0].firstName} ${this.user.tenants[0].lastName}`;
    }
    return "";
  }

  mounted() {
    const token = this.$route.params.token;
    ProfileService.getUserByToken(token).then(d => {
      this.user = d.data;
      const el = this.$el.querySelector("#rf-tabs");
      const h = (el?.scrollHeight || 0) > 100 ? el?.scrollHeight : 600;
      if (h) {
        this.tabsSize = `${h + 150}px`;
      }
    });
  }

  getTenants() {
    const users: (User | Guarantor)[] = [];
    this.user?.tenants?.forEach(t => {
      users.push(t);
      if (t.guarantors && t.guarantors.length > 0) {
        t.guarantors.forEach(g => {
          if (g.typeGuarantor === "NATURAL_PERSON") {
            users.push(g);
          }
        });
      }
    });

    return users;
  }

  open(tenant: User, s: string) {
    const doc = tenant.documents?.find(d => {
      return d.documentCategory === s;
    });
    if (doc?.name) {
      window.open(doc.name, "_blank");
    }
  }

  download() {
    window.open(this.user?.dossierPdfUrl, "_blank");
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
    "ALONE": "Seul",
    "COUPLE": "En couple",
    "GROUP": "En colocation",
    "no-income": "sans revenu",
    "income": "avec un revenu net mensuel de {0}€",
    "organism": "Organism",
    "identification-legal-person": "Legal person identification"
  },
  "fr": {
    "title": "Dossier locataire de {0}",
    "description": "{0} {1}",
    "guarant": "Garantie",
    "personnal-file": "Pièces personnelles",
    "identification": "Pièce d’identité",
    "residency": "Justificatif de domicile",
    "professional": "Justificatif de situation professionnelle",
    "financial": "Justificatif de ressources",
    "tax": "Avis d’imposition",
    "see": "Voir",
    "download-all": "Télécharger le dossier complet (.pdf)",
    "ALONE": "Seul",
    "COUPLE": "En couple",
    "GROUP": "En colocation",
    "no-income": "sans revenu",
    "income": "avec un revenu net mensuel de {0}€",
    "organism": "Organisme",
    "identification-legal-person": "Identification de la personne morale"
  }
}
</i18n>
