<template>
  <div>
    <ValidationObserver>
      <NakedCard class="fr-p-md-5w">
        <validation-provider rules="required" v-slot="{ errors, valid }">
          <div
            class="fr-input-group"
            :class="errors[0] ? 'fr-input-group--error' : ''"
          >
            <h1 class="fr-label fr-text--regular" for="firstName">
              {{ $t("representativeidentification.organism-name") }} :
            </h1>
            <input
              v-model="firstName"
              class="form-control fr-input validate-required"
              :class="{
                'fr-input--valid': valid,
                'fr-input--error': errors[0],
              }"
              id="firstName"
              name="firstName"
              :placeholder="
                $t('representativeidentification.organism-name-placeholder')
              "
              type="text"
              required
            />
            <span class="fr-error-text" v-if="errors[0]">{{
              $t(errors[0])
            }}</span>
          </div>
        </validation-provider>
      </NakedCard>
      <NakedCard class="fr-mt-3w fr-p-md-5w">
        <validation-provider
          rules="select"
          name="identificationDocument"
          v-slot="{ errors, valid }"
        >
          <div class="fr-select-group">
            <label class="fr-label" for="select">
              <b>
                J’ajoute une pièce d’identité en cours de validité. Attention,
                veillez à ajouter votre pièce recto-verso !
              </b>
            </label>
            <select
              v-model="identificationDocument"
              class="fr-select fr-mb-3w"
              :class="{
                'fr-select--valid': valid,
                'fr-select--error': errors[0],
              }"
              id="selectID"
              as="select"
            >
              <option v-for="d in documents" :value="d" :key="d.key">
                {{ $t(d.key) }}
              </option>
            </select>

            <span class="fr-error-text" v-if="errors[0]">
              {{ $t(errors[0]) }}
            </span>
          </div>
        </validation-provider>
        <div v-if="identificationDocument && identificationDocument.key">
          <AllDeclinedMessages
            class="fr-mb-3w"
            :documentDeniedReasons="documentDeniedReasons"
            :documentStatus="documentStatus"
          ></AllDeclinedMessages>
          <div class="fr-col-md-12 fr-mb-3w" v-if="listFiles().length > 0">
            <ListItem
              v-for="(file, k) in listFiles()"
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
          <div class="fr-mb-3w">
            <FileUpload
              :current-status="fileUploadStatus"
              @add-files="addFiles"
              @reset-files="resetFiles"
            ></FileUpload>
          </div>
        </div>
      </NakedCard>
    </ValidationObserver>
    <GuarantorFooter @on-back="goBack" @on-next="goNext"></GuarantorFooter>
  </div>
</template>

<script setup lang="ts">
import FileUpload from "../../uploads/FileUpload.vue";
import { DocumentType } from "df-shared-next/src/models/Document";
import { UploadStatus } from "df-shared-next/src/models/UploadStatus";
import ListItem from "../../uploads/ListItem.vue";
// import { ValidationObserver, ValidationProvider } from "vee-validate";
import { DfDocument } from "df-shared-next/src/models/DfDocument";
import { DfFile } from "df-shared-next/src/models/DfFile";
import { RegisterService } from "../../../services/RegisterService";
import { Guarantor } from "df-shared-next/src/models/Guarantor";
import NakedCard from "df-shared-next/src/components/NakedCard.vue";
import VGouvFrModal from "df-shared-next/src/GouvFr/v-gouv-fr-modal/VGouvFrModal.vue";
import AllDeclinedMessages from "../share/AllDeclinedMessages.vue";
import { DocumentDeniedReasons } from "df-shared-next/src/models/DocumentDeniedReasons";
import { cloneDeep } from "lodash";
import GuarantorFooter from "../../footer/GuarantorFooter.vue";
import { DocumentTypeConstants } from "../share/DocumentTypeConstants";
import { computed, onBeforeMount, ref } from "vue";
import useTenantStore from "@/stores/tenant-store";
import { ToastService } from "@/services/ToastService";
import { useLoading } from 'vue-loading-overlay';

  const documents = DocumentTypeConstants.REPRESENTATIVE_IDENTIFICATION;
  const props = defineProps<{
    tenantId?: number;
    guarantor?: Guarantor;
  }>();
  const store = useTenantStore();
  const emit = defineEmits(["on-next", "on-back"]);

  const MAX_FILE_COUNT = 5;

  const identificationDocument = ref(new DocumentType());
  const documentDeniedReasons = ref(new DocumentDeniedReasons());

  const files = ref([] as File[]);
  const fileUploadStatus = ref(UploadStatus.STATUS_INITIAL);
