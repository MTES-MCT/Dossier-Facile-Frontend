<template>
  <div>
    <div>
      <label class="rf-label" for="select">
        Votre situation professionnelle actuelle :
      </label>
      <select
        v-model="professionalDocument"
        class="rf-select"
        id="select"
        name="select"
      >
        <option value="" selected disabled hidden>- Select -</option>
        <option v-for="d in documents" :value="d" :key="d.key">{{
          $t(d.key)
        }}</option>
      </select>
    </div>
    <div v-if="professionalDocument.key">
      <div class="rf-margin-bottom-3N">
        {{ professionalDocument.explanationText }}
      </div>
      <div class="rf-margin-bottom-3N">
        <FileUpload></FileUpload>
      </div>
      <div class="rf-margin-bottom-3N">
        <DocumentInsert
          :allow-list="professionalDocument.acceptedProofs"
          :block-list="professionalDocument.refusedProofs"
        ></DocumentInsert>
      </div>
    </div>
    <div class="rf-col-12 rf-margin-bottom-5N">
      <button class="rf-btn" type="submit" :disabled="!professionalDocument">
        Enregistrer la pièce
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import DocumentInsert from "@/components/DocumentInsert.vue";
import FileUpload from "@/components/uploads/FileUpload.vue";
import { mapState } from "vuex";
import { DocumentType } from "df-shared/src/models/Document";

