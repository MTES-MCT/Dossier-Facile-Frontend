<template>
  <div>
    <span class="fr-h5 fr-mr-3w">{{ $t("verified-title") }}</span
    ><a href="https://www.dossierfacile.fr" target="_blank" rel="noreferrer">{{
      $t("know-more")
    }}</a>
    <div class="fr-grid-row fr-grid-row--gutters space-between fr-mt-3w">
      <div
        class="fr-col-12"
        :class="[displayFranceConnectBloc ? 'fr-col-md-3' : 'fr-col-md-4']"
      >
        <NakedCard class="h-100">
          <span class="material-icons text-green md-48">check_circle</span>
          <p>{{ $t("all-documents") }}</p>
        </NakedCard>
      </div>
      <div
        class="fr-col-12"
        :class="[displayFranceConnectBloc ? 'fr-col-md-3' : 'fr-col-md-4']"
      >
        <NakedCard class="h-100">
          <span class="material-icons text-green md-48">check_circle</span>
          <p>{{ $t("tax-ok") }}</p>
        </NakedCard>
      </div>
      <div
        class="fr-col-12 "
        :class="[displayFranceConnectBloc ? 'fr-col-md-3' : 'fr-col-md-4']"
      >
        <NakedCard class="h-100">
          <span class="material-icons text-green md-48">check_circle</span>
          <p>{{ $t("file-verified") }}</p>
        </NakedCard>
      </div>
      <div v-if="displayFranceConnectBloc" class="fr-col-12 fr-col-md-3">
        <NakedCard class="h-100 fc">
          <div class="icon-fc text-fc blue-text ">
            FranceConnect
          </div>
          <p>{{ $t("france-connect-user") }}</p>
        </NakedCard>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import NakedCard from "df-shared/src/components/NakedCard.vue";

@Component({
  components: {
    NakedCard
  }
})
export default class FileReinsurance extends Vue {
  @Prop({ default: false }) displayFranceConnectBloc?: boolean;
}
</script>

<style lang="scss">
.text-green {
  color: green;
}
.h-100 {
  height: 100%;
  &.fc {
    background-color: var(--bf200-bf300);
  }
}
.icon-fc {
  font-size: 20px;
  &:before {
    content: url("../assets/images/icons/franceconnect-icon.png");
    padding: 0 10px 0 0;
    vertical-align: calc(50% - 20px);
  }
}
</style>

<i18n>
{
	"en": {
		"all-documents": "The file contains the required documents",
		"tax-ok": "The tax notice is authenticated (if there is one)",
		"file-verified": "The parts are consistent and have been reviewed manually by our agents",
		"verified-title": "This file has been verified by DossierFacile !",
		"know-more": "Know more about DossierFacile",
		"france-connect-user": "At least one candidate has been authenticated from FranceConnect identity provider"
	},
	"fr": {
		"all-documents": "Le dossier contient les pièces requises",
		"tax-ok": "L'avis d'imposition est authentifié (s'il y en a un)",
		"file-verified": "Les pièces sont cohérentes et ont été revues manuellement par nos agents",
		"verified-title": "Ce dossier a été vérifié par DossierFacile !",
		"know-more": "En savoir plus sur DossierFacile",
		"france-connect-user": "Au moins un candidat a été authentifié via une identification FranceConnect"
	}
}
</i18n>
