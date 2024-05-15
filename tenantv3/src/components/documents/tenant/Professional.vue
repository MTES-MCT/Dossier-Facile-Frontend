<template>
  <div>
    <Modal v-show="showContracts == true" @close="showContracts = false" >
      <template v-slot:header>
        <div class="fr-container">
          <h1 id="fr-modal-title-modal-1" class="fr-modal__title">
            Dîtes le nous une fois !
          </h1>
        </div>
      </template>
      <template v-slot:body>
        <div class="fr-container my-modal">
          <div class="fr-grid-row justify-content-center">
            <fieldset class="fr-fieldset" id="checkboxes-hint-el-sm"
                      aria-labelledby="checkboxes-hint-el-sm-legend checkboxes-hint-el-sm-messages">
              <legend class="fr-fieldset__legend--regular fr-fieldset__legend" id="checkboxes-hint-el-sm-legend">
                Sélectionnez les justificatif de situation professionelle que vous souhaitez ajouter:
              </legend>
              <div
                  v-for="contract in user.contracts"
                  v-bind:key="contract.id"
                  class="fr-fieldset__element"
              >
                <div class="fr-radio-group fr-radio-group--sm">

                  <input
                      :id="'checkboxes-hint-el-sm-1' + contract.id" type="radio"
                      name="radio-hint-element"
                      aria-describedby="checkboxes-hint-el-sm-1-messages">
                  <label class="fr-label" :for="'checkboxes-hint-el-sm-1' + contract.id">{{ contract.company }} depuis le {{contract.debut}} <span
                      class="fr-hint-text">{{ contract.nature }} </span> </label>
                  <div class="fr-messages-group" id="checkboxes-hint-el-sm-1-messages" aria-live="assertive"></div>

                </div>
              </div>

              <div class="fr-messages-group" id="checkboxes-hint-el-sm-messages" aria-live="assertive"></div>
            </fieldset>
          </div>
        </div>

        <div class="btn-align">
          <DfButton
              @on-click="addResource()"
              :primary="true"
          >Ajouter le justificatif de situation </DfButton>
        </div>
      </template>
    </Modal>
    <NakedCard class="fr-p-md-5w">
      <div>
        <h1 class="fr-h6">
          {{ t("professional-page.select-label") }}
        </h1>
        <select
          v-model="professionalDocument"
          class="fr-select fr-mb-3w fr-mt-3w"
          id="select"
          as="select"
          @change="onSelectChange()"
          aria-label="Select professional situation"
        >
          <option v-if="!professionalDocument" selected disabled></option>
          <option v-for="d in documents" :value="d" :key="d.key">
            {{ t(d.key) }}
          </option>
        </select>
      </div>
    </NakedCard>
    <NakedCard
      class="fr-p-md-5w fr-mt-3w"
      v-if="professionalDocument.key || professionalFiles().length > 0"
    >
      <div class="fr-mb-3w">
        <div
          v-html="t(`explanation-text.tenant.professional.${professionalDocument.key}`)"
        ></div>
      </div>
      <AllDeclinedMessages
        class="fr-mb-3w"
        :documentDeniedReasons="documentDeniedReasons"
        :documentStatus="documentStatus"
      ></AllDeclinedMessages>
      <div v-if="professionalFiles().length > 0" class="fr-col-md-12 fr-mb-3w">
        <ListItem
          v-for="(file, k) in professionalFiles()"
          :key="k"
          :file="file"
          @remove="remove(file)"
        />
      </div>
      <div class="fr-mb-3w">
        <FileUpload
          :current-status="fileUploadStatus"
          @add-files="addFiles"
          @reset-files="resetFiles"
        ></FileUpload>
      </div>
    </NakedCard>
    <ConfirmModal v-if="isDocDeleteVisible" @valid="validSelect()" @cancel="undoSelect()">
      <span>{{ t("professional-page.will-delete-files") }}</span>
    </ConfirmModal>
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
import { AnalyticsService } from "../../../services/AnalyticsService";
import NakedCard from "df-shared-next/src/components/NakedCard.vue";
import AllDeclinedMessages from "../share/AllDeclinedMessages.vue";
import { DocumentDeniedReasons } from "df-shared-next/src/models/DocumentDeniedReasons";
import { cloneDeep } from "lodash";
import { UtilsService } from "@/services/UtilsService";
import useTenantStore from "@/stores/tenant-store";
import { computed, onBeforeMount, ref } from "vue";
import { useI18n } from "vue-i18n";
import { ToastService } from "@/services/ToastService";
import { useLoading } from "vue-loading-overlay";
import Modal from "df-shared-next/src/components/Modal.vue";
import DfButton from "df-shared-next/src/Button/Button.vue";
import {DSNService} from "df-shared-next/src/services/DSNService";

const { t } = useI18n();

const store = useTenantStore();
const user = computed(() => store.userToEdit);
const tenantProfessionalDocument = computed(() => store.getTenantProfessionalDocument);

const documents = ref(DocumentTypeConstants.PROFESSIONAL_DOCS);

