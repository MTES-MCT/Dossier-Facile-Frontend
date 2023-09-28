<template>
  <div class="list-item fr-mb-1w doc-container">
    <div class="fr-grid-row" style="align-items: center">
      <div class="fr-mr-md-2w fr-mr-1w cursor--pointer" @click="openDoc()">
        <i class="ri-article-line fs-32 color--focus"></i>
      </div>
      <div class="text fr-pr-2w cursor--pointer" @click="openDoc()">
        <div class="text-bold">{{ getName() }}</div>
        <div class="size">{{ getSize() }}</div>
      </div>
      <div class="progress">
        <Progress :percentage="percentage" :state="uploadState" />
      </div>
      <button
        v-if="file.path || file.preview"
        class="fr-btn fr-btn--secondary icon-btn fr-mr-md-2w fr-mr-1w"
        @click="openDoc()"
        :title="$t('listitem.show')"
      >
        <i class="ri-eye-line fs-18 icons fr-m-1w"></i>
      </button>
      <button
        class="fr-btn fr-btn--secondary icon-btn"
        @click="remove()"
        type="button"
        :title="$t('listitem.remove')"
      >
        <i class="ri-delete-bin-2-fill fs-18 icons fr-m-1w"></i>
      </button>
    </div>
    <Modal @close="isDocModalVisible = false" v-if="isDocModalVisible">
      <template v-slot:body>
        <ShowDoc :file="file"></ShowDoc>
      </template>
    </Modal>
    <ConfirmModal
      v-if="confirmDeleteFile"
      @valid="validDeleteFile()"
      @cancel="undoDeleteFile()"
    >
      {{ $t("listitem.will-delete-file") }}
    </ConfirmModal>
  </div>
</template>

<script lang="ts">
import { DfFile } from "df-shared/src/models/DfFile";
import { Component, Prop, Vue } from "vue-property-decorator";
import Progress from "./Progress.vue";
import ShowDoc from "../documents/share/ShowDoc.vue";
import Modal from "df-shared/src/components/Modal.vue";
import { AnalyticsService } from "../../services/AnalyticsService";
import ConfirmModal from "df-shared/src/components/ConfirmModal.vue";

@Component({
  components: {
    Progress,
    ShowDoc,
    Modal,
    ConfirmModal,
  },
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
        return `${mb.toFixed(2)} ${this.$i18n.t("listitem.mb")}`;
      }
      return `${kb.toFixed(2)} ${this.$i18n.t("listitem.kb")}`;
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
  color: var(--g600);
}

.doc-container {
  background-color: white;
  border-radius: 0.5rem;
  padding: 1rem;
  @media (min-width: 768px) {
    padding: 1.5rem;
  }
  box-shadow: 0 0.5px 4px 0 #cecece;
}

.icons {
  --color-hover: var(--block-color-hover);
  --color-active: var(--block-color-active);
}

.fr-btn {
  box-shadow: none;
  --color-hover: none;
  --color-active: none;
  padding: 0;
  min-height: 2rem;
}

.icon-btn {
  &:hover {
    color: #dc3545 !important;
  }
  border: 1px solid var(--primary);
  background-color: var(--background-default-grey);
}
</style>
