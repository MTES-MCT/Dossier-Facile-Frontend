<template>
  <div class="allowtax-container">
    <NakedCard class="fr-p-md-5w bg-transparent">
      <h6 class="header fr-icon-attachment-line fr-pb-1w fr-h6">
        {{ $t("automatic-tax-title") }}
      </h6>
      <div class="auth-tax-container">
        <div>
          {{ $t("automatic-tax-p1") }}
        </div>
        <ul>
          <li>{{ $t("automatic-tax-l1") }}</li>
          <li>{{ $t("automatic-tax-l2") }}</li>
          <li>{{ $t("automatic-tax-l3") }}</li>
          <li>{{ $t("automatic-tax-l4") }}</li>
        </ul>
        <i18n path="automatic-tax-p2" tag="div">
          <template v-slot:label>
            <span class="bold-italic">{{ $t("dgfip-approved-label") }}</span>
          </template>
        </i18n>
        <div class="tax-btn-container">
          <BigRadio
            :val="'disallow'"
            :value="allowTax"
            @input="onChoice"
            class="fr-col-md-3 fr-col-12 disallow-btn no-max-width"
            :class="{ selected: allowTax === 'disallow' }"
          >
            <span>{{ $t("forbid-tax") }}</span>
          </BigRadio>
          <BigRadio
            :val="'allow'"
            :value="allowTax"
            @input="onChoice"
            class="fr-col-md-9 fr-col-12 blue-text no-max-width"
            :class="{ selected: allowTax === 'allow' }"
          >
            <span>{{ $t("allow-tax") }}</span>
          </BigRadio>
        </div>
      </div>
    </NakedCard>
    <ConfirmModal
      v-if="showConfirmDeclineModal"
      :validateBtnText="$t('modal.disable-button').toString()"
      @valid="confirmDecline()"
      @cancel="showConfirmDeclineModal = false"
    >
      <i18n path="modal.warning-text" tag="p">
        <template v-slot:check>
          <span class="fr-text--bold">{{ $t("modal.automatic-check") }}</span>
        </template>
        <template v-slot:label>
          <span class="bold-italic">{{ $t("dgfip-approved-label") }}</span>
        </template>
      </i18n>
    </ConfirmModal>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import BigRadio from "df-shared/src/Button/BigRadio.vue";
import NakedCard from "df-shared/src/components/NakedCard.vue";
import axios from "axios";
import ConfirmModal from "df-shared/src/components/ConfirmModal.vue";
import { mapState } from "vuex";
import { User } from "df-shared/src/models/User";

@Component({
  components: {
    BigRadio,
    NakedCard,
    ConfirmModal
  },
  computed: {
    ...mapState({
      user: "user"
    })
  }
})
export default class AllowCheckTax extends Vue {
  user!: User;
  allowTax = "";
  showConfirmDeclineModal = false;

  mounted() {
    if (this.user.allowCheckTax !== undefined) {
      this.allowTax = this.user.allowCheckTax ? "allow" : "disallow";
    }
  }

  onChoice(choice: string) {
    if (choice === this.allowTax) {
      return;
    }
    if (choice === "disallow") {
      this.showConfirmDeclineModal = true;
    }
    if (choice === "allow") {
      this.allowAutomaticCheck();
    }
  }

  private allowAutomaticCheck() {
    if (
      this.user.franceConnect &&
      process.env.VUE_APP_FEATURE_FLIPPING_DGFIP_API === "true"
    ) {
      this.refreshFranceConnectToken();
    }
    this.saveChoice("allow");
  }

  private confirmDecline() {
    this.saveChoice("disallow");
    this.showConfirmDeclineModal = false;
  }

  private saveChoice(allowTax: string) {
    this.$store.dispatch("saveTaxAuth", { allowTax });
    this.allowTax = allowTax;
  }

  private async refreshFranceConnectToken() {
    if (!this.$route.query.refresh) {
      const currentUrl =
        process.env.VUE_APP_FULL_TENANT_URL + this.$route.fullPath;
      const link = await axios.post(
        `https://${process.env.VUE_APP_API_URL}/api/tenant/linkFranceConnect`,
        { url: currentUrl + "?refresh=true" }
      );
      window.location.href = link.data;
      return;
    }
  }
}
</script>

<style scoped lang="scss">
.allowtax-container {
  border-radius: 0.5rem;
  background-color: var(--blue-france-925);
  color: var(--primary);

  .fr-h6 {
    color: var(--primary);
  }
}

.bg-transparent {
  background-color: transparent;
}

.blue-text:hover {
  background-color: var(--blue-france-hover);
}

.selected {
  color: #ffffff !important;
  background-color: var(--primary) !important;
}

.no-max-width {
  max-width: none;
}

.disallow-btn:hover {
  color: var(--primary);
  background-color: var(--blue-france-hover);
}

.auth-tax-container {
  margin-left: 1.8rem;
}

.tax-btn-container {
  margin-top: 2rem;
  display: flex;
  @media all and (max-width: 767px) {
    flex-direction: column;
  }
}

.bold-italic {
  font-weight: bold;
  font-style: italic;
}
</style>

<i18n>
{
  "en": {
    "forbid-tax": "I decline",
    "allow-tax": "I accept automatic verification",
    "automatic-tax-title": "Automatic verification of your tax declaration",
    "automatic-tax-p1": "Vous pouvez accepter ou refuser la vérification des données suivantes vous concernant ainsi que vos colocataire(s), partenaire et garant(s) le cas échéant :",
    "automatic-tax-l1": "état civil",
    "automatic-tax-l2": "adresse déclarée au 1er janvier",
    "automatic-tax-l3": "situation du foyer fiscal",
    "automatic-tax-l4": "détail des revenus",
    "automatic-tax-p2": "Si vous acceptez la vérification automatique la mention {label} figurera sur votre dossier devant chaque avis d’imposition et contribuera à renforcer l'image de votre dossier auprès des bailleurs.",
    "dgfip-approved-label": "\"Revenu fiscal certifié auprès des services des impôts\"",
    "modal" : {
      "warning-text": "Si vous désactivez {check}, la mention {label} ne figurera plus sur votre dossier, tant pour vous que pour vos garants, et l’ensemble des données récupérées auprès des services des impôts ne seront pas conservées.",
      "automatic-check": "la vérification automatique",
      "disable-button": "Disable automatic verification"
    }
  },
  "fr": {
    "forbid-tax": "Je refuse",
    "allow-tax": "J'accepte la vérification automatique",
    "automatic-tax-title": "Vérification automatique des revenus fiscaux",
    "automatic-tax-p1": "Vous pouvez accepter ou refuser la vérification des données suivantes vous concernant ainsi que vos colocataire(s), partenaire et garant(s) le cas échéant :",
    "automatic-tax-l1": "état civil",
    "automatic-tax-l2": "adresse déclarée au 1er janvier",
    "automatic-tax-l3": "situation du foyer fiscal",
    "automatic-tax-l4": "détail des revenus",
    "automatic-tax-p2": "Si vous acceptez la vérification automatique la mention {label} figurera sur votre dossier devant chaque avis d’imposition et contribuera à renforcer l'image de votre dossier auprès des bailleurs.",
    "dgfip-approved-label": "\"Revenu fiscal certifié auprès des services des impôts\"",
    "modal" : {
      "warning-text": "Si vous désactivez {check}, la mention {label} ne figurera plus sur votre dossier, tant pour vous que pour vos garants, et l’ensemble des données récupérées auprès des services des impôts ne seront pas conservées.",
      "automatic-check": "la vérification automatique",
      "disable-button": "Désactiver la vérification automatique"
    }
  }
}
</i18n>
