<template>
  <div class="mfc-box" v-if="isDisplayed()">
    <div class="optional fr-px-2w fr-pt-2w fr-pb-1w">
      <span class="fr-tag">{{ $t("optional") }}</span>
    </div>
    <div class="fr-px-2w fr-pb-3w">
      <div class="header fr-icon-attachment-line fr-pb-1w">
        {{ $t("with-franceconnect-title") }}
      </div>
      <div class="fr-px-4w">
        <div>{{ $t("with-franceconnect-text") }}</div>
        <button
          type="button"
          aria-label="Mes justificatifs avec Mon FranceConnect"
          title="Connectez vous avec FranceConnect pour accéder à vos justificatifs"
          class="fr-btn fr-mt-3w btn-my-fc"
          @click="openDGFIP"
        >
          <span>Mon FranceConnect</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { AnalyticsService } from "../../../services/AnalyticsService";

@Component
export default class MonFranceConnect extends Vue {
  MON_FRANCE_CONNECT_URL = "https://mon.franceconnect.gouv.fr/Redirect/";

  isDisplayed() {
    const isHidden =
      `${process.env.VUE_APP_HIDE_MON_FRANCE_CONNECT_BUTTONS}` === "true";
    return !isHidden;
  }

  openDGFIP() {
    AnalyticsService.openDGFIP();
    const url = this.monFranceConnectRedirection(
      "avis-imposition",
      "BoutonDGFIP"
    );
    window.open(url.href, "_blank");
  }

  private monFranceConnectRedirection(step: string, scope: string): URL {
    const url = new URL(this.MON_FRANCE_CONNECT_URL);
    url.searchParams.append("partenaire", "dossierfacile");
    url.searchParams.append("démarche", step);
    url.searchParams.append("scope", scope);
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
<i18n>
{
"en": {
  "optional": "optional",
  "with-franceconnect-title": "Your supporting documents with Mon FranceConnect",
  "with-franceconnect-text": "Mon FranceConnect is a digital state service allowing you to retrieve your supporting documents from different administrations."
},
"fr": {
  "optional": "optionnel",
  "with-franceconnect-title": "Vos justificatifs avec Mon FranceConnect",
  "with-franceconnect-text": "Mon FranceConnect est un service numérique de l'État vous permettant de récupérer vos justificatifs provenant de différentes administrations."
}
}
</i18n>