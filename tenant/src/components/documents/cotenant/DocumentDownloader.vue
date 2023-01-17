<template>
  <div>
    <NakedCard class="fr-p-md-5w">
      <div>
        <h1 class="fr-h6">
          {{ $parent.$t("title") }}
        </h1>
        <p v-if="$parent.$te('description')">{{ $parent.$t("description") }}</p>

        <TroubleshootingModal>
          <DocumentHelp></DocumentHelp>
          <DocumentInsert
            v-if="document ? (document.key ? true : false) : false"
            :allow-list="document ? document.acceptedProofs : null"
            :block-list="document ? document.refusedProofs : null"
          ></DocumentInsert>
        </TroubleshootingModal>

        <div class="fr-mt-3w">
          <div v-if="listType == 'dropDownList'">
            <validation-provider
              rules="select"
              name="professionalDocument"
              v-slot="{ errors, valid }"
            >
              <select
                v-model="document"
                class="fr-select fr-mb-3w fr-mt-3w"
                :class="{
                  'fr-select--valid': valid,
                  'fr-select--error': errors[0]
                }"
                id="select"
                as="select"
                @change="onSelectChange()"
              >
                <option
                  v-for="d in documentsDefinitions"
                  :value="d"
                  :key="d.key"
                >
                  {{ $parent.$t(d.key) }}
                </option>
              </select>
              <span class="fr-error-text" v-if="errors[0]">
                {{ $t(errors[0]) }}
              </span>
            </validation-provider>
          </div>
          <fieldset v-else class="fr-fieldset">
            <div class="fr-fieldset__content">
              <div class="fr-grid-row">
                <div
                  v-for="d in documentsDefinitions"
                  :key="d.key"
                  class="full-width-xs"
                >
                  <BigRadio
                    :val="d"
                    v-model="document"
                    @input="onSelectChange()"
                  >
                    <div
                      class="fr-grid-col"
                      :class="{ spa: listType === 'grid' }"
                    >
                      <span>{{ $parent.$t(d.key) }}</span>
                    </div>
                  </BigRadio>
                </div>
              </div>
            </div>
          </fieldset>
        </div>
      </div>
    </NakedCard>
    <ConfirmModal
      v-if="isDocDeleteVisible"
      @valid="validSelect()"
      @cancel="undoSelect()"
    >
      <span>{{ $t("will-delete-files") }}</span>
    </ConfirmModal>

    <slot name="after-select-block"></slot>
    <NakedCard
      class="fr-p-md-5w fr-mt-3w"
      v-if="showDownloader && (document.key || documentFiles.length > 0)"
    >
      <div class="fr-mb-3w">
        <p v-html="$t(`explanation-text.cotenant.${document.key}`)"></p>
      </div>
      <AllDeclinedMessages
        class="fr-mb-3w"
        :documentDeniedReasons="documentDeniedReasons"
        :documentStatus="documentStatus"
      ></AllDeclinedMessages>

      <div v-if="!(noDocument == true) || forceShowDownloader">
        <div v-if="documentFiles().length > 0" class="fr-col-md-12 fr-mb-3w">
          <ListItem
            v-for="(file, k) in documentFiles()"
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
      </div>
      <div
        v-if="allowNoDocument"
        class="fr-col-12 fr-mb-3w bg-purple fr-checkbox-group"
      >
        <input
          type="checkbox"
          id="noDocument"
          :checked="noDocument"
          @click="changeNoDocument($event)"
        />
        <label for="noDocument">
          {{
            document
              ? $parent.$t("noDocument-" + document.key)
              : $t("noDocument-default")
          }}
        </label>
      </div>

      <div
        class="fr-mb-5w"
        v-if="
          !forceShowDownloader && (dfDocument ? dfDocument.noDocument : null)
        "
      >
        <validation-provider
          :rules="{ required: true }"
          v-slot="{ errors, valid }"
        >
          <div class="fr-input-group">
            <label class="fr-label" for="customText">
              {{ $parent.$t(`customText-${document.key}`) }}
            </label>
            <textarea
              v-model="dfDocument.customText"
              class="form-control fr-input validate-required"
              :class="{
                'fr-input--valid': valid,
                'fr-input--error': errors[0]
              }"
              id="customText"
              name="customText"
              placeholder=""
              type="text"
              maxlength="2000"
              rows="3"
              required
            />
            <span
              >{{
                dfDocument
                  ? dfDocument.customText
                    ? dfDocument.customText.length
                    : 0
                  : 0
              }}
              / 2000</span
            >
            <span class="fr-error-text" v-if="errors[0]">{{
              $t(errors[0])
            }}</span>
          </div>
        </validation-provider>
      </div>

      <slot name="after-downloader"></slot>
    </NakedCard>
    <Modal
      v-show="showIsNoDocumentAndFiles"
      @close="showIsNoDocumentAndFiles = false"
    >
      <template v-slot:body>
        <div class="fr-container">
          <div class="fr-grid-row justify-content-center">
            <div class="fr-col-12">
              <p>
                {{ $t("warning-no-document-and-files") }}
              </p>
            </div>
          </div>
        </div>
      </template>
    </Modal>
  </div>
