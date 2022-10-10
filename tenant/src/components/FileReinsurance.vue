<template>
  <div>
    <span class="fr-h5 fr-mr-3w">{{
      $t("title-dossier-" + dossierStatus)
    }}</span
    ><a href="https://www.dossierfacile.fr" target="_blank" rel="noreferrer">{{
      $t("know-more")
    }}</a>
    <div class="fr-grid-row fr-grid-row--gutters fr-mt-3w">
      <div class="fr-col-12 fr-col-md-3">
        <NakedCard class="h-100">
          <span
            v-if="dossierStatus == 'VALIDATED'"
            class="material-icons text-green md-48"
            >check_circle</span
          >
          <span
            v-else-if="dossierStatus == 'TO_PROCESS'"
            class="fr-mb-2w material-icons-outlined bloc-warning-icon status-toprocess"
          >
            schedule
          </span>
          <span
            v-else
            class="fr-mb-2w material-icons-outlined bloc-warning-icon status-incomplete"
          >
            report_gmailerrorred
          </span>

          <p>{{ $t("documents-" + dossierStatus) }}</p>
        </NakedCard>
      </div>
      <div class="fr-col-12 fr-col-md-3">
        <NakedCard class="h-100">
          <span
            v-if="dossierStatus == 'VALIDATED'"
            class="material-icons text-green md-48"
            >check_circle</span
          >
          <span
            v-else-if="dossierStatus == 'TO_PROCESS'"
            class="fr-mb-2w material-icons-outlined bloc-warning-icon status-toprocess"
          >
            schedule
          </span>
          <span
            v-else
            class="fr-mb-2w material-icons-outlined bloc-warning-icon status-incomplete"
          >
            report_gmailerrorred
          </span>
          <p>{{ $t("file-" + dossierStatus) }}</p>
        </NakedCard>
      </div>
      <div v-if="taxChecked" class="fr-col-12 fr-col-md-3">
        <NakedCard class="h-100 fc">
          <div class="card-logo-container">
            <img
              src="../assets/images/icons/dgfip-icon.png"
              alt="Logo DGFIP"
              class="icon-dgfip"
            />
          </div>
          <p>
            {{ $t("tax-checked") }}
          </p>
        </NakedCard>
      </div>
      <div v-if="franceConnectTenantCount > 0" class="fr-col-12 fr-col-md-3">
        <NakedCard class="h-100 fc">
          <div class="fr-mb-0-5w icon-fc text-fc blue-text">FranceConnect</div>
          <p v-if="tenantCount === 1">
            {{ $t("france-connect-user") }}
          </p>
          <p v-else-if="franceConnectTenantCount === tenantCount">
            {{ $t("france-connect-user-all") }}
          </p>
          <p v-else>
            {{ $t("france-connect-user-partial", [franceConnectTenantCount]) }}
          </p>
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
  @Prop() dossierStatus!: string;
  @Prop() taxDocumentStatus!: string;
  @Prop({ default: 0 }) franceConnectTenantCount?: number;
  @Prop({ default: 0 }) tenantCount?: number;
  @Prop({ default: false }) taxChecked?: boolean;
}
</script>

<style scoped lang="scss">
@import "df-shared/src/scss/_variables.scss";

.text-green {
  color: green;
}

.h-100 {
  height: 100%;
  &.fc {
    background-color: var(--bf200-bf300);
  }
}
.bloc-warning-icon {
  font-size: 24px;
  height: 44px;
  width: 44px;
  border-style: solid;
  border-width: 1px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  &.status-incomplete {
    color: var(--error-425-625);
    background-color: var(--brown-cafe-creme-975-75);
  }
  &.status-toprocess {
    color: var(--purple-text);
    background-color: var(--purple-background);
  }
}

.icon-fc {
  font-size: 20px;
  &:before {
    content: url("../assets/images/icons/franceconnect-icon.png");
    padding: 0 10px 0 0;
    vertical-align: calc(50% - 30px);
  }
}

.icon-dgfip {
  margin: auto;
  height: 50px;
}

.card-logo-container {
  height: 55px;
}
</style>

<i18n>
{
	"en": {
    "documents-VALIDATED": "The file contains the required documents",
    "documents-TO_PROCESS": "Documents are currently under review",
    "documents-DECLINED": "Still waiting required documents",
    "documents-INCOMPLETE": "Still waiting required documents",
    "tax-to_process": "Tax notice currently under review",
    "tax-nok": "Tax notice cannot be reviewed",
    "file-VALIDATED": "The parts are consistent and have been reviewed manually by our agents",
    "file-TO_PROCESS": "Files are currently in review",
    "file-DECLINED": "Files will be currently review after file completion",
    "file-INCOMPLETE": "Files will be currently review after file completion",
		"title-dossier-VALIDATED": "This file has been verified by DossierFacile !",
    "title-dossier-DECLINED": "This file is incompleted",
    "title-dossier-TO_PROCESS": "This is currently in progress",
		"know-more": "Know more about DossierFacile",
		"france-connect-user": "Candidate identity has been certified by a FranceConnect authentication.",
    "france-connect-user-all": "Candidates identities have been certified by FranceConnect authentications.",
    "france-connect-user-partial": "Identity of {0} candidate(s) has been certified by a FranceConnect authentication.",
    "tax-checked": "Tax income certified with the tax services"
	},
	"fr": {
    "documents-VALIDATED": "Le dossier contient les pièces requises",
    "documents-TO_PROCESS": "Les pièces du dossier sont en cours de vérification",
    "documents-DECLINED": "Le dossier ne contient pas encore les pièces requises",
    "documents-INCOMPLETE": "Le dossier ne contient pas encore les pièces requises",
    "tax-to_process": "L'avis d'imposition est en cours de vérification",
    "tax-nok": "L'avis d'imposition n'a pas pu être vérifié",
		"file-VALIDATED": "Les pièces sont cohérentes et ont été revues manuellement par nos agents",
    "file-TO_PROCESS": "Nos agents s'assurent de la cohérence de l'ensemble des pièces justificatives",
    "file-DECLINED": "Les pièces seront revues manuellement par nos agents une fois le dossier complété",
    "file-INCOMPLETE": "Les pièces seront revues manuellement par nos agents une fois le dossier complété",
    "title-dossier-VALIDATED": "Ce dossier a été vérifié par DossierFacile !",
    "title-dossier-DECLINED": "Ce dossier est, pour l'heure, incomplet !",
    "title-dossier-TO_PROCESS": "Ce dossier est en cours de vérification par DossierFacile !",
		"know-more": "En savoir plus sur DossierFacile",
    "france-connect-user": "L'identité du candidat a été certifiée via une authentification FranceConnect.",
    "france-connect-user-all": "L'identité des candidats a été certifiée via une authentification FranceConnect.",
    "france-connect-user-partial": "L'identité de {0} candidat(s) a été certifiée via une authentification FranceConnect.",
    "tax-checked": "Revenu fiscal certifié auprès des services des impôts"
	}
}
</i18n>
