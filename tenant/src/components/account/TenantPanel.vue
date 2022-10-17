<template>
  <div>
    <div class="main-information">
      <h3 class="fr-h4">{{ $t("my-personnal-information") }}</h3>
      <div class="fr-grid-row fr-grid-row--gutters">
        <InfoCard
          :title="$t('my-information')"
          editable="true"
          matIcon="person"
          @click="gotoTenantName()"
        >
          <div class="name-email-tile">
            {{ tenant | fullName }}<br />
            {{ tenant ? tenant.email : "" }}
          </div>
        </InfoCard>
      </div>
      <hr class="fr-mt-4w" />
      <h3 class="fr-h4">{{ $t("my-files") }}</h3>

      <div class="fr-grid-row fr-grid-row--gutters">
        <InfoCard
          :title="$t('identification')"
          editable="true"
          matIcon="person"
          @click="setTenantStep(1)"
        >
          <ColoredTag
            :status="getStatus('IDENTIFICATION')"
            :text="$t('s_' + getStatus('IDENTIFICATION'))"
          ></ColoredTag>
        </InfoCard>
        <InfoCard
          :title="$t('residency')"
          editable="true"
          matIcon="home"
          @click="setTenantStep(2)"
        >
          <ColoredTag
            :status="getStatus('RESIDENCY')"
            :text="$t('s_' + getStatus('RESIDENCY'))"
          ></ColoredTag>
        </InfoCard>
        <InfoCard
          :title="$t('professional')"
          editable="true"
          matIcon="work"
          @click="setTenantStep(3)"
        >
          <ColoredTag
            :status="getStatus('PROFESSIONAL')"
            :text="$t('s_' + getStatus('PROFESSIONAL'))"
          ></ColoredTag>
        </InfoCard>
        <InfoCard
          :title="$t('financial')"
          editable="true"
          matIcon="euro"
          @click="setTenantStep(4)"
        >
          <ColoredTag
            :status="getStatus('FINANCIAL')"
            :text="$t('s_' + getStatus('FINANCIAL'))"
          ></ColoredTag>
        </InfoCard>
        <InfoCard
          :title="$t('tax')"
          editable="true"
          matIcon="content_copy"
          @click="setTenantStep(5)"
        >
          <ColoredTag
            :status="getStatus('TAX')"
            :text="$t('s_' + getStatus('TAX'))"
          ></ColoredTag>
        </InfoCard>
      </div>
    </div>

    <GuarantorsSection :tenant="tenant"/>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { ValidationObserver, ValidationProvider } from "vee-validate";
import { User } from "df-shared/src/models/User";
import { DfDocument } from "df-shared/src/models/DfDocument";
import DfButton from "df-shared/src/Button/Button.vue";
import ColoredTag from "df-shared/src/components/ColoredTag.vue";
import { AnalyticsService } from "@/services/AnalyticsService";
import { extend } from "vee-validate";
import { required } from "vee-validate/dist/rules";
import DeleteAccount from "@/components/DeleteAccount.vue";
import GuarantorsSection from "@/components/account/GuarantorsSection.vue";
import PartnersSection from "@/components/account/PartnersSection.vue";
import InfoCard from "@/components/account/InfoCard.vue";

extend("required", {
  ...required,
  message: "Ce champ est requis"
});

@Component({
  components: {
    InfoCard,
    PartnersSection,
    GuarantorsSection,
    ValidationProvider,
    ValidationObserver,
    DfButton,
    ColoredTag,
    DeleteAccount
  },
  computed: {}
})
export default class TenantPanel extends Vue {
  @Prop() tenant!: User;
  @Prop({ default: false }) isCotenant!: boolean;

  getStatus(docType: string) {
    if (docType === "FINANCIAL") {
      const docs = this.tenant.documents?.filter(d => {
        return d.documentCategory === "FINANCIAL";
      });
      return this.isFinancialValid(docs || []);
    }
    const doc = this.tenant.documents?.find((d: DfDocument) => {
      return d.documentCategory === docType;
    });
    return doc?.documentStatus || "EMPTY";
  }

