<template>
  <div>
    <div>
      <select v-model="taxDocument" class="rf-select" id="select" name="select">
        <option value="" selected disabled hidden>- Select -</option>
        <option v-for="d in documents" :value="d" :key="d.key">{{
          $t(d.key)
        }}</option>
      </select>
    </div>
    <div v-if="taxDocument.key">
      <div class="rf-margin-bottom-3N">
        {{ taxDocument.explanationText }}
      </div>
      <div class="rf-margin-bottom-3N" v-if="taxDocument.key === 'my-name'">
        <FileUpload></FileUpload>
      </div>
      <div class="rf-margin-bottom-3N" v-if="taxDocument.key === 'my-name'">
        <DocumentInsert
          :allow-list="taxDocument.acceptedProofs"
          :block-list="taxDocument.refusedProofs"
        ></DocumentInsert>
      </div>
    </div>
    <div class="rf-col-12 rf-margin-bottom-5N">
      <button class="rf-btn" type="submit" :disabled="!taxDocument">
        Enregistrer la pièce
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { DocumentType } from "df-shared/src/models/Document";
import DocumentInsert from "@/components/DocumentInsert.vue";
import FileUpload from "@/components/uploads/FileUpload.vue";
import { mapState } from "vuex";

@Component({
  components: { DocumentInsert, FileUpload },
  computed: {
    ...mapState({
      user: "user",
      currentStep: "currentStep"
    })
  }
})
export default class Tax extends Vue {
  taxDocument = new DocumentType();
  documents: DocumentType[] = [
    {
      key: "my-name",
      value: "MY_NAME",
      explanationText:
        "En joignant mon avis d'imposition, j'accepte que DossierFacile procède à une vérification automatisée de ma fiche d'imposition auprès des services des impôts.\n" +
        "J'ajoute un avis d'imposition à mon nom.",
      acceptedProofs: ["Avis d'imposition de moins de 2 ans"],
      refusedProofs: [
        "Avis d'imposition incomplet (sans la première page)",
        "Tout avis d'imposition plus ancien",
        "Tout autre document justificatif"
      ]
    },
    {
      key: "my-parents",
      value: "MY_PARENTS",
      explanationText:
        "J'ai déclaré être rattaché·e au domicile fiscal de mes parents.",
      acceptedProofs: [],
      refusedProofs: []
    },
    {
      key: "less-than-year",
      value: "LESS_THAN_YEAR",
      explanationText: "J'ai déclaré être en France depuis moins d'un an.",
      acceptedProofs: [],
      refusedProofs: []
    },
    {
      key: "other-tax",
      value: "OTHER_TAX",
      explanationText:
        "Afin d'améliorer mon dossier, j’explique ci-dessous pourquoi je ne reçois pas d’avis d’imposition. Mon explication sera ajoutée à mon dossier :",
      acceptedProofs: [],
      refusedProofs: []
    }
  ];
}
</script>

<style scoped lang="scss"></style>

<i18n>
{
"en": {
"my-name": "Vous avez un avis d'imposition à votre nom",
"my-parents": "Vous êtes rattaché fiscalement à vos parents",
"less-than-year": "Vous êtes en France depuis moins d'un an",
"other-tax": "Autre"
},
"fr": {
"my-name": "Vous avez un avis d'imposition à votre nom",
"my-parents": "Vous êtes rattaché fiscalement à vos parents",
"less-than-year": "Vous êtes en France depuis moins d'un an",
"other-tax": "Autre"
}
}
</i18n>