@Component({
  components: { DocumentInsert, FileUpload },
  computed: {
    ...mapState({
      user: "user",
      currentStep: "currentStep"
    })
  }
})
export default class Professional extends Vue {
  professionalDocument = new DocumentType();
  documents: DocumentType[] = [
    {
      key: "cdi",
      value: "CDI",
      explanationText:
        "J’ajoute mon contrat de travail en cours, complet et signé.\n" +
        "Et si vous n’avez pas de contrat de travail ? Vous pouvez joindre une attestation de votre employeur signée et datée de moins de 3 mois.",
      acceptedProofs: [
        "Contrat de travail en cours, complet, daté et signé",
        "Attestation de votre employeur de moins de 3 mois précisant l'emploi et la rémunération proposée et la date d'entrée en fonctions"
      ],
      refusedProofs: [
        "Courrier/mail de confirmation d’embauche",
        "Bulletins de salaire",
        "Relevés de comptes bancaires"
      ]
    },
    {
      key: "cdi-trial",
      value: "CDI_TRIAL",
      explanationText:
        "J’ajoute mon contrat de travail en cours, complet et signé.\n" +
        "Et si vous n’avez pas de contrat de travail ? Vous pouvez joindre une attestation de votre employeur signée et datée de moins de 3 mois.",
      acceptedProofs: [
        "Contrat de travail en cours, complet, daté et signé",
        "Attestation de votre employeur de moins de 3 mois précisant l'emploi et la rémunération proposée, la date d'entrée en fonctions envisagée et la durée de la période d'essai."
      ],
      refusedProofs: [
        "Courrier/mail de confirmation d’embauche",
        "Bulletins de salaire",
        "Relevés de comptes bancaires"
      ]
    },
    {
      key: "cdd",
      value: "CDD",
      explanationText:
        "J’ajoute mon contrat de travail en cours, complet et signé.\n" +
        "Et si vous n’avez pas de contrat de travail ? Vous pouvez joindre une attestation de votre employeur signée et datée de moins de 3 mois.",
      acceptedProofs: [
        "Contrat de travail en cours, complet, daté et signé",
        "Attestation de votre employeur de moins de 3 mois précisant l'emploi et la rémunération proposée, la date d'entrée en fonctions et la durée du contrat"
      ],
      refusedProofs: [
        "Courrier/mail de confirmation d’embauche",
        "Bulletins de salaire",
        "Relevés de comptes bancaires"
      ]
    },
    {
      key: "alternation",
      value: "ALTERNATION",
      explanationText:
        "J’ajoute mon contrat d’alternance en cours, complet et signé.",
      acceptedProofs: [
        "Contrat d’alternance",
        "Contrat de professionnalisation"
      ],
      refusedProofs: ["Certificat de scolarité"]
    },
    {
      key: "internship",
      value: "INTERNSHIP",
      explanationText:
        "J’ajoute ma convention de stage en cours, complète et signée.",
      acceptedProofs: ["Convention de stage"],
      refusedProofs: ["Certificat de scolarité"]
    },
    {
      key: "student",
      value: "STUDENT",
      explanationText:
        "J’ajoute une copie de ma carte d’étudiant ou un certificat de scolarité pour l’année en cours.",
      acceptedProofs: [
        "Carte d'étudiant ou certificat de scolarité pour l'année en cours"
      ],
      refusedProofs: [
        "Courrier/mail de confirmation d’inscription",
        "Attestation de paiement CVEC",
        "Bulletin scolaire"
      ]
    },
    {
      key: "public",
      value: "PUBLIC",
      explanationText: "J’ajoute un arrêté de nomination.",
      acceptedProofs: [
        "Arrêté de nomination",
        "Attestation de votre employeur"
      ],
      refusedProofs: ["Bulletins de salaire", "Relevés de comptes bancaires"]
    },
    {
      key: "ctt",
      value: "CTT",
      explanationText:
        "J’ajoute mon contrat de travail en cours, complet et signé.\n" +
        "Et si vous n’avez pas de contrat de travail ? Vous pouvez joindre une attestation de votre employeur signée et datée de moins de 3 mois.",
      acceptedProofs: [
        "Contrat de travail complet daté et signé",
        "Attestation de votre employeur précisant l'emploi et la rémunération proposée, la date d'entrée en fonctions envisagée et la durée du contrat"
      ],
      refusedProofs: ["Bulletins de salaire", "Relevés de comptes bancaires"]
    },
    {
      key: "retired",
      value: "RETIRED",
      explanationText:
        "J’ajoute un bulletin de pension retraite. Et si vous n’en avez pas? Vous pouvez joindre votre dernier avis d’imposition complet de moins de 2 ans.",
      acceptedProofs: [
        "Bulletin de pension retraite",
        "Attestation de droit à une pension",
        "Titre de pension de retraite",
        "Avis d’imposition complet de moins de 2 ans"
      ],
      refusedProofs: ["Relevés de comptes bancaires"]
    },
    {
      key: "unemployed",
      value: "UNEMPLOYED",
      explanationText:
        "J’ajoute une attestation d’ouverture de droits à l’ARE ou un avis de situation Pôle Emploi de moins de 3 mois.",
      acceptedProofs: [
        "Attestation d’ouverture de droits à l’ARE",
        "Avis de situation Pôle Emploi de moins de 3 mois"
      ],
      refusedProofs: [
        "Attestation de versement de paiement de cotisations sociales"
      ]
    },
    {
      key: "independent",
      value: "INDEPENDENT",
      explanationText:
        "J’ajoute mon justificatif d’activité professionnelle indépendante en fonction de mon type d’activité.",
      acceptedProofs: [
        "Certificat d'identification de l'Insee comportant les numéros d'identification",
        "Attestation d’inscription au statut d’auto-entrepreneur",
        "Carte professionnelle (profession libérale)",
        "Extrait D1 original du registre des métiers de moins de 3 mois (artisan)",
        "Extrait K ou K bis du registre du commerce et des sociétés de moins de 3 mois (commerçant)"
      ],
      refusedProofs: ["Relevés de comptes bancaires"]
    },
    {
      key: "other",
      value: "OTHER",
      explanationText:
        "J’ajoute un document de moins de 3 mois justifiant de mon activité professionnelle.",
      acceptedProofs: [
        "Attestation d’ouverture de droit AAH (adulte en situation de handicap)",
        "Attestation d’ouverture des droits au RSA (mère/père au foyer)",
        "Toute pièce de moins de 3 mois attestant de l'activité professionnelle (autres cas d’activité)",
        "Déclaration de non-activité si vous êtes sans activité"
      ],
      refusedProofs: ["Relevés de comptes bancaires"]
    }
  ];
}
</script>

<style scoped lang="scss"></style>

<i18n>
{
"en": {
"cdi": "CDI",
"cdi-trial": "CDI (période d'essai)",
"cdd": "CDD",
"alternation": "Alternance",
"internship": "Stage",
"student": "Études",
"public": "Fonction publique",
"ctt": "CTT (intérimaire)",
"retired": "Retraité",
"unemployed": "Chômage",
"independent": "Indépendant",
"other": "Autre"
},
"fr": {
"cdi": "CDI",
"cdi-trial": "CDI (période d'essai)",
"cdd": "CDD",
"alternation": "Alternance",
"internship": "Stage",
"student": "Études",
"public": "Fonction publique",
"ctt": "CTT (intérimaire)",
"retired": "Retraité",
"unemployed": "Chômage",
"independent": "Indépendant",
"other": "Autre"
}
}
</i18n>
