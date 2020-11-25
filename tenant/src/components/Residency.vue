<template>
  <div>
    <div>
      <label class="rf-label" for="select">
        Votre situation d'hébergement actuelle :
      </label>
      <select
        v-model="user.residency"
        class="rf-select"
        id="select"
        name="select"
      >
        <option value="" selected disabled hidden>- Select -</option>
        <option value="TENANT">{{ $t("tenant") }}</option>
        <option value="OWNER">{{ $t("owner") }}</option>
        <option value="GUEST">{{ $t("guest") }}</option>
        <option value="GUEST_PARENTS">{{ $t("guest-parents") }}</option>
      </select>
    </div>
    <div v-if="user.residency === 'TENANT'">
      <div class="rf-margin-bottom-3N">
        J’ajoute mes quittances de loyer pour les trois derniers mois.
      </div>
      <div class="rf-margin-bottom-3N">
        <FileUpload></FileUpload>
      </div>
      <div class="rf-margin-bottom-3N">
        <DocumentInsert
          :allow-list="tenantAllowList"
          :block-list="tenantBlockList"
        ></DocumentInsert>
      </div>
    </div>
    <div v-if="user.residency === 'OWNER'">
      <div class="rf-margin-bottom-3N">
        J’ajoute un avis de taxe foncière de moins d’un an.
      </div>
      <div class="rf-margin-bottom-3N">
        <FileUpload></FileUpload>
      </div>
      <div class="rf-margin-bottom-3N">
        <DocumentInsert
          :allow-list="ownerAllowList"
          :block-list="ownerBlockList"
        ></DocumentInsert>
      </div>
    </div>
    <div v-if="user.residency === 'GUEST'">
      <div class="rf-margin-bottom-3N">
        J’ajoute une attestation sur l’honneur d’hébergement à titre gratuit,
        une copie de la pièce d’identité et un justificatif de domicile de mon
        hébergeant (une facture suffit). Vous pouvez utiliser un modèle en ligne
        sur le site service-public.fr
      </div>
      <div class="rf-margin-bottom-3N">
        <FileUpload></FileUpload>
      </div>
      <div class="rf-margin-bottom-3N">
        <DocumentInsert
          :allow-list="guestAllowList"
          :block-list="guestBlockList"
        ></DocumentInsert>
      </div>
    </div>
    <div v-if="user.residency === 'GUEST_PARENTS'">
      <div class="rf-margin-bottom-3N">
        J’ajoute une attestation sur l’honneur d’hébergement à titre gratuit,
        une copie de la pièce d’identité et un justificatif de domicile du
        parent (une facture suffit). Vous pouvez utiliser un modèle en ligne sur
        le site service-public.fr
      </div>
      <div class="rf-margin-bottom-3N">
        <FileUpload></FileUpload>
      </div>
      <div class="rf-margin-bottom-3N">
        <DocumentInsert
          :allow-list="guestParentsAllowList"
          :block-list="guestParentsBlockList"
        ></DocumentInsert>
      </div>
    </div>
    <div class="rf-col-12 rf-margin-bottom-5N">
      <button class="rf-btn" type="submit" :disabled="!user.residency">
        Enregistrer la pièce
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { mapState } from "vuex";
import DocumentInsert from "@/components/DocumentInsert.vue";
import FileUpload from "@/components/uploads/FileUpload.vue";

@Component({
  components: { DocumentInsert, FileUpload },
  computed: {
    ...mapState({
      user: "user",
      currentStep: "currentStep"
    })
  }
})
export default class Residency extends Vue {
  tenantAllowList = [
    "Quittances de loyer des trois derniers mois",
    "Attestation du propriétaire (ou de son mandataire) indiquant que le locataire est à jour de ses loyers et charges"
  ];
  tenantBlockList = [
    "Factures",
    "Avis de taxe d'habitation",
    "Relevés de compte bancaire"
  ];
  ownerAllowList = [
    "Dernier avis de taxe foncière",
    "Titre de propriété de la résidence principale"
  ];
  ownerBlockList = [
    "Appel de fonds pour charges de copropriété",
    "Factures",
    "Avis de taxe d'habitation",
    "Relevés de compte bancaire"
  ];
  guestAllowList = [
    "Attestation sur l'honneur du parent datée et signée indiquant que le candidat à la location réside à son domicile, accompagnée d'une pièce d'identité et d'un justificatif de domicile du parent (une simple facture suffit)"
  ];
  guestBlockList = ["Tout autre document"];
  guestParentsAllowList = [
    "Attestation sur l'honneur de l’hébergeant datée de moins de trois mois et signée indiquant que le candidat à la location réside à son domicile, accompagnée d’une pièce d’identité et d’un justificatif de domicile de l’hébergeant (une simple facture suffit)",
    "Attestation d’élection de domicile datée de moins de trois mois et signée de l’organisme d’hébergement (hébergement d’urgence, placement…) indiquant l’adresse de l’hébergement (téléchargeable sur le site https://www.service-public.fr/simulateur/calcul/16030 ) "
  ];
  guestParentsBlockList = ["Tout autre document"];
}
</script>

<style scoped lang="scss"></style>

<i18n>
{
"en": {
"tenant": "Vous êtes locataire",
"owner": "Vous êtes propriétaire",
"guest": "Vous êtes hébergé gratuitement",
"guest-parents": "Vous habitez chez vos parents"
},
"fr": {
"tenant": "Vous êtes locataire",
"owner": "Vous êtes propriétaire",
"guest": "Vous êtes hébergé gratuitement",
"guest-parents": "Vous habitez chez vos parents"
}
}
</i18n>
