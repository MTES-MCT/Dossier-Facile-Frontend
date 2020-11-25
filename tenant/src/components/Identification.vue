<template>
  <div>
    <div class="rf-margin-bottom-3N">
      <label class="rf-label" for="select">
        J'ajoute une pièce d'identité en cours de validité. Attention, veillez à
        ajouter votre pièce recto-verso !
      </label>
      <select
        v-model="user.identification"
        class="rf-select"
        id="select"
        name="select"
      >
        <option value="" selected disabled hidden>- Select -</option>
        <option value="FRENCH_IDENTITY_CARD">{{ $t("identity-card") }}</option>
        <option value="FRENCH_PASSPORT">{{ $t("passport") }}</option>
        <option value="FRENCH_RESIDENCE_PERMIT">{{ $t("permit") }}</option>
        <option value="OTHER_IDENTIFICATION">{{ $t("other") }}</option>
      </select>
    </div>
    <div v-if="user.identification" class="rf-margin-bottom-3N">
      <FileUpload></FileUpload>
    </div>
    <div v-if="user.identification === 'FRENCH_IDENTITY_CARD'">
      <div class="rf-margin-bottom-3N">
        Attention veillez à ajouter votre pièce recto-verso !
      </div>
      <div class="rf-margin-bottom-3N">
        <DocumentInsert
          :allow-list="identityAllowList"
          :block-list="identityBlockList"
        ></DocumentInsert>
      </div>
    </div>
    <div v-if="user.identification === 'FRENCH_PASSPORT'">
      <div class="rf-margin-bottom-3N">
        <DocumentInsert
          :allow-list="passportAllowList"
          :block-list="passportBlockList"
        ></DocumentInsert>
      </div>
    </div>
    <div v-if="user.identification === 'FRENCH_RESIDENCE_PERMIT'">
      <div class="rf-margin-bottom-3N">
        <DocumentInsert
          :allow-list="permitAllowList"
          :block-list="permitBlockList"
        ></DocumentInsert>
      </div>
    </div>
    <div v-if="user.identification === 'OTHER_IDENTIFICATION'">
      <div class="rf-margin-bottom-3N">
        <DocumentInsert
          :allow-list="otherAllowList"
          :block-list="otherBlockList"
        ></DocumentInsert>
      </div>
    </div>
    <div class="rf-col-12 rf-margin-bottom-5N">
      <button class="rf-btn" type="submit">
        Suivant
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
export default class Identification extends Vue {
  identityBlockList = [
    "Carte d'identité sans le verso ou périmée",
    "Tout autre document"
  ];
  identityAllowList = ["Carte d'identité française recto-verso"];
  passportBlockList = ["Tout autre document"];
  passportAllowList = ["Passport français (pages 2 et 3)"];
  permitBlockList = ["Tout autre document"];
  permitAllowList = [
    "Carte de séjour en France temporaire recto-verso en cours de validité, ou périmée si elle est accompagnée du récépissé de la demande de renouvellement de carte de séjour",
    "Visa de travail ou d'études temporaire en France"
  ];
  otherBlockList = ["Tout autre document"];
  otherAllowList = [
    "Carte d'identité étrangère recto-verso",
    "Passeport étranger (pages 2 et 3)",
    "Permis de conduire français ou étranger recto-verso",
    "Carte de résident",
    "Carte de ressortissant d'un État membre de l'UE ou de l'EEE"
  ];
}
</script>

<style scoped lang="scss">
table {
  border-collapse: collapse;
}

table,
th,
td {
  border: 1px solid #ececec;
}
</style>

<i18n>
{
"en": {
"identity-card": "Carte nationale d'identité",
"passport": "Passeport",
"permit": "Permis de conduire",
"other": "Autre"
},
"fr": {
"identity-card": "Carte nationale d'identité",
"passport": "Passeport",
"permit": "Permis de conduire",
"other": "Autre"
}
}
</i18n>