</template>

<script lang="ts">
import { RegisterService } from "@/services/RegisterService";
import { DfDocument } from "df-shared/src/models/DfDocument";
import { DfFile } from "df-shared/src/models/DfFile";
import { DocumentType } from "df-shared/src/models/Document";
import { DocumentDeniedReasons } from "df-shared/src/models/DocumentDeniedReasons";
import { UploadStatus } from "df-shared/src/models/UploadStatus";
import { User } from "df-shared/src/models/User";
import { cloneDeep } from "lodash";
import { Component, Prop, Vue } from "vue-property-decorator";
import DocumentInsert from "../share/DocumentInsert.vue";
import FileUpload from "../../uploads/FileUpload.vue";
import ListItem from "../../uploads/ListItem.vue";
import { ValidationProvider } from "vee-validate";
import WarningMessage from "df-shared/src/components/WarningMessage.vue";
import ConfirmModal from "df-shared/src/components/ConfirmModal.vue";
import DfButton from "df-shared/src/Button/Button.vue";
import VGouvFrModal from "df-shared/src/GouvFr/v-gouv-fr-modal/VGouvFrModal.vue";
import BigRadio from "df-shared/src/Button/BigRadio.vue";
import NakedCard from "df-shared/src/components/NakedCard.vue";
import AllDeclinedMessages from "../share/AllDeclinedMessages.vue";
import Modal from "df-shared/src/components/Modal.vue";
import DocumentHelp from "../../helps/DocumentHelp.vue";
import { UtilsService } from "@/services/UtilsService";
import TroubleshootingModal from "@/components/helps/TroubleshootingModal.vue";

@Component({
  components: {
    AllDeclinedMessages,
    DocumentInsert,
    FileUpload,
    ListItem,
    ValidationProvider,
    WarningMessage,
    ConfirmModal,
    Modal,
    DfButton,
    VGouvFrModal,
    BigRadio,
    NakedCard,
    DocumentHelp,
    TroubleshootingModal
  }
})
export default class DocumentDownloader extends Vue {
  @Prop() coTenantId!: number;
  @Prop() documentsDefinitions!: any;
  @Prop() documentCategory!: string;
  @Prop() editedDocumentId?: number;
  @Prop() dispatchMethodName!: string;
  @Prop() typeDocument!: string;
  @Prop({ default: "default" }) listType!: string;
  @Prop({ default: true }) showDownloader!: boolean;
  @Prop({ default: false }) allowNoDocument!: boolean;
  @Prop({ default: false }) forceShowDownloader!: boolean;

  localEditedDocumentId = this.editedDocumentId;
  documentDeniedReasons = new DocumentDeniedReasons();
  fileUploadStatus = UploadStatus.STATUS_INITIAL;
  document = new DocumentType();
  isDocDeleteVisible = false;
  selectedCoTenant!: User;

  dfDocument!: DfDocument;
  noDocument = false;
  showIsNoDocumentAndFiles = false;

  beforeMount() {
    this.loadDocument();
    this.noDocument = this.dfDocument?.noDocument == true;
    this.$emit("on-change-document", this.document, this.dfDocument);
  }

  changeNoDocument(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    if (!this.noDocument && Number(this.dfDocument?.files?.length) > 0) {
      this.showIsNoDocumentAndFiles = true;
      this.dfDocument.noDocument = this.noDocument;
      return;
    } else {
      this.noDocument = !this.noDocument;
      this.dfDocument.noDocument = this.noDocument;
    }
    this.$emit("on-change-document", this.document, this.dfDocument);
  }

  onSelectChange() {
    if (this.selectedCoTenant?.documents !== null) {
      const doc = this.getDocument();
      if (doc !== undefined) {
        this.isDocDeleteVisible =
          (doc.files?.length || 0) > 0 &&
          doc.documentSubCategory !== this.document.value;
      }
    }
    this.$emit("on-change-document", this.document, this.dfDocument);
    // why ? no
    this.noDocument = this.dfDocument?.noDocument == true;
    return false;
  }

  get documentStatus() {
    return this.getDocument()?.documentStatus;
  }
  documentFiles(): DfFile[] {
    return this.getDocument().files
      ? (this.getDocument().files as DfFile[])
      : [];
  }

  loadDocument(forceLoadLast?: boolean) {
    this.selectedCoTenant = UtilsService.getTenant(Number(this.coTenantId));
    if (this.localEditedDocumentId) {
      const doc = this.selectedCoTenant.documents
        ? (this.selectedCoTenant.documents.find((d: DfDocument) => {
            return (
              d.documentCategory === this.documentCategory &&
              d.id === this.localEditedDocumentId
            );
          }) as DfDocument)
        : undefined;

      this.dfDocument = doc ? doc : new DfDocument();
      if (this.localEditedDocumentId == -1 && forceLoadLast) {
        const docs = this.selectedCoTenant.documents?.filter(
          (d: DfDocument) => {
            return d.documentCategory === this.documentCategory;
          }
        ) as DfDocument[];

        this.dfDocument = docs[docs.length - 1];
        this.localEditedDocumentId = this.dfDocument.id;
      }
    } else {
      const doc = this.selectedCoTenant.documents
        ? (this.selectedCoTenant.documents.find((d: DfDocument) => {
            return d.documentCategory === this.documentCategory;
          }) as DfDocument)
        : undefined;

      this.dfDocument = doc ? doc : new DfDocument();
    }

    // loadDocType
    const localDoc = this.documentsDefinitions.find((d: DocumentType) => {
      return d.value === this.dfDocument.documentSubCategory;
    });
    if (localDoc !== undefined) {
      this.document = localDoc;
    }

    if (this.dfDocument?.documentDeniedReasons) {
      this.documentDeniedReasons = cloneDeep(
        this.dfDocument?.documentDeniedReasons
      ) as DocumentDeniedReasons;
    }
  }

  getDocument(): DfDocument {
    return this.dfDocument;
  }

  undoSelect() {
    if (this.selectedCoTenant?.documents !== null) {
      const doc = this.getDocument();
      if (doc !== undefined) {
        const localDoc = this.documentsDefinitions.find((d: DocumentType) => {
          return d.value === doc.documentSubCategory;
        });
        if (localDoc !== undefined) {
          this.document = localDoc;
        }
      }
    }
    this.isDocDeleteVisible = false;
  }

  validSelect() {
    this.isDocDeleteVisible = false;
    if (this.selectedCoTenant.documents !== null) {
      const doc = this.getDocument();
      if (doc?.files !== undefined) {
        for (const f of doc.files) {
          if (f.id) {
            this.remove(f);
          }
        }
      }
      this.localEditedDocumentId = -1;
    }
  }

