<template>
  <div class="list-item fr-mb-1w doc-container">
    <div class="fr-grid-row" style="align-items: center">
      <div class="fr-pl-2w fr-pr-2w cursor--pointer" @click="openDoc()">
        <span class="material-icons big-blue">file_present</span>
      </div>
      <div class="text fr-pr-2w cursor--pointer" @click="openDoc()">
        <div class="text-bold">{{ getName() }}</div>
        <div class="size">{{ getSize() }}</div>
      </div>
      <div class="progress">
        <Progress :percentage="percentage" :state="uploadState" />
      </div>
      <button
        class="fr-btn fr-btn--secondary icon-btn"
        @click="openDoc()"
        :title="$t('show')"
      >
        <span class="material-icons-outlined md-28">visibility</span>
      </button>
      <button
        class="fr-btn fr-btn--secondary icon-btn"
        @click="remove()"
        :title="$t('remove')"
      >
        <span class="material-icons-outlined md-28">delete_forever</span>
      </button>
    </div>
    <Modal
      @close="isDocModalVisible = false"
      v-if="isDocModalVisible && file.path"
    >
      <template v-slot:body>
        <ShowDoc :file="file"></ShowDoc>
      </template>
    </Modal>
    <ConfirmModal
      v-if="confirmDeleteFile"
      @valid="validDeleteFile()"
      @cancel="undoDeleteFile()"
    >
      {{ $t("will-delete-file") }}
    </ConfirmModal>
  </div>
</template>

<script lang="ts">
import { DfFile } from "df-shared/src/models/DfFile";
import { Component, Prop, Vue } from "vue-property-decorator";
import Progress from "./Progress.vue";
import ShowDoc from "../documents/ShowDoc.vue";
import Modal from "df-shared/src/components/Modal.vue";
import { AnalyticsService } from "@/services/AnalyticsService";
import ConfirmModal from "df-shared/src/components/ConfirmModal.vue";

@Component({
  components: {
    Progress,
    ShowDoc,
    Modal,
    ConfirmModal
  }
})
export default class ListItem extends Vue {
  @Prop({ default: "" }) file!: DfFile;
  @Prop({ default: "idle" }) uploadState!: string;
  @Prop({ default: 0 }) percentage!: number;

  isDocModalVisible = false;
  confirmDeleteFile = false;

  remove() {
    this.confirmDeleteFile = true;
  }

  validDeleteFile() {
    this.$emit("remove");
    this.confirmDeleteFile = false;
  }

  undoDeleteFile() {
    this.confirmDeleteFile = false;
    return false;
  }

  openDoc() {
    AnalyticsService.viewFromMain();
    this.isDocModalVisible = true;
  }

  getSize() {
    if (this.file.size) {
      const kb = this.file.size / 1000;
      if (kb > 1000) {
        const mb = kb / 1000;
        return `${mb.toFixed(2)} ${this.$i18n.t("mb")}`;
      }
      return `${kb.toFixed(2)} ${this.$i18n.t("kb")}`;
    }
    return "-";
  }

  getName() {
    return this.file.name ? this.file.name : this.file.originalName;
  }
}
</script>

<style scoped lang="scss">
.progress {
  float: left;
}
.text {
  float: right;
  flex: 2;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  @media (max-width: 768px) {
    max-width: 215px;
  }
}

.text > div {
  overflow: hidden;
  text-overflow: ellipsis;
}

.text-bold {
  font-weight: bold;
}
.row {
  height: 42px;
  display: flex;
  flex-direction: row;
  align-items: center;
}

.list-item {
  background-color: var(--g200);
}

.size {
  font-size: 12px;
  color: var(--g500);
}

.doc-container {
  background-color: white;
  border-radius: 0.5rem;
  padding: 0.5rem;
}

.big-blue {
  color: var(--focus);
  font-size: 32px;
}

.material-icons,
.material-icons-outlined {
  border-radius: 50%;
  --color-hover: var(--block-color-hover);
  --color-active: var(--block-color-active);
  padding: 0.25rem;
}

.fr-btn {
  box-shadow: none;
  background-color: none;
  --color-hover: none;
  --color-active: none;
  padding: 0;
}

.icon-btn {
  &:hover {
    color: #dc3545 !important;
  }
  display: block;
  height: 2.5rem;
  width: 2.5rem;
  border-radius: 50%;
  overflow: hidden;
}
</style>

<i18n>
{
  "en": {
    "FRENCH_IDENTITY_CARD": "Identity card",
    "FRENCH_PASSPORT": "Passport",
    "FRENCH_RESIDENCE_PERMIT": "Driver's license",
    "OTHER_IDENTIFICATION": "Other",
    "CERTIFICATE_VISA": "Visa",
    "remove": "Delete the file",
    "show": "Show the file",
    "mb": "MB",
    "kb": "KB",
    "will-delete-file": "Are you sure you want to delete this file ?"
  },
  "fr": {
    "FRENCH_IDENTITY_CARD": "Carte d'identité",
    "FRENCH_PASSPORT": "Passport",
    "FRENCH_RESIDENCE_PERMIT": "Permis de conduire",
    "OTHER_IDENTIFICATION": "Autre",
    "CERTIFICATE_VISA": "Visa",
    "remove": "Supprimer la pièce",
    "show": "Afficher la pièce",
    "mb": "Mo",
    "kb": "Ko",
    "will-delete-file": "Êtes-vous sûr·e de vouloir supprimer ce fichier ?"
  }
}
</i18n>
