<template>
  <div class="file-upload rf-col-lg-8 rf-col-md-12">
    <form name="uploadForm" enctype="multipart/form-data" novalidate>
      <div class="dropbox">
        <input
          type="file"
          multiple
          :disabled="isSaving()"
          @change="filesChange"
          class="input-file"
          accept="image/png, image/jpeg, application/pdf"
        />
        <p v-if="canUpload()">
          Ajouter un ou plusieurs documents
        </p>
        <p v-if="isSaving()">Téléchargement de {{ fileCount }} fichiers...</p>
        <div v-if="isFailed()">
          <h2>{{ $t('send-problem') }}</h2>
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
import { UploadStatus } from "./UploadStatus";

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
    return (
      this.currentStatus === STATUS_INITIAL ||
      this.currentStatus === STATUS_SUCCESS
    );
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

  filesChange(e: any) {
    [...e.target.files].forEach((f: File) =>
    {
      if (f.size > 3 * 1024 * 1024) {
        this.$toasted.show(this.$i18n.t('file-too-big').toString(), {type: 'error', duration: 5000})
        return false;
      }
      return true;
    });
    const fileList = [...e.target.files].filter((f: File) => {
      return f.size < 3 * 1024 * 1024;
    });
    this.$emit("add-files", fileList);
    const form = document.getElementsByName("uploadForm");
    form.forEach((f: any) => {
      f.reset();
    })
  }
}
</script>

<style scoped lang="scss">
.dropbox {
  outline: 2px dashed grey;
  outline-offset: -10px;
  color: dimgray;
  background-color: var(--bf500);
  color: var(--g100);
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
  background-image: linear-gradient(0deg,var(--color-active),var(--color-active));
  --color-hover: rgba(0, 0, 246, 0.5);
  --color-active: rgba(91, 91, 255, 0.5);
}

.dropbox p {
  font-size: 1em;
  text-align: center;
}
</style>

<i18n>
{
  "en": {
    "send-problem": "Problème d'envoi.",
    "file-too-big": "The file is limited to 3MB"
  },
  "fr": {
    "send-problem": "Problème d'envoi.",
    "file-too-big": "La taille d'un fichier ne doit pas dépasser 3Mo"
  }
}
</i18n>