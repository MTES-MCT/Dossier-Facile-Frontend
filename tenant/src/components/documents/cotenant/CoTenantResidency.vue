<template>
  <div>
    <DocumentDownloader
      :coTenantId="coTenantId"
      :documentsDefinitions="documentsDefinitions"
      documentCategory="RESIDENCY"
      dispacthMethodName="saveTenantResidency"
      typeDocument="typeDocumentResidency"
    >
    </DocumentDownloader>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { DocumentTypeConstants } from "../share/DocumentTypeConstants";
import DocumentDownloader from "./DocumentDownloader.vue";

@Component({
  components: {
    DocumentDownloader
  }
})
export default class CoTenantProfessional extends Vue {
  documentsDefinitions = DocumentTypeConstants.RESIDENCY_DOCS;
  @Prop() coTenantId!: number;
}
</script>

<i18n>
{
"en": {
  "title": "Your Spouse current accommodation situation",
  "tenant": "Locataire",
  "owner": "Propriétaire",
  "guest": "Hébergé·e gratuitement",
  "guest-parents": "Chez mes parents",
  "files": "Documents",
  "will-delete-files": "Please note, a change of situation will result in the deletion of your supporting documents. You will have to upload the supporting documents corresponding to his/her situation again.",
  "select-label": "Your Spouse current accommodation situation:"
},
"fr": {
  "title": "La situation d’hébergement actuelle de votre conjoint",
  "tenant": "Locataire",
  "owner": "Propriétaire",
  "guest": "Hébergé·e gratuitement",
  "guest-parents": "Chez ses parents"
}
}
</i18n>
