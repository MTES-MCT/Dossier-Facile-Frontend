<template>
  <div>
    <DocumentDownloader
      :coTenantId="coTenantId" 
      :documentsDefinitions="documentsDefinitions"
      documentCategory="IDENTIFICATION"
      dispacthMethodName="saveTenantIdentification"
      typeDocument="typeDocumentIdentification"
    >
    <!-- @enrich-form-data="enrichFormData" -->
    <!-- @check-before-add-file="checkValid"-->
    <!--    
        //:documents="documents"
      //@on-remove-file=""
      //@on-add-file=""
      //@on-change-document=""
      //@on-valid-change-document=""
      documentExplainationText=""
      //documentDeniedReasons="documentDeniedReasons"
      //documentStatus="documentStatus"
    -->
      <template v-slot:after-select-block>
        This is a block
      </template>
    </DocumentDownloader>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { DocumentTypeConstants } from "../share/DocumentTypeConstants";
import DocumentDownloader from "./DocumentDownloader.vue";

@Component({
  components: {
    DocumentDownloader
  },
  computed: {}
})
export default class CoTenantIdentification extends Vue {
  documentsDefinitions = DocumentTypeConstants.IDENTIFICATION_DOCS;  
  @Prop() coTenantId!: number;

  //enrichFormData(dataForm : FormData) {}

}
</script>

<style scoped lang="scss">
</style>

<i18n>
{
"en": {
  "title": "My spouse's identity",
  "description": "I add a valid identity document of my spouse",
  "identity-card": "French identity card",
  "passport": "French passeport",
  "permit": "French residence permit",
  "other": "Autre"
},
"fr": {
  "title": "La pièce d'identité de mon conjoint",
  "description": "Veuillez à ajouter le recto et le verso !",
  "identity-card": "Carte d’identité française",
  "passport": "Passeport français",
  "permit": "Titre de séjour français",
  "other": "Autre"
}
}
</i18n>
