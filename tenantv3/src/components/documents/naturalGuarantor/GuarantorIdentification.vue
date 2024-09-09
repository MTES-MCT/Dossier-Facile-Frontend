<template>
  <div>
    <NakedCard class="fr-p-md-5w">
      <div>
        <h1 class="fr-h6" v-if="isCotenant">
          {{ t("guarantoridentification.title-cotenant") }}
        </h1>
        <h1 class="fr-h6" v-else>{{ t("guarantoridentification.title") }}</h1>

        <div class="fr-mt-3w">
          <SimpleRadioButtons
            name="application-type-selector"
            :value="identificationDocument"
            @input="onSelectChange($event)"
            :elements="mapDocuments()"
          ></SimpleRadioButtons>
        </div>
      </div>
    </NakedCard>
    <ConfirmModal v-if="isDocDeleteVisible" @valid="validSelect()" @cancel="undoSelect()">
      <span>{{ t("guarantoridentification.will-delete-files") }}</span>
    </ConfirmModal>
    <NakedCard
      class="fr-p-md-5w fr-mt-3w"
      v-if="identificationDocument.key || identificationFiles().length > 0"
    >
      <div class="fr-mb-3w">
        <p
          v-html="t(`explanation-text.${guarantorKey()}.${identificationDocument.key}`)"
        ></p>
      </div>
      <AllDeclinedMessages
        class="fr-mb-3w"
        :user-id="user?.id"
        :document="guarantorIdentificationDocument()"
        :documentDeniedReasons="documentDeniedReasons"
        :documentStatus="documentStatus"
      ></AllDeclinedMessages>
      <div v-if="identificationFiles().length > 0" class="fr-col-md-12 fr-mb-3w">
        <ListItem
          v-for="(file, k) in identificationFiles()"
          :key="k"
          :file="file"
          @remove="remove(file)"
        />
      </div>
      <div class="fr-mb-3w">
        <FileUpload
          :current-status="fileUploadStatus"
          :page="4"
          @add-files="addFiles"
          @reset-files="resetFiles"
        ></FileUpload>
      </div>
    </NakedCard>
  </div>
</template>

<script setup lang="ts">
import FileUpload from "../../uploads/FileUpload.vue";
import { DocumentType } from "df-shared-next/src/models/Document";
import { UploadStatus } from "df-shared-next/src/models/UploadStatus";
import ListItem from "../../uploads/ListItem.vue";
import { DfFile } from "df-shared-next/src/models/DfFile";
import { DfDocument } from "df-shared-next/src/models/DfDocument";
import { RegisterService } from "../../../services/RegisterService";
import { DocumentTypeConstants } from "../share/DocumentTypeConstants";
import ConfirmModal from "df-shared-next/src/components/ConfirmModal.vue";
import NakedCard from "df-shared-next/src/components/NakedCard.vue";
import AllDeclinedMessages from "../share/AllDeclinedMessages.vue";
import { DocumentDeniedReasons } from "df-shared-next/src/models/DocumentDeniedReasons";
import { cloneDeep } from "lodash";
import { UtilsService } from "../../../services/UtilsService";
import SimpleRadioButtons from "df-shared-next/src/Button/SimpleRadioButtons.vue";
import useTenantStore from "../../../stores/tenant-store";
import { computed, onMounted, ref } from "vue";
import { ToastService } from "../../../services/ToastService";
import { useLoading } from "vue-loading-overlay";
import { useI18n } from "vue-i18n";
import { AnalyticsService } from "../../../services/AnalyticsService";

const { t } = useI18n();

const store = useTenantStore();
const user = computed(() => store.userToEdit);
const selectedGuarantor = computed(() => store.selectedGuarantor);

const documents = DocumentTypeConstants.GUARANTOR_IDENTIFICATION_DOCS;
const props = withDefaults(
  defineProps<{
    tenantId?: number;
    isCotenant?: boolean;
  }>(),
  {
    isCotenant: false,
  }
);

const documentDeniedReasons = ref(new DocumentDeniedReasons());
const fileUploadStatus = ref(UploadStatus.STATUS_INITIAL);
const files = ref([] as DfFile[]);
const identificationDocument = ref(new DocumentType());
const isDocDeleteVisible = ref(false);

function onSelectChange($event: any) {
  identificationDocument.value = $event;
  if (user.value?.documents !== null) {
    const doc = guarantorIdentificationDocument();
    if (doc !== undefined) {
      isDocDeleteVisible.value =
        (doc?.files?.length || 0) > 0 &&
        doc?.subCategory !== identificationDocument.value.value;
    }
  }
  return false;
}

const documentStatus = computed(() => {
  return guarantorIdentificationDocument()?.documentStatus;
});

