<template>
  <div class="file-upload rf-col-6">
    <form enctype="multipart/form-data" novalidate>
      <div class="dropbox">
        <input
          type="file"
          multiple
          :disabled="isSaving()"
          @change="
            filesChange($event.target.files);
            fileCount = $event.target.files.length;
          "
          class="input-file"
        />
        <p v-if="canUpload()">
          Ajouter un ou plusieurs documents
        </p>
        <p v-if="isSaving()">Téléchargement de {{ fileCount }} fichiers...</p>
        <div v-if="isFailed()">
          <h2>Problème d'envoie.</h2>
          <p>
            <a href="javascript:void(0)" @click="reset()">Réessayer</a>
          </p>
        </div>
      </div>
    </form>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { UploadStatus } from "@/components/uploads/UploadStatus";

const {
  STATUS_INITIAL,
  STATUS_SUCCESS,
  STATUS_SAVING,
  STATUS_FAILED
} = UploadStatus;

@Component
export default class FileUpload extends Vue {
  @Prop({ default: STATUS_INITIAL }) currentStatus!: number;

  uploadedFiles = [];
  fileCount = 0;

  canUpload() {
    return this.currentStatus === STATUS_INITIAL || this.currentStatus === STATUS_SUCCESS;
  }

  isSaving() {
    return this.currentStatus === STATUS_SAVING;
  }

  isSuccess() {
    return this.currentStatus === STATUS_SUCCESS;
  }

  isFailed() {
    return this.currentStatus === STATUS_FAILED;
  }

  reset() {
    this.uploadedFiles = [];
    this.fileCount = 0;
    this.$emit("reset-files");
  }

  filesChange(fileList: File[]) {
    this.$emit("add-files", fileList);
  }
}
</script>

<style scoped lang="scss">
.dropbox {
  outline: 2px dashed grey;
  outline-offset: -10px;
  color: dimgray;
  padding: 10px 10px;
  min-height: 50px;
  position: relative;
  cursor: pointer;
}

.input-file {
  opacity: 0;
  width: 100%;
  height: 100%;
  position: absolute;
  cursor: pointer;
}

.dropbox:hover {
  background: lightblue;
}

.dropbox p {
  font-size: 1em;
  text-align: center;
}
</style>
