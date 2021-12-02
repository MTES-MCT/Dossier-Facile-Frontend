<template>
  <div>
    <span class="fr-h5 fr-mr-3w">{{ $t("verified-title") }}</span
    ><a href="https://www.dossierfacile.fr" target="_blank" rel="noreferrer">{{
      $t("know-more")
    }}</a>
    <div class="fr-grid-row fr-grid-row--gutters space-between fr-mt-3w">
      <div class="fr-col-12 fr-col-md-4">
        <NakedCard class="h-100">
          <span class="material-icons text-green md-48">check_circle</span>
          <p>{{ $t("all-documents") }}</p>
        </NakedCard>
      </div>
      <div class="fr-col-12 fr-col-md-4">
        <NakedCard class="h-100">
          <span class="material-icons text-green md-48">check_circle</span>
          <p>{{ $t("tax-ok") }}</p>
        </NakedCard>
      </div>
      <div class="fr-col-12 fr-col-md-4">
        <NakedCard class="h-100">
          <span class="material-icons text-green md-48">check_circle</span>
          <p>{{ $t("file-verified") }}</p>
        </NakedCard>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import NakedCard from "df-shared/src/components/NakedCard.vue";

@Component({
  components: {
    NakedCard
  }
})
export default class FileReinsurance extends Vue {}
</script>

<style lang="scss">
.text-green {
  color: green;
}
.h-100 {
  height: 100%;
}
</style>

<i18n>
{
	"en": {
		"all-documents": "The file contains the required documents",
		"tax-ok": "The tax notice is authenticated (if there is one)",
		"file-verified": "The parts are consistent and have been reviewed manually by our agents",
		"verified-title": "This file has been verified by DossierFacile !",
		"know-more": "Know more about DossierFacile"
	},
	"fr": {
		"all-documents": "Le dossier contient les pièces requises",
		"tax-ok": "L'avis d'imposition est authentifié (s'il y en a un)",
		"file-verified": "Les pièces sont cohérentes et ont été revues manuellement par nos agents",
		"verified-title": "Ce dossier a été vérifié par DossierFacile !",
		"know-more": "En savoir plus sur DossierFacile"
	}
}
</i18n>
