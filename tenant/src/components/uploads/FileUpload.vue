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
        <p v-if="!isSaving()">
          Glissez et déposez vos documents
          <br />
          JPG, PNG ou PDF<br />
          {{ getSizeLimit() }}<br />
          {{ getPagesLimit() }}
        </p>
        <p>
          ou<br />
          <a href="#">Parcourez vos fichiers</a>
        </p>
        <p v-if="isSaving()">Téléchargement des fichiers...</p>
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
  @Prop({ default: 0 }) page!: number;
  @Prop({ default: 5 }) size!: number;

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
    [...e.target.files].forEach((f: File) => {
      // TODO parameterize this number
      if (f.size > 5 * 1024 * 1024) {
        this.$toasted.show(this.$i18n.t("file-too-big").toString(), {
          type: "error",
          duration: 5000
        });
        return false;
      }
      return true;
    });
    const fileList = [...e.target.files].filter((f: File) => {
      return f.size < 5 * 1024 * 1024;
    });
    this.$emit("add-files", fileList);
    const form = document.getElementsByName("uploadForm");
    form.forEach((f: any) => {
      f.reset();
    });
  }

  getSizeLimit() {
    if (this.size > 0) {
      return this.$i18n.t("size", [this.size]);
    }
    return "";
  }

  getPagesLimit() {
    if (this.page > 0) {
      return this.$i18n.t("pages", [this.page]);
    }
    return "";
  }
}
</script>

<style scoped lang="scss">
.dropbox {
  outline: 2px dashed var(--tertiary);
  outline-offset: -10px;
  background-color: var(--g200);
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
  background-image: linear-gradient(
    0deg,
    var(--color-active),
    var(--color-active)
  );
  --color-hover: rgba(0, 0, 246, 0.1);
  --color-active: rgba(91, 91, 255, 0.1);
}

.dropbox p {
  font-size: 1em;
  text-align: center;
}
</style>

<i18n>
{
  "en": {
    "send-problem": "Send error.",
    "file-too-big": "The file is limited to 5MB",
    "pages": "{0} pages maximum",
    "size": " {0}MB maximum per file"
  },
  "fr": {
    "send-problem": "Problème d'envoi.",
    "file-too-big": "La taille d'un fichier ne doit pas dépasser 5Mo",
    "pages": "{0} pages maximum",
    "size": " {0}Mo maximum par fichier"
  }
}
</i18n>
