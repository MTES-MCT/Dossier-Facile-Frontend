<template>
  <div>
    <DocumentDownloader
      :coTenantId="coTenantId"
      :documentsDefinitions="documentsDefinitions"
      documentCategory="PROFESSIONAL"
      dispatchMethodName="saveTenantProfessional"
      typeDocument="typeDocumentProfessional"
      listType="dropDownList"
      @on-change-document="changeDocumentType"
    >
      <template v-slot:help-modal-content>
        <p>
          <DocumentHelp></DocumentHelp>
          <DocumentInsert
            v-if="documentType ? (documentType.key ? true : false) : false"
            :allow-list="documentType ? documentType.acceptedProofs : null"
            :block-list="documentType ? documentType.refusedProofs : null"
          ></DocumentInsert>
        </p>
      </template>
    </DocumentDownloader>
  </div>
</template>

<script lang="ts">
import { DocumentType } from "df-shared/src/models/Document";
import { Component, Prop, Vue } from "vue-property-decorator";
import DocumentHelp from "../../helps/DocumentHelp.vue";
import DocumentInsert from "../share/DocumentInsert.vue";
import { DocumentTypeConstants } from "../share/DocumentTypeConstants";
import DocumentDownloader from "./DocumentDownloader.vue";

@Component({
  components: {
    DocumentHelp,
    DocumentInsert,
    DocumentDownloader
  }
})
export default class CoTenantProfessional extends Vue {
  documentsDefinitions = DocumentTypeConstants.PROFESSIONAL_DOCS;
  @Prop() coTenantId!: number;
  documentType?: DocumentType;

  changeDocumentType(docType?: DocumentType) {
    this.documentType = docType;
  }
}
</script>

<style scoped lang="scss"></style>

<i18n>
{
"en": {
  "title": "Your Spouse current accommodation situation",
  "cdi": "CDI",
  "cdi-trial": "CDI (période d’essai)",
  "cdd": "CDD",
  "alternation": "Alternance",
  "internship": "Stage",
  "student": "Études",
  "public": "Fonction publique",
  "ctt": "CTT (intérimaire)",
  "retired": "Retraité",
  "unemployed": "Chômage",
  "independent": "Indépendant",
  "other": "Autre",
  "select-is-empty": "Item selection required"
},
"fr": {
  "title": "La situation professionnelle actuelle de votre conjoint",
  "cdi": "CDI",
  "cdi-trial": "CDI (période d’essai)",
  "cdd": "CDD",
  "alternation": "Alternance",
  "internship": "Stage",
  "student": "Études",
  "public": "Fonction publique",
  "ctt": "CTT (intérimaire)",
  "retired": "Retraité",
  "unemployed": "Chômage",
  "independent": "Indépendant",
  "other": "Autre", 
  "select-is-empty": "Sélection requise"
}
}
</i18n>
