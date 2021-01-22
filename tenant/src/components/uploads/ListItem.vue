<template>
  <div class="rf-p-1w list-item rf-mb-1w">
    <div class="rf-grid-row">
      <div class="rf-p-2w">
        <span class="icon icon-File"></span>
      </div>
      <div class="text rf-pr-2w">
        {{ getName() }}<br>
        <span class="size">{{ getSize() }}</span>
      </div>
      <div class="progress">
        <Progress :percentage="percentage" :state="uploadState" />
      </div>
      <div class="action-btn rf-p-2w" @click="openDoc()" :title="$t('show')" v-if="file.path">
        <i class="icon color--primary rf-p-1w icon-Eye-2"></i>
      </div>
      <div class="action-btn rf-p-2w" @click="remove()" :title="$t('remove')">
        <span class="icon icon-Recycling text-danger"></span>
      </div>
    </div>
    <Modal v-show="isDocModalVisible" @close="isDocModalVisible = false" v-if="file.path">
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
    Modal,
  },
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

  getUrl(path: string) {
    return `//${process.env.VUE_APP_API_URL}/api/file/tenants_file/${path}`;
  }

  getSize() {
    if (this.file.size) {
      return `${this.file.size / 1024} Kb`;
    }
    return "-";
  }

  getName() {
    return this.file.name ? this.file.name : this.file.path;
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
    "show": "Show the file"
  },
  "fr": {
    "FRENCH_IDENTITY_CARD": "Carte d'identité",
    "FRENCH_PASSPORT": "Passport",
    "FRENCH_RESIDENCE_PERMIT": "Permis de conduire",
    "OTHER_IDENTIFICATION": "Autre",
    "CERTIFICATE_VISA": "Visa",
    "remove": "Supprimer la pièce",
    "show": "Afficher la pièce"
  }
}
</i18n>