function guarantorIdentificationDocument(): DfDocument {
  const doc = selectedGuarantor.value?.documents?.find((d: DfDocument) => {
    return d.documentCategory === "IDENTIFICATION";
  }) as DfDocument;
  return doc;
}

function undoSelect() {
  if (selectedGuarantor.value?.documents !== null) {
    const doc = selectedGuarantor.value?.documents?.find((d: DfDocument) => {
      return d.documentCategory === "IDENTIFICATION";
    });
    if (doc !== undefined) {
      const localDoc = documents.find((d: DocumentType) => {
        return d.value === doc.subCategory;
      });
      if (localDoc !== undefined) {
        identificationDocument.value = localDoc;
      }
    }
  }
  isDocDeleteVisible.value = false;
}

async function validSelect() {
  isDocDeleteVisible.value = false;
  if (selectedGuarantor.value?.documents !== null) {
    const doc = selectedGuarantor.value?.documents?.find((d: DfDocument) => {
      return d.documentCategory === "IDENTIFICATION";
    });
    if (doc?.files !== undefined) {
      for (const f of doc.files) {
        if (f.id) {
          await remove(f, true);
        }
      }
    }
  }
}

function updateGuarantorData() {
  if (selectedGuarantor.value?.documents !== null) {
    if (guarantorIdentificationDocument() !== undefined) {
      const localDoc = documents.find((d: DocumentType) => {
        return d.value === guarantorIdentificationDocument()?.subCategory;
      });
      if (localDoc !== undefined) {
        identificationDocument.value = localDoc;
      }
      const docDeniedReasons = guarantorIdentificationDocument()?.documentDeniedReasons;
      if (docDeniedReasons !== undefined) {
        documentDeniedReasons.value = cloneDeep(docDeniedReasons);
      }
    }
  }
}

onMounted(() => {
  updateGuarantorData();
});

function addFiles(fileList: File[]) {
  const nf = Array.from(fileList).map((f) => {
    return { name: f.name, file: f, size: f.size };
  });
  files.value = [...files.value, ...nf];
  save();
}

function resetFiles() {
  fileUploadStatus.value = UploadStatus.STATUS_INITIAL;
}

function save() {
  const fieldName = "documents";
  const formData = new FormData();
  const newFiles = files.value.filter((f) => {
    return !f.id;
  });
  if (!newFiles.length) return;

  if (
    identificationDocument.value.maxFileCount &&
    identificationFiles().length > identificationDocument.value.maxFileCount
  ) {
    ToastService.maxFileError(
      identificationFiles().length,
      identificationDocument.value.maxFileCount
    );
    files.value = [];
    return;
  }

  Array.from(Array(newFiles.length).keys()).forEach((x) => {
    const f: File = newFiles[x].file || new File([], "");
    formData.append(`${fieldName}[${x}]`, f, newFiles[x].name);
  });

  formData.append("typeDocumentIdentification", identificationDocument.value.value);
  if (props.tenantId) {
    formData.append("tenantId", props.tenantId.toString());
  }
  fileUploadStatus.value = UploadStatus.STATUS_SAVING;
  if (!selectedGuarantor.value?.id) {
    throw new Error("selectedGuarantor id cannot be empty !");
  }
  formData.append("guarantorId", selectedGuarantor.value.id?.toString());
  const $loading = useLoading({});
  const loader = $loading.show();
  store
    .saveGuarantorIdentification(formData)
    .then(() => {
      fileUploadStatus.value = UploadStatus.STATUS_INITIAL;
      files.value = [];
      ToastService.saveSuccess();
    })
    .catch((err) => {
      fileUploadStatus.value = UploadStatus.STATUS_FAILED;
      UtilsService.handleCommonSaveError(err);
    })
    .finally(() => {
      loader.hide();
    });
}

function identificationFiles() {
  const newFiles = files.value.map((f) => {
    return {
      subCategory: identificationDocument.value.value,
      id: f.id,
      name: f.name,
      file: f.file,
      size: f.file?.size,
    };
  });
  const existingFiles = guarantorIdentificationDocument()?.files || [];
  return [...newFiles, ...existingFiles];
}

async function remove(file: DfFile, silent = false) {
  if (file.id) {
    if (files.value.length === 1 && guarantorIdentificationDocument()?.documentAnalysisReport?.analysisStatus === "DENIED") {
      AnalyticsService.removeDeniedDocument(guarantorIdentificationDocument()?.documentCategory || "")
    }
    await RegisterService.deleteFile(file.id, silent);
  } else {
    const firstIndex = files.value.findIndex((f) => {
      return f.name === file.name && !f.path;
    });
    files.value.splice(firstIndex, 1);
  }
}

function guarantorKey() {
  if (props.tenantId != null) {
    return "cotenant-guarantor";
  }
  return "guarantor";
}

function mapDocuments() {
  return documents.map((d) => {
    return { id: d.key, labelKey: d.key, value: d };
  });
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
