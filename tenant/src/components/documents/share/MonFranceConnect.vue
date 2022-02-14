<template>
  <div>
    <h2 class="fr-h4">
      <span class="material-icons md-28">attach_file</span
      >{{ $t("with-franceconnect-title") }}
    </h2>
    <div class="fr-ml-3w">
      <div>{{ $t("with-franceconnect-text") }}</div>
      <button
        type="button"
        aria-label="Mes justificatifs avec Mon FranceConnect"
        title="Connectez vous avec FranceConnect pour accéder à vos justificatifs"
        class="fr-btn fr-mt-3w"
        @on-click="openDGFIP"
      >
        Mon FranceConnect
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { AnalyticsService } from "../../../services/AnalyticsService";

@Component
export default class MonFranceConnect extends Vue {
  openDGFIP() {
    AnalyticsService.openDGFIP();
    window.open(
      "https://mon.franceconnect.gouv.fr/Redirect/?scope=BoutonDGFIP",
      "_blank"
    );
  }
}
</script>

<i18n>
{
"en": {
  "with-franceconnect-title": "Your supporting documents with Mon FranceConnect",
  "with-franceconnect-text": "Mon FranceConnect is a digital state service allowing you to retrieve your supporting documents from different administrations."
},
"fr": {
  "with-franceconnect-title": "Vos justificatifs avec Mon FranceConnect",
  "with-franceconnect-text": "Mon FranceConnect est un service numérique de l'État vous permettant de récupérer vos justificatifs provenant de différentes administrations."
}
}
</i18n>