  isFinancialValid(docs: DfDocument[]) {
    if (!docs || docs.length === 0) {
      return "INCOMPLETE";
    }

    for (const doc of docs) {
      if (!doc.noDocument && (doc.files?.length || 0) <= 0) {
        return "INCOMPLETE";
      }
    }

    for (const doc of docs) {
      if (doc.documentStatus === "DECLINED") {
        return "DECLINED";
      }
    }

    for (const doc of docs) {
      if (doc.documentStatus === "TO_PROCESS") {
        return "TO_PROCESS";
      }
    }

    return "VALIDATED";
  }

  gotoTenantName() {
    if (this.isCotenant) {
      this.$router.push({
        name: "CoTenantDocuments",
        params: {
          tenantId: this.tenant?.id.toString(),
          step: "4",
          substep: "0"
        }
      });
    } else {
      this.$router.push({ name: "TenantName" });
    }
  }

  setTenantStep(n: number) {
    AnalyticsService.editFromAccount(n);
    if (this.isCotenant) {
      this.$router.push({
        name: "CoTenantDocuments",
        params: {
          tenantId: this.tenant?.id.toString(),
          step: "4",
          substep: n.toString()
        }
      });
    } else {
      this.$router.push({
        name: "TenantDocuments",
        params: { substep: n.toString() }
      });
    }
  }
}
</script>

<style scoped lang="scss">
.main-bar {
  display: flex;
}

.main {
  background-color: var(--background-default-grey);
}

.bg-blue {
  width: 100%;
  background-color: var(--bf100-g750);
}

.fr-callout-white {
  background-color: var(--background-default-grey);
  &.warning {
    box-shadow: inset 0.25rem 0 0 0 var(--error) !important;
  }
}

h1 {
  color: var(--bf500);
  font-size: 2rem;
}

h2 {
  color: var(--bf500);
  font-size: 2rem;
}

.align--center {
  text-align: center;
  margin: auto;
}

.bg-white {
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);
  border-radius: 10px;
  background: var(--background-default-grey);
}

.fr-btn.delete-btn {
  background-color: var(--error);
  --color-hover: rgba(246, 0, 0, 0.5);
  --color-active: rgba(255, 91, 91, 0.5);
}

.grp {
  display: block;
  position: relative;
}

.grp-btn {
  border-left: 1px solid var(--background-default-grey);
  position: relative;
}

.grp-modal {
  position: absolute;
  border-radius: 5px;
  right: 0;
  left: auto;
  width: max-content;
  z-index: 2;
  padding: 1rem;
  width: 330px;

  @media all and (max-width: 768px) {
    max-width: 300px;
  }

  &:before {
    top: -16px;
    right: 9px;
    left: auto;
    border: 8px solid transparent;
    border-bottom: 8px solid var(--color-border-overlay);
    position: absolute;
    display: inline-block;
    content: "";
  }
}

.copy-btn {
  max-width: 100%;
  > button {
    width: 100%;
    text-align: justify;
    border-radius: 0.25rem;
    padding: 1rem;
    font-size: 1rem;
    box-shadow: 0 0.5px 4px 0 #cecece;
    border: 1px solid transparent;

    -webkit-transition: all 0.5s linear;
    -moz-transition: all 0.5s linear;
    -o-transition: all 0.5s linear;
    transition: all 0.5s linear;

    &:hover {
      box-shadow: none;
      border: 1px solid var(--primary);
      box-shadow: 0 0.5px 4px 0 transparent;
      background-image: none;
    }

    &.copied {
      color: var(--primary);
      background-color: var(--background-action-low-blue-france);
      border: 1px solid var(--primary);
      box-shadow: 0 0.5px 4px 0 transparent;
      -webkit-transition: all 0.5s linear;
      -moz-transition: all 0.5s linear;
      -o-transition: all 0.5s linear;
      transition: all 0.5s linear;
    }
  }
}

p {
  word-break: break-word;
}

.edit-btn {
  position: absolute;
  right: 0;
  top: 0;

  box-shadow: none;
}

.description:first-letter {
  text-transform: uppercase;
}

.material-icons.md-adapt {
  font-size: 48px;
}

.header-title {
  display: flex;
  justify-content: center;
  align-items: center;
}

hr {
  border: 0;
  margin-left: 20%;
  margin-right: 20%;
  border-top: 1px solid var(--g400);
}

.fr-tile__body {
  overflow: auto;
}

.cleana {
  &:after {
    content: none;
  }
  &:focus {
    outline-style: auto;
    outline-width: 2px;
    outline-offset: 4px;
    outline-color: #0a76f6;
  }
}