const uploadProgress = ref({} as {
    [key: string]: { state: string; percentage: number };
  });
  const firstName = ref("");

  onBeforeMount(() => {
    firstName.value = getGuarantor()?.firstName || "";
    if (getGuarantor()?.documents !== null) {
      const doc = guarantorIdentificationDocument();
      if (doc !== undefined) {
        const localDoc = documents.find((d: DocumentType) => {
          return d.value === doc.subCategory;
        });
        if (localDoc !== undefined) {
          identificationDocument.value = localDoc;
        }
      }
    }
    if (guarantorIdentificationDocument()?.documentDeniedReasons) {
      documentDeniedReasons.value = cloneDeep(
        guarantorIdentificationDocument()!.documentDeniedReasons!
      );
    }
  })

  function getGuarantor() {
    if (props.guarantor) {
      return props.guarantor;
    }
    return store.guarantor;
  }

  const documentStatus = computed(() => {
    return guarantorIdentificationDocument()?.documentStatus;
  })

  function guarantorIdentificationDocument(): DfDocument | undefined {
    if (props.guarantor) {
      return props.guarantor.documents?.find((d: DfDocument) => {
        return d.documentCategory === "IDENTIFICATION";
      }) as DfDocument;
    }
    return store.getGuarantorIdentificationDocument;
  }

  function addFiles(fileList: File[]) {
    files.value = [...files.value, ...fileList];
    save();
  }

  function save() {
    if (!firstName.value) {
      return Promise.reject();
    }
    uploadProgress.value = {};
    const fieldName = "documents";
    const formData = new FormData();
    const gId = getGuarantor()?.id;
    if (gId) {
      formData.append("guarantorId", gId.toString());
    }
    if (props.tenantId) {
      formData.append("tenantId", props.tenantId.toString());
    }
    if (firstName.value) {
      formData.append("firstName", firstName.value);
    }

    if (!files.value.length) {
    const $loading = useLoading({});
    const loader = $loading.show();
      return RegisterService.saveLegalPersonRepresentantName(formData)
        .then(() => {
          files.value = [];
          fileUploadStatus.value = UploadStatus.STATUS_INITIAL;
          store.loadUser();
          ToastService.saveSuccess();
          return Promise.resolve(true);
        })
        .catch((err: unknown) => {
          fileUploadStatus.value = UploadStatus.STATUS_FAILED;
          ToastService.saveFailed();
          return Promise.reject(err);
        })
        .finally(() => {
          loader.hide();
        });
    }

    if (listFiles().length > MAX_FILE_COUNT) {
      ToastService.maxFileError(listFiles().length, MAX_FILE_COUNT);
      return Promise.reject();
    }
    Array.from(Array(files.value.length).keys()).forEach((x) => {
      formData.append(`${fieldName}[${x}]`, files.value[x], files.value[x].name);
    });

    formData.append(
      "typeDocumentIdentification",
      identificationDocument.value.value
    );

    fileUploadStatus.value = UploadStatus.STATUS_SAVING;
    // const loader = this.$loading.show();
    return RegisterService.saveRepresentativeIdentification(formData)
      .then(() => {
        fileUploadStatus.value = UploadStatus.STATUS_INITIAL;
        store.loadUser();
        ToastService.saveSuccess();
        return Promise.resolve(true);
      })
      .catch(() => {
        fileUploadStatus.value = UploadStatus.STATUS_FAILED;
        ToastService.saveFailed();
        return Promise.reject();
      })
      .finally(() => {
        // loader.hide();
      });
  }

  function goBack() {
    emit("on-back");
  }

  function goNext() {
    save().then(() => {
      emit("on-next");
    });
  }

  function resetFiles() {
    fileUploadStatus.value = UploadStatus.STATUS_INITIAL;
  }

  function remove(file: DfFile) {
    if (file.id) {
      RegisterService.deleteFile(file.id);
    } else {
      const firstIndex = files.value.findIndex((f) => {
        return f.name === file.name && f.size === file.size;
      });
      files.value.splice(firstIndex, 1);
    }
  }
  function listFiles() {
    const existingFiles = guarantorIdentificationDocument()?.files || [];
    return existingFiles;
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
