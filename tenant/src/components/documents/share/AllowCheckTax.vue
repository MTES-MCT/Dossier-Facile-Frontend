<template>
  <div class="allowtax-container">
    <NakedCard class="fr-p-md-5w bg-transparent">
      <div class="header fr-icon-attachment-line fr-pb-1w">
        {{ $t("automatic-tax-title") }}
      </div>
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
        <div>
          {{ $t("automatic-tax-p2-1") }}
          <b>{{ $t("automatic-tax-p2-2") }}</b>
          {{ $t("automatic-tax-p2-3") }}
        </div>
        <div class="tax-btn-container">
          <BigRadio
            :val="'disallow'"
            :value="allowTax"
            @input="onSelectTaxAuth"
            class="fr-col-md-3 fr-col-12 disallow-btn no-max-width"
            :class="{ selected: allowTax === 'disallow' }"
          >
            <span>{{ $t("forbid-tax") }}</span>
          </BigRadio>
          <BigRadio
            :val="'allow'"
            :value="allowTax"
            @input="onSelectTaxAuth"
            class="fr-col-md-9 fr-col-12 blue-text no-max-width"
            :class="{ selected: allowTax === 'allow' }"
          >
            <span>{{ $t("allow-tax") }}</span>
          </BigRadio>
        </div>
      </div>
    </NakedCard>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import BigRadio from "df-shared/src/Button/BigRadio.vue";
import NakedCard from "df-shared/src/components/NakedCard.vue";
import axios from "axios";

@Component({
  components: {
    BigRadio,
    NakedCard
  }
})
export default class AllowCheckTax extends Vue {
  @Prop({ default: "" }) allowTax?: string;
  @Prop({ default: false }) franceConnect!: boolean;
  @Prop() tenantId?: number;

  async onSelectTaxAuth(allowTax: string) {
    if (
      allowTax === "allow" &&
      this.franceConnect &&
      process.env.VUE_APP_FEATURE_FLIPPING_DGFIP_API === "true"
    ) {
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
    const params: { allowTax: string; tenantId?: number } = { allowTax };
    if (this.tenantId !== null) {
      params.tenantId = this.tenantId;
    }
    this.$store.dispatch("saveTaxAuth", params).then(() => {
      this.$emit("allow-tax-callback", allowTax);
    });
  }
}
</script>

<style scoped lang="scss">
.allowtax-container {
  border-radius: 0.5rem;
  background-color: var(--blue-france-925);
  color: var(--info-425-625);
}
.blue-franceconnect {
  padding: 2rem;
  color: var(--primary);
  background-color: var(--bf200-bf300);
  border-radius: 0.25rem;
  .fr-h4 {
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
  // TODO replace buttons by radio and clean styles
  color: var(--primary) !important;
  background-color: var(--blue-france-hover) !important;
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
</style>

<i18n>
{
"en": {
  "forbid-tax": "I forbid",
  "allow-tax": "I accept automatic verification",
  "automatic-tax-title": "Your tax automatically checked?",
  "automatic-tax-p1": "Vous pouvez accepter ou refuser la vérification automatique des données personnelles suivantes :",
  "automatic-tax-l1": "Mon état civil",
  "automatic-tax-l2": "Mon adresse déclarée au 1er janvier",
  "automatic-tax-l3": "La situation de mon foyer fiscal",
  "automatic-tax-l4": "Le détail de mes revenus",
  "automatic-tax-p2-1": "Si vous acceptez, la mention",
  "automatic-tax-p2-2": " \"Revenu fiscal certifié auprès des impôts\" ",
  "automatic-tax-p2-3": "figurera sur votre dossier et contribuera à renforcer l'image de votre dossier auprès des bailleurs."
},
"fr": {
  "forbid-tax": "Je refuse",
  "allow-tax": "J'accepte la vérification automatique",
  "automatic-tax-title": "Votre revenu fiscal vérifié automatiquement ?",
  "automatic-tax-p1": "Vous pouvez accepter ou refuser la vérification automatique des données personnelles suivantes :",
  "automatic-tax-l1": "Mon état civil",
  "automatic-tax-l2": "Mon adresse déclarée au 1er janvier",
  "automatic-tax-l3": "La situation de mon foyer fiscal",
  "automatic-tax-l4": "Le détail de mes revenus",
  "automatic-tax-p2-1": "Si vous acceptez, la mention",
  "automatic-tax-p2-2": " \"Revenu fiscal certifié auprès des impôts\" ",
  "automatic-tax-p2-3": "figurera sur votre dossier et contribuera à renforcer l'image de votre dossier auprès des bailleurs."
}
}
</i18n>