  addFiles(fileList: File[]) {
    const filesToAdd = Array.from(fileList).map(f => {
      return { name: f.name, file: f, size: f.size };
    });
    if (!filesToAdd || filesToAdd.length <= 0) {
      return;
    }
    const futurLength = filesToAdd.length + this.documentFiles().length;
    if (
      this.document.maxFileCount &&
      futurLength > this.document.maxFileCount
    ) {
      Vue.toasted.global.max_file({
        message: this.$i18n.t("max-file", [
          futurLength,
          this.document.maxFileCount
        ])
      });
      return;
    }
    const formData = this._buildFormData(filesToAdd);

    this.fileUploadStatus = UploadStatus.STATUS_SAVING;

    const loader = this.$loading.show();
    this.$store
      .dispatch(this.dispatchMethodName, formData)
      .then(() => {
        this.fileUploadStatus = UploadStatus.STATUS_INITIAL;
        this.loadDocument(true);
        Vue.toasted.global.save_success();
      })
      .catch(err => {
        this.fileUploadStatus = UploadStatus.STATUS_FAILED;
        if (err.response.data.message.includes("NumberOfPages")) {
          Vue.toasted.global.save_failed_num_pages();
        } else {
          Vue.toasted.global.save_failed();
        }
      })
      .finally(() => {
        loader.hide();
      });
  }

  _buildFormData(filesToAdd: any): FormData {
    const formData = new FormData();
    const fieldName = "documents";
    Array.from(Array(filesToAdd.length).keys()).forEach(x => {
      const f: File = filesToAdd[x].file || new File([], "");
      formData.append(`${fieldName}[${x}]`, f, filesToAdd[x].name);
    });

    formData.append(this.typeDocument, this.document.value);
    formData.append("tenantId", this.coTenantId.toString());
    if (this.localEditedDocumentId && this.localEditedDocumentId > 0) {
      formData.append("id", this.localEditedDocumentId.toString());
    }
    this.$emit("enrich-form-data", formData);
    return formData;
  }

  resetFiles() {
    this.fileUploadStatus = UploadStatus.STATUS_INITIAL;
  }

  remove(file: DfFile) {
    if (file.id) {
      const loader = this.$loading.show();
      RegisterService.deleteFileById(Number(file.id))
        .then(() => {
          this.dfDocument = this.getDocument();
          this.dfDocument.files = this.dfDocument.files?.filter(
            f => file.id != f.id
          );

          Vue.toasted.global.save_success();
        })
        .catch(err => {
          console.log("Unable to delete last element?", err);
          Vue.toasted.global.save_failed();
        })
        .finally(() => {
          loader.hide();
        });
    }
  }
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
.spa {
  height: 3rem;
  @media all and (min-width: 768px) {
    width: 14rem;
  }
}
</style>

<i18n>
{
"en": {
  "files": "Documents",
  "will-delete-files": "Please note, a change of situation will result in the deletion of your supporting documents. You will have to upload the supporting documents corresponding to your situation again.",
  "register": "Register",
  "validate": "Validate",
  "cancel": "Cancel",
  "field-required": "This field is required",
  "warning-no-document-and-files":  "You can't have files and no document selected. You must uncheck the box or delete your files.",
  "noDocument-default": "I cannot provide such documents"
},
"fr": {
  "files": "Documents",
  "will-delete-files": "Attention, un changement de situation entraînera la suppression des justificatifs. Vous devrez charger de nouveau les justificatifs.",
  "register": "Enregistrer la pièce",
  "validate": "Valider",
  "cancel": "Annuler",
  "field-required": "Ce champ est requis",
  "warning-no-document-and-files": "Vous ne pouvez pas avoir des fichiers et indiquer ne pas pouvoir fournir tous les fichiers. Veuillez décocher la case ou supprimer vos fichiers.",
  "noDocument-default": "Je ne peux pas fournir les justificatifs demandés"
}
}


</i18n>
