<template>
  <div>
    <ValidationObserver>
      <NakedCard class="fr-p-md-5w">
        <validation-provider rules="required" v-slot="{ errors, valid }">
          <div
            class="fr-input-group"
            :class="errors[0] ? 'fr-input-group--error' : ''"
          >
            <label class="fr-label" for="organismName"
              >{{ $t("corporationidentification.organism-name") }} :</label
            >
            <input
              v-model="organismName"
              class="form-control fr-input validate-required"
              :class="{
                'fr-input--valid': valid,
                'fr-input--error': errors[0],
              }"
              id="organismName"
              name="organismName"
              :placeholder="
                $t('corporationidentification.organism-name-placeholder')
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
        <div>
          <h1 class="fr-label">
            {{ $t("corporationidentification.kbis-label") }}
          </h1>
          <AllDeclinedMessages
            class="fr-mb-3w"
            :documentDeniedReasons="documentDeniedReasons"
            :documentStatus="documentStatus"
          ></AllDeclinedMessages>
          <div class="fr-col-md-12 fr-mb-3w">
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
          <div class="fr-mt-3w fr-mb-3w">
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
import { UploadStatus } from "df-shared-next/src/models/UploadStatus";
import ListItem from "../../uploads/ListItem.vue";
// import { ValidationObserver, ValidationProvider } from "vee-validate";
import { DfDocument } from "df-shared-next/src/models/DfDocument";
import { DfFile } from "df-shared-next/src/models/DfFile";
import { RegisterService } from "../../../services/RegisterService";
import { Guarantor } from "df-shared-next/src/models/Guarantor";
import NakedCard from "df-shared-next/src/components/NakedCard.vue";
import AllDeclinedMessages from "../share/AllDeclinedMessages.vue";
import { DocumentDeniedReasons } from "df-shared-next/src/models/DocumentDeniedReasons";
import { cloneDeep } from "lodash";
import GuarantorFooter from "../../footer/GuarantorFooter.vue";
import { computed, onBeforeMount, ref } from "vue";
import useTenantStore from "@/stores/tenant-store";
import { ToastService } from "@/services/ToastService";
import { useLoading } from 'vue-loading-overlay';

const store = useTenantStore();

  const props = defineProps<{
    tenantId?: number;
    guarantor?: Guarantor;
  }>();

  const organismName = ref("");

  const documentDeniedReasons = ref(new DocumentDeniedReasons());

  const files = ref([] as DfFile[]);
  const fileUploadStatus = ref(UploadStatus.STATUS_INITIAL);
const uploadProgress = ref({} as {
    [key: string]: { state: string; percentage: number };
  });
  const emit = defineEmits(["on-back", "on-next"]);

  onBeforeMount(() => {
    organismName.value = getGuarantor()?.legalPersonName || "";
    if (
      guarantorIdentificationLegalPersonDocument()?.documentDeniedReasons
    ) {
      documentDeniedReasons.value = cloneDeep(
        guarantorIdentificationLegalPersonDocument()!
          .documentDeniedReasons!
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
    return guarantorIdentificationLegalPersonDocument()?.documentStatus;
  })

  function guarantorIdentificationLegalPersonDocument(): DfDocument | undefined {
    if (props.guarantor) {
      return props.guarantor.documents?.find((d: DfDocument) => {
        return d.documentCategory === "IDENTIFICATION_LEGAL_PERSON";
      }) as DfDocument;
    }
    return store.getGuarantorIdentificationLegalPersonDocument;
  }
  function addFiles(fileList: File[]) {
    const nf = Array.from(fileList).map((f) => {
      return { name: f.name, file: f, size: f.size };
    });
    files.value = [...files.value, ...nf];
    save();
  }

  function save() {
    if (!organismName.value) {
      return Promise.resolve(true);
    }
    uploadProgress.value = {};
    const fieldName = "documents";
    const formData = new FormData();
    formData.append("legalPersonName", organismName.value);
const gId = getGuarantor()?.id
    if (gId) {
      formData.append("guarantorId", gId.toString());
    }
    if (props.tenantId) {
      formData.append("tenantId", props.tenantId.toString());
    }

    const $loading = useLoading({});
    const loader = $loading.show();
    if (!files.value.length) {
      return RegisterService.saveCorporationName(formData)
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

    Array.from(Array(files.value.length).keys()).map((x) => {
      const f: File = files.value[x].file || new File([], "");
      formData.append(`${fieldName}[${x}]`, f, files.value[x].name);
    });

    fileUploadStatus.value = UploadStatus.STATUS_SAVING;
    return RegisterService.saveCorporationIdentification(formData)
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
        // loader.hide();
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
    const newFiles = files.value.map((f) => {
      return {
        id: f.id,
        name: f.name,
        file: f.file,
        size: f.file?.size,
      };
    });
    const existingFiles =
      guarantorIdentificationLegalPersonDocument()?.files || [];
    return [...newFiles, ...existingFiles];
  }

  function goBack() {
    emit("on-back");
  }

  function goNext() {
    save().then(() => {
      emit("on-next");
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