const documentDeniedReasons = ref(new DocumentDeniedReasons());
const fileUploadStatus = ref(UploadStatus.STATUS_INITIAL);
const files = ref([] as DfFile[]);
const uploadProgress = ref(
  {} as {
    [key: string]: { state: string; percentage: number };
  }
);
const professionalDocument = ref(new DocumentType());
const isDocDeleteVisible = ref(false);

function getLocalStorageKey() {
  return "professional_" + user.value?.email;
}

const documentStatus = computed(() => {
  return tenantProfessionalDocument.value?.documentStatus;
});

onBeforeMount(() => {
  if (user.value?.documents !== null) {
    const doc = user.value?.documents?.find((d: DfDocument) => {
      return d.documentCategory === "PROFESSIONAL";
    });
    if (doc !== undefined) {
      const localDoc = documents.value.find((d: DocumentType) => {
        return d.value === doc.subCategory;
      });
      if (localDoc !== undefined) {
        professionalDocument.value = localDoc;
        localStorage.setItem(getLocalStorageKey(), professionalDocument.value.key || "");
      }
      if (tenantProfessionalDocument.value?.documentDeniedReasons) {
        documentDeniedReasons.value = cloneDeep(
          tenantProfessionalDocument.value.documentDeniedReasons
        );
      }
    } else {
      const key = localStorage.getItem(getLocalStorageKey());
      if (key) {
        const localDoc = documents.value.find((d: DocumentType) => {
          return d.key === key;
        });
        if (localDoc !== undefined) {
          professionalDocument.value = localDoc;
        }
      }
    }
  }
});

function onSelectChange() {
  localStorage.setItem(getLocalStorageKey(), professionalDocument.value.key);
  if (user.value?.documents !== null) {
    const doc = user.value?.documents?.find((d: DfDocument) => {
      return d.documentCategory === "PROFESSIONAL";
    });
    if (doc !== undefined) {
      isDocDeleteVisible.value =
        (doc.files?.length || 0) > 0 &&
        doc.subCategory !== professionalDocument.value.value;
    }
  }
  return false;
}

function undoSelect() {
  if (user.value?.documents !== null) {
    const doc = user.value?.documents?.find((d: DfDocument) => {
      return d.documentCategory === "PROFESSIONAL";
    });
    if (doc !== undefined) {
      const localDoc = documents.value.find((d: DocumentType) => {
        return d.value === doc.subCategory;
      });
      if (localDoc !== undefined) {
        professionalDocument.value = localDoc;
      }
    }
  }
  isDocDeleteVisible.value = false;
}

async function validSelect() {
  isDocDeleteVisible.value = false;
  if (user.value?.documents !== null) {
    const doc = user.value?.documents?.find((d: DfDocument) => {
      return d.documentCategory === "PROFESSIONAL";
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

function addFiles(fileList: File[]) {
  AnalyticsService.uploadFile("professional");
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
  AnalyticsService.registerFile("professional");
  uploadProgress.value = {};
  const fieldName = "documents";
  const formData = new FormData();
  const newFiles = files.value.filter((f) => {
    return !f.id;
  });
  if (!newFiles.length) return;

  if (
    professionalDocument.value.maxFileCount &&
    professionalFiles().length > professionalDocument.value.maxFileCount
  ) {
    ToastService.maxFileError(
      professionalFiles().length,
      professionalDocument.value.maxFileCount
    );
    files.value = [];
    return;
  }
  Array.from(Array(newFiles.length).keys()).forEach((x) => {
    const f: File = newFiles[x].file || new File([], "");
    formData.append(`${fieldName}[${x}]`, f, newFiles[x].name);
  });

  formData.append("typeDocumentProfessional", professionalDocument.value.value);

  fileUploadStatus.value = UploadStatus.STATUS_SAVING;
  const $loading = useLoading({});
  const loader = $loading.show();
  store
    .saveTenantProfessional(formData)
    .then(() => {
      files.value = [];
      fileUploadStatus.value = UploadStatus.STATUS_INITIAL;
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

function professionalFiles() {
  const newFiles = files.value.map((f) => {
    return {
      subCategory: professionalDocument.value.value,
      id: f.id,
      name: f.name,
      size: f.size,
    };
  });
  const existingFiles =
    store.getTenantDocuments?.find((d: DfDocument) => {
      return d.documentCategory === "PROFESSIONAL";
    })?.files || [];
  return [...newFiles, ...existingFiles];
}

async function remove(file: DfFile, silent = false) {
  AnalyticsService.deleteFile("professional");
  if (file.id) {
    await RegisterService.deleteFile(file.id, silent);
  } else {
    const firstIndex = files.value.findIndex((f) => {
      return f.name === file.name && !f.path;
    });
    files.value.splice(firstIndex, 1);
  }
}

const showContracts = ref(true);

function addResource() {
  DSNService.addResource()
      .then( () =>

          store.loadUser().then(() => {
           // initialize();
            showContracts.value = false

          } )
      );
}

</script>

<style scoped lang="scss">

.my-modal{
  width:650px;
}

</style>
