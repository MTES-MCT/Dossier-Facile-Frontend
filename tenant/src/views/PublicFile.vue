<template>
  <div class="root fr-container">
    <section class="background fr-pb-5w fr-mb-3w">
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

    <section class="fr-mb-3w">
      <div id="fr-tabs" class="fr-tabs">
        <ul
          class="fr-tabs__list"
          role="tablist"
          aria-label="[A modifier | nom du système d'onglet]"
        >
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
              {{ tenant.firstName }}
              {{ tenant.lastName }}
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
            <h4 class="fr-h4" v-if="tenant.typeGuarantor === 'NATURAL_PERSON'">
              {{ $t("guarant") }}
            </h4>
            <h4 class="fr-h4" v-if="tenant.typeGuarantor !== 'NATURAL_PERSON'">
              {{ $t("personnal-file") }}
            </h4>
            <div class="fr-grid-row file-item">
              <span>{{ $t("identification") }}</span>
            </div>
            <div class="fr-grid-row file-item">
              <span>{{ $t("residency") }}</span>
            </div>
            <div class="fr-grid-row file-item">
              <span>{{ $t("professional") }}</span>
            </div>
            <div class="fr-grid-row file-item">
              <span>{{ $t("financial") }}</span>
            </div>
            <div class="fr-grid-row file-item">
              <span>{{ $t("tax") }}</span>
            </div>
            <div v-if="hasGuarantor(tenant)">
              <h4 class="fr-h4">
                {{ $t("guarant") }}
              </h4>
              <div v-if="tenant.guarantors">
                <div v-for="g in tenant.guarantors" v-bind:key="g.id">
                  <div v-if="g.typeGuarantor === 'LEGAL_PERSON'">
                    <div class="fr-grid-row file-item">
                      <span>{{ $t("identification-legal-person") }}</span>
                    </div>
                    <div class="fr-grid-row file-item">
                      <span>{{ $t("identification") }}</span>
                    </div>
                  </div>
                  <div v-if="g.typeGuarantor === 'ORGANISM'">
                    <div class="fr-grid-row file-item">
                      <span>{{ $t("organism") }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
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

  getName() {
    if (this.user?.tenants !== undefined) {
      return `${this.user.tenants[0].firstName} ${this.user.tenants[0].lastName}`;
    }
    return "";
  }

  mounted() {
    const token = this.$route.params.token;
    ProfileService.getPublicUserByToken(token).then(d => {
      this.user = d.data;
    });
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

  open(tenant: User, s: string) {
    const doc = tenant.documents?.find(d => {
      return d.documentCategory === s;
    });
    if (doc?.name) {
      window.open(doc.name, "_blank");
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
    "guarant": "Pièces du garant",
    "personnal-file": "Pièces du candidat",
    "identification": "Pièce d’identité",
    "residency": "Justificatif de domicile",
    "professional": "Justificatif de situation professionnelle",
    "financial": "Justificatif de ressources",
    "tax": "Avis d’imposition",
    "see": "Voir",
    "ALONE": "Seul",
    "COUPLE": "En couple",
    "GROUP": "En colocation",
    "no-income": "sans revenu",
    "income": "avec un revenu net mensuel de {0}€",
    "organism": "Certificat de l'organisme",
    "identification-legal-person": "Identification de la personne morale"
  }
}
</i18n>
