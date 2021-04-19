<template>
  <div class="list-item fr-mb-1w">
    <div class="fr-grid-row" style="align-items: center">
      <div class="fr-pl-2w fr-pr-2w">
        <span class="material-icons">file_present</span>
      </div>
      <div class="text fr-pr-2w">
        {{ getName() }}<br />
        <span class="size">{{ getSize() }}</span>
      </div>
      <div class="progress">
        <Progress :percentage="percentage" :state="uploadState" />
      </div>
      <div
        class="action-btn fr-p-1w"
        @click="openDoc()"
        :title="$t('show')"
        v-if="file.path"
      >
        <span
          class="color--primary material-icons material-icons-outlined md-36"
          >visibility</span
        >
      </div>
      <div class="action-btn fr-pr-1w" @click="remove()" :title="$t('remove')">
        <span class="material-icons md-36 text-danger">delete_forever</span>
      </div>
    </div>
    <Modal
      @close="isDocModalVisible = false"
      v-if="isDocModalVisible && file.path"
    >
      <template v-slot:body>
        <ShowDoc :file="file"></ShowDoc>
      </template>
    </Modal>
  </div>
</template>

<script lang="ts">
import { DfFile } from "df-shared/src/models/DfFile";
import { Component, Prop, Vue } from "vue-property-decorator";
import Progress from "./Progress.vue";
import ShowDoc from "../documents/ShowDoc.vue";
import Modal from "df-shared/src/components/Modal.vue";

@Component({
  components: {
    Progress,
    ShowDoc,
    Modal
  }
})
export default class ListItem extends Vue {
  @Prop({ default: "" }) file!: DfFile;
  @Prop({ default: "idle" }) uploadState!: string;
  @Prop({ default: 0 }) percentage!: number;

  isDocModalVisible = false;

  remove() {
    this.$emit("remove");
  }

  openDoc() {
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
  &.sm {
    flex: 1;
  }
}
.row {
  height: 42px;
  display: flex;
  flex-direction: row;
  align-items: center;
}

.action-btn {
  align-self: center;
  cursor: pointer;
}

.list-item {
  background-color: var(--g200);
}

.size {
  color: var(--g500);
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
    "kb": "KB"
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
    "kb": "Ko"
  }
}
</i18n>