.alert-container {
  display: flex;
  flex-direction: row-reverse;
}

.red-alert {
  background-color: var(--error);
  color: white;
  border-radius: 2px;
  margin-right: 0;
  margin-left: auto;
  padding: 0.5rem;
}

.name-email-tile {
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
}

.dflex {
  display: flex;
  align-items: center;
}

.mobile-margin {
  @media all and (max-width: 768px) {
    margin-bottom: 1rem;
  }
}

.btn-container {
  margin-left: auto;

  @media all and (max-width: 600px) {
    width: 100%;
  }
}

.main-copy-btn {
  height: 2.5rem;
  @media all and (max-width: 600px) {
    flex: 1;
  }
}

.share-file-description {
  max-width: fit-content;
}
</style>

<i18n>
  {
    "en": {
      "title": "Hello {0}, your file {1}",
      "status-description":"{0}, you are {1}, {2} and {3}.<br>if your situation has changed, please update your documents !",
      "last-update": "Dernière mise à jour du dossier le {0}",
      "file-update-title": "File update",
      "file-update-text": "Vous avez mis à jour votre dossier, pour la dernière fois le {0}.<br> Afin qu'il reste convaincant, il est important de maintenir à jour vos justificatifs.",
      "update-file-btn": "Update my documents",
      "copy-link":"Copy my file link",
      "share-by-mail": "Share by mail",
      "my-file": "My rent file",
      "my-personnal-information": "My personnal information",
      "my-information": "My information",
      "my-files": "My documents",
      "identification": "Identification",
      "residency": "Residency",
      "professional": "Professional",
      "financial": "Financial",
      "tax": "Tax",
      "s_TO_PROCESS":"To process",
      "s_VALIDATED":"Validated",
      "s_DECLINED":"Declined",
      "s_INCOMPLETE":"Incomplete",
      "s_EMPTY": "Empty",
      "TO_PROCESS":"to process",
      "VALIDATED":"is validated",
      "DECLINED":"is declined",
      "INCOMPLETE":"is incomplete",
      "delete": "Deletion of my account",
      "opinion": "Tell us about your experience DossierFacile.fr",
      "delete-account": "Delete my account",
      "share-file": "Share my file",
      "share-file-description": "Copy your link-file to share it! It's up to you to send it to the owners of your choice (by email, sms, etc.)",
      "file-resume": "Share resumed file <br>(without supporting document)",
      "file-full": "Share full file <br>(with supporting document)",
      "copy": "Copy",
      "field-required": "This field is required",
      "CDI": "CDI",
      "CDI_TRIAL": "CDI (période d’essai)",
      "CDD": "CDD",
      "ALTERNATION": "Alternance",
      "INTERNSHIP": "Stage",
      "STUDENT": "Études",
      "PUBLIC": "Fonction publique",
      "CTT": "CTT (intérimaire)",
      "RETIRED": "Retraité",
      "UNEMPLOYED": "Chômage",
      "INDEPENDENT": "Indépendant",
      "OTHER": "Autre",
      "no-income": "have no income",
      "income": "have a monthly income of {0}€",
      "copied": "Copied !",
      "ALONE": "alone",
      "couple-with": "in relationship with {0}",
      "someone": " someone",
      "group-with": "in flatsharing with {0}",
      "group-with-someone": "in flatsharing",
      "cotenant-cannot-copy-link": "Your link is inactive because your roommate's file has not yet been validated",
      "spouse-cannot-copy-link": "Your link is inactive because your spouse's file has not yet been validated",
      "amendment-required-title": "Amendment required",
      "amendment-required-text": "After examining your file, modifications are requested. <br> Check your mailbox for details.",
      "messaging": "Messaging",
      "instructional-time-title": "Instructional time",
      "instructional-time-text": "Once the files are completed, they are taken care of on average in less than 24 hours by our team of operators.",
      "congratulations-title": "🎉 Congratulations! Your DossierFacile becomes available!",
      "congratulations-text-1": "In order to apply for the accommodation of your dreams, send your DossierFacile link, by email, SMS, etc. to owners, lessors… of your choice. As a reminder, DossierFacile does not offer accommodation.",
      "congratulations-text-2": "Your data is protected!",
      "full-link-copied": "The link of my complete file is copied!",
      "public-link-copied": "The link of my summary file is copied!"
    },
    "fr": {
      "title": "Bonjour {0}, votre dossier {1} !",
      "status-description":"{0}, vous avez indiqué être {1}, {2} et {3}.<br>Si votre situation a changé, mettez à jour vos documents !",
      "last-update": "Dernière mise à jour du dossier le {0}",
      "file-update-title": "Mise à jour de votre dossier",
      "file-update-text": "Vous avez mis à jour votre dossier, pour la dernière fois le {0}.<br> Afin qu'il reste convaincant, il est important de maintenir à jour vos justificatifs.",
      "update-file-btn": "Mettre à jour mes documents",
      "copy-link":"Copier mon lien dossier",
      "share-by-mail": "Partager par mail",
      "my-file": "Mon dossier de location",
      "my-personnal-information": "Mes informations personnelles",
      "my-information": "Mes informations",
      "my-files": "Mes pièces justificatives",
      "identification": "Pièce d'identité",
      "residency": "Justificatif de domicile",
      "professional": "Justificatif de situation professionnelle",
      "financial": "Justificatif de ressources",
      "tax": "Avis d’imposition",
      "s_TO_PROCESS":"En cours de traitement",
      "s_VALIDATED":"Vérifié",
      "s_DECLINED":"Modification demandée",
      "s_INCOMPLETE":"Non terminé",
      "s_EMPTY": "Document manquant",
      "TO_PROCESS":"est en cours de traitement",
      "VALIDATED":"est vérifié",
      "DECLINED":"nécessite une modification",
      "INCOMPLETE":"est non terminé",
      "delete": "Suppression de mon compte",
      "opinion": "Racontez-nous votre expérience DossierFacile.fr",
      "delete-account": "Supprimer mon compte",
      "share-file": "Partager mon dossier",
      "share-file-description": "Copiez votre lien-dossier pour le partager ! À vous de l'envoyer aux propriétaires ou bailleurs de votre choix (par mail, SMS, etc.)",
      "file-resume": "Partager mon dossier de synthèse <br>(sans pièce justificative)",
      "file-full": "Partager mon dossier complet<br>(avec pièces justificatives)",
      "copy": "Copier",
      "field-required": "Ce champ est requis",
      "CDI": "en CDI",
      "CDI_TRIAL": "en CDI (période d’essai)",
      "CDD": "en CDD",
      "ALTERNATION": "en alternance",
      "INTERNSHIP": "en stage",
      "STUDENT": "étudiant·e",
      "PUBLIC": "dans la fonction publique",
      "CTT": "en CTT (intérimaire)",
      "RETIRED": "retraité",
      "UNEMPLOYED": "au chômage",
      "INDEPENDENT": "indépendant",
      "OTHER": "Autre",
      "no-income": "ne pas avoir de revenu",
      "income": "avoir un revenu net mensuel de {0}€",
      "copied": "Copié !",
      "ALONE": "seul·e",
      "couple-with": "en couple avec {0}",
      "group-with": "en colocation avec {0}",
      "group-with-someone": "en colocation",
      "someone": " quelqu'un",
      "spouse-cannot-copy-link": "Votre lien est inactif car le dossier de votre conjoint·e n'est pas encore validé",
      "cotenant-cannot-copy-link": "Votre lien est inactif car le dossier de votre(vos) colocataire(s) n'est pas encore validé",
      "amendment-required-title": "Modifications demandées",
      "amendment-required-text": "Après examen de votre dossier, des modifications vous sont demandées. <br>Consultez votre messagerie pour en connaître le détail.",
      "messaging": "Consulter ma messagerie",
      "instructional-time-title": "Durée d'instruction",
      "instructional-time-text": "Une fois votre dossier complété et déposé, il est pris en charge dans un délai de 24 à 48 heures par notre équipe d'opérateurs.",
      "congratulations-title": "🎉 Félicitations ! Votre DossierFacile est disponible !",
      "congratulations-text-1": "Afin de candidater au logement de vos rêves, envoyez votre lien DossierFacile, par email, SMS, etc. aux propriétaires, bailleurs de votre choix. Pour rappel, DossierFacile ne propose pas de logement.",
      "congratulations-text-2": "Vos informations sont protégées !",
      "full-link-copied": "Le lien de mon dossier complet est copié !",
      "public-link-copied": "Le lien de mon dossier de synthèse est copié !"
    }
  }
  </i18n>
