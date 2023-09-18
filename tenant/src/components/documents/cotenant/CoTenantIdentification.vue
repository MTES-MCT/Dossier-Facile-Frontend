<template>
  <div>
    <DocumentDownloader
      :coTenantId="coTenantId"
      :documentsDefinitions="documentsDefinitions"
      documentCategory="IDENTIFICATION"
      dispatchMethodName="saveTenantIdentification"
      typeDocument="typeDocumentIdentification"
    >
      <template v-slot:title>
        {{ $t("cotenantidentification.title") }}
      </template>
      <template v-slot:description>
        <p>{{ $t("cotenantidentification.description") }}</p>
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
    DocumentDownloader,
  },
})
export default class CoTenantIdentification extends Vue {
  documentsDefinitions = DocumentTypeConstants.IDENTIFICATION_DOCS;
  @Prop() coTenantId!: number;
}
</script>

<style scoped lang="scss"></style>
