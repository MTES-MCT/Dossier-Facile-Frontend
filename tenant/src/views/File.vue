<template>
  <div class="root rf-container">
    <section class="background rf-pb-5w rf-mb-3w">
      <div class="rf-container">
        <div class="rf-col-md-8">
          <div class="rf-grid-col">
            <h1 class="rf-h1 color--white">
              {{ $t("title", [getName()]) }}
            </h1>
            <p class="text-bold color--white">
              {{ $t("description", ["4200"]) }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <section class="rf-mb-3w">
      <div id="rf-tabs" class="rf-tabs">
        <ul class="rf-tabs__list" role="tablist">
          <li v-for="(tenant, k) in getUsers()" v-bind:key="tenant.id">
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
                  ><DfButton>{{ $t("see") }}</DfButton>
                </div>
                <div class="rf-grid-row file-item">
                  <span>{{ $t("residency") }}</span
                  ><DfButton>{{ $t("see") }}</DfButton>
                </div>
                <div class="rf-grid-row file-item">
                  <span>{{ $t("professional") }}</span
                  ><DfButton>{{ $t("see") }}</DfButton>
                </div>
                <div class="rf-grid-row file-item">
                  <span>{{ $t("financial") }}</span
                  ><DfButton>{{ $t("see") }}</DfButton>
                </div>
                <div class="rf-grid-row file-item">
                  <span>{{ $t("tax") }}</span
                  ><DfButton>{{ $t("see") }}</DfButton>
                </div>
                <h4 class="rf-h4">{{ $t("guarant") }}</h4>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </section>
    <section class="rf-mb-5w fix-mt" :style="`margin-top: ${tabsSize}`">
      <DfButton primary="true" @on-click="download">{{
        $t("download-all")
      }}</DfButton>
    </section>
  </div>
</template>

<script lang="ts">
import { Guarantor } from "df-shared/src/models/Guarantor";
import { User } from "df-shared/src/models/User";
import { Vue, Component } from "vue-property-decorator";
import { mapState } from "vuex";
import DfButton from "df-shared/src/Button/Button.vue";

@Component({
  components: {
    DfButton,
  },
})
export default class File extends Vue {
  user = new User();
  tabIndex = 0;
  tabsSize = "600px";

  getName() {
    return `${this.user.firstName} ${this.user.lastName}`;
  }

  mounted() {
    const token = this.$route.params.token;
    const el = this.$el.querySelector("#rf-tabs");
    const h = el?.scrollHeight || 600;
    this.tabsSize = `${h + 20}px`;
  }

  getUsers() {
    // TODO get other tenants too,
    const users: (User | Guarantor)[] = [];
    users.push(this.user);
    if (this.user.guarantors) {
      users.push(...this.user.guarantors);
    }

    return users;
  }

  download() {
    // TODO
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
    "description": "Couple avec {0}€ net",
    "guarant": "Guarantee",
    "personnal-file": "Personal files",
    "identification": "Identification",
    "residency": "Residency",
    "professional": "Professional",
    "financial": "Financial",
    "tax": "Tax",
    "see": "See",
    "download-all": "Download the complete file (.pdf)"
  },
  "fr": {
    "title": "Dossire locataire de {0}",
    "description": "Couple avec {0}€ net",
    "guarant": "Guarantie",
    "personnal-file": "Pièces personnelles",
    "identification": "Pièce d’identité",
    "residency": "Justificatif de domicile",
    "professional": "Justificatif de situation professionelle et financière",
    "financial": "Justificatif de revenu",
    "tax": "Avis d’imposition",
    "see": "Voir",
    "download-all": "Télécharger le dossier complet (.pdf)"
  }
}
</i18n>