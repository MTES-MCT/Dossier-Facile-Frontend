<template>
  <div>
    <NakedCard class="fr-p-md-5w">
      <div>
        <h1 class="fr-h6">
          {{ getTitle() }}
        </h1>
        <AllDeclinedMessages
          class="fr-mb-3w"
          :documentDeniedReasons="documentDeniedReasons"
          :documentStatus="documentStatus"
        ></AllDeclinedMessages>
        <div class="fr-col-md-12 fr-mb-3w fr-mt-3w">
          <ListItem
            v-for="(file, k) in files"
            :key="k"
            :file="file"
            @remove="remove(file)"
            :uploadState="
              file.id && uploadProgress[file.id] ? uploadProgress[file.id].state : 'idle'
            "
            :percentage="
              file.id && uploadProgress[file.id] ? uploadProgress[file.id].percentage : 0
            "
          />
        </div>
        <div class="fr-mt-3w fr-mb-3w">
          <FileUpload
            :current-status="fileUploadStatus"
            @add-files="addFiles"
            @reset-files="resetFiles"
          ></FileUpload>
        </div>
      </div>
    </NakedCard>
  </div>
</template>

<script setup lang="ts">
import FileUpload from "../../uploads/FileUpload.vue";
import { UploadStatus } from "df-shared-next/src/models/UploadStatus";
import ListItem from "../../uploads/ListItem.vue";
import { DfDocument } from "df-shared-next/src/models/DfDocument";
import { DfFile } from "df-shared-next/src/models/DfFile";
import { RegisterService } from "../../../services/RegisterService";
import NakedCard from "df-shared-next/src/components/NakedCard.vue";
import AllDeclinedMessages from "../share/AllDeclinedMessages.vue";
import { DocumentDeniedReasons } from "df-shared-next/src/models/DocumentDeniedReasons";
import { Guarantor } from "df-shared-next/src/models/Guarantor";
import { computed, onMounted, ref } from "vue";
import { useI18n } from "vue-i18n";
import useTenantStore from "@/stores/tenant-store";
import { ToastService } from "@/services/ToastService";
import { useLoading } from 'vue-loading-overlay';

  const props = defineProps<{
    tenantId?: number,
    isCotenant?: boolean,
    guarantor?: Guarantor,
  }>();

const { t } = useI18n();
const store = useTenantStore();

  const MAX_FILE_COUNT = 5;

  const documentDeniedReasons = ref(new DocumentDeniedReasons());

  const files = ref([] as DfFile[]);
  const fileUploadStatus = ref(UploadStatus.STATUS_INITIAL);
const uploadProgress = ref({} as {
    [key: string]: { state: string; percentage: number };
  });

  onMounted(() => {
    loadDocument();
  })

  function getTitle() {
    const userType = props.isCotenant ? "cotenant" : "tenant";
    return t(`explanation-text.${userType}.organism-guarantor`);
  }

  function guarantorId() {
    if (props.guarantor) {
      return props.guarantor.id;
    }
    return store.guarantor?.id;
  }

  const documentStatus = computed(() =>  {
    return guarantorIdentificationDocument()?.documentStatus;
  })

  function guarantorIdentificationDocument(): DfDocument | undefined {
    if (props.guarantor) {
      return props.guarantor.documents?.find((d: DfDocument) => {
        return d.documentCategory === "GUARANTEE_PROVIDER_CERTIFICATE";
      }) as DfDocument;
    }
    return store.getGuaranteeProviderCertificateDocument;
  }

  function addFiles(newFiles: File[]) {
    if (files.value.length >= MAX_FILE_COUNT) {
      displayTooManyFilesToast();
      return;
    }
    save(newFiles);
  }

  function save(files: File[]) {
    uploadProgress.value = {};
    const fieldName = "documents";
    const formData = new FormData();
    if (!files.length) return;

    Array.from(Array(files.length).keys()).forEach((x) => {
      formData.append(`${fieldName}[${x}]`, files[x], files[x].name);
    });

    formData.append("typeDocumentCertificate", "OTHER_GUARANTEE");

    const gId = guarantorId()
    if (gId) {
      formData.append("guarantorId", gId.toString());
    }
    if (props.tenantId) {
      formData.append("tenantId", props.tenantId.toString());
    }

    fileUploadStatus.value = UploadStatus.STATUS_SAVING;
    const $loading = useLoading({});
    const loader = $loading.show();
    RegisterService.saveOrganismIdentification(formData)
      .then(async (response: any) => {
        fileUploadStatus.value = UploadStatus.STATUS_INITIAL;
        ToastService.saveSuccess();
        await store.loadUserCommit(response.data);
        loadDocument();
      })
      .catch(() => {
        fileUploadStatus.value = UploadStatus.STATUS_FAILED;
        ToastService.saveFailed();
      })
      .finally(() => {
        loader.hide();
      });
  }

  function resetFiles() {
    fileUploadStatus.value = UploadStatus.STATUS_INITIAL;
  }

  function remove(file: DfFile) {
    if (file.id) {
      RegisterService.deleteFile(file.id);
    }
    const firstIndex = files.value.findIndex((f) => f.id === file.id);
    files.value.splice(firstIndex, 1);
    documentDeniedReasons.value = new DocumentDeniedReasons();
  }

  function loadDocument() {
    // This is a needed workaround for now, since we can't identify the currently
    // edited guarantor (and thus the corresponding document) from state
    const document = guarantorIdentificationDocument();
    if (document?.documentDeniedReasons) {
      documentDeniedReasons.value = document.documentDeniedReasons;
    } else {
      documentDeniedReasons.value = new DocumentDeniedReasons();
    }
    files.value = document?.files || [];
  }

  function displayTooManyFilesToast() {
    ToastService.maxFileError(files.value.length, MAX_FILE_COUNT);
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
