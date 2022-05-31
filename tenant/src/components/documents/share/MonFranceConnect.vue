<template>
  <div>
    <h2 class="fr-icon-attachment-line fr-h4 blue-text">
      {{ $t("with-franceconnect-title") }}
    </h2>
    <div class="fr-ml-3w">
      <div>{{ $t("with-franceconnect-text") }}</div>
      <button
        type="button"
        aria-label="Mes justificatifs avec Mon FranceConnect"
        title="Connectez vous avec FranceConnect pour accéder à vos justificatifs"
        class="fr-btn fr-mt-3w btn-my-fc"
        @click="openDGFIP"
      >
        <span> Mon FranceConnect</span>
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
<style lang="scss" scoped>
.fr-icon-attachment-line:before {
  font-size: 2rem;
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
  "with-franceconnect-title": "Your supporting documents with Mon FranceConnect",
  "with-franceconnect-text": "Mon FranceConnect is a digital state service allowing you to retrieve your supporting documents from different administrations."
},
"fr": {
  "with-franceconnect-title": "Vos justificatifs avec Mon FranceConnect",
  "with-franceconnect-text": "Mon FranceConnect est un service numérique de l'État vous permettant de récupérer vos justificatifs provenant de différentes administrations."
}
}
</i18n>
