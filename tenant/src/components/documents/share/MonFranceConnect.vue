<template>
  <div class="mfc-box">
    <div class="optional fr-px-2w fr-pt-2w fr-pb-1w">
      <span class="fr-tag">{{ $t("monfranceconnect.optional") }}</span>
    </div>
    <div class="fr-px-2w fr-pb-3w">
      <div class="header fr-icon-attachment-line fr-pb-1w">
        {{ $t("monfranceconnect.with-franceconnect-title") }}
      </div>
      <div class="fr-px-4w">
        <div>{{ $t("monfranceconnect.with-franceconnect-text") }}</div>
        <button
          type="button"
          aria-label="Mes justificatifs avec Mon FranceConnect"
          title="Connectez vous avec FranceConnect pour accéder à vos justificatifs"
          class="fr-btn fr-mt-3w btn-my-fc"
          @click="redirect"
        >
          <span>Mon FranceConnect</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { AnalyticsService } from "../../../services/AnalyticsService";

interface MonFranceConnectRedirection {
  scope: string;
  analyticsEvent: string;
}

export const REDIRECTIONS: { [id: string]: MonFranceConnectRedirection } = {
  dgfip: {
    scope: "BoutonDGFIP",
    analyticsEvent: "open-dgfip"
  },
  scholarship: {
    scope: "BoutonEtudiantBoursier",
    analyticsEvent: "open-monfranceconnect_scholarship"
  },
  student: {
    scope: "BoutonEtudiant",
    analyticsEvent: "open-monfranceconnect_student"
  },
  unemployed: {
    scope: "BoutonPE",
    analyticsEvent: "open-monfranceconnect_unemployed"
  },
  unemploymentBenefit: {
    scope: "BoutonIndemnisationPE",
    analyticsEvent: "open-monfranceconnect_unemployment-benefit"
  }
};

@Component
export default class MonFranceConnect extends Vue {
  MON_FRANCE_CONNECT_URL = "https://mon.franceconnect.gouv.fr/Redirect/";

  @Prop() redirectionType!: string;

  redirect() {
    const redirection = REDIRECTIONS[this.redirectionType];
    const url = this.buildUrl(redirection);
    AnalyticsService.openMonFranceConnect(redirection.analyticsEvent);
    window.open(url.href, "_blank");
  }

  private buildUrl(redirection: MonFranceConnectRedirection): URL {
    const url = new URL(this.MON_FRANCE_CONNECT_URL);
    url.searchParams.append("partenaire", "dossierfacile");
    url.searchParams.append("scope", redirection.scope);
    return url;
  }
}
</script>
<style lang="scss" scoped>
.mfc-box {
  border-radius: 0.5rem;
  background-color: var(--blue-france-925);
  color: var(--info-425-625);
}

.optional {
  display: flex;
  justify-content: flex-end;

  .fr-tag {
    color: inherit;
    background-color: var(--background-default-grey);
  }
}

.header {
  &.fr-icon-attachment-line:before {
    font-size: 2rem;
    width: 2rem;
  }

  display: inline-flex;
  font-weight: 700;
  font-size: 1.25rem;
}

.btn-my-fc {
  border-radius: 0.5rem;
  background-image: url("../../../assets/mon_franceconnect.svg");
  background-size: cover;
  width: 184px;
  height: 48px;

  span {
    display: none;
  }
}
</style>
