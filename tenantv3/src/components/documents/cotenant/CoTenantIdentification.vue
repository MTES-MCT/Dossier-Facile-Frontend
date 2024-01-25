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

<script setup lang="ts">
import { DocumentTypeConstants } from "../share/DocumentTypeConstants";
import DocumentDownloader from "./DocumentDownloader.vue";
import {onMounted, ref} from "vue";
import {UtilsService} from "@/services/UtilsService";

  const documentsDefinitions = ref([] as any);

  const props = defineProps<{
    coTenantId: number
  }>();

  onMounted(() => {
    documentsDefinitions.value = DocumentTypeConstants.IDENTIFICATION_DOCS.filter(
      (type: any) => UtilsService.isSubCategoryEnabled(type)
    );
  })
</script>

<style scoped lang="scss"></style>
