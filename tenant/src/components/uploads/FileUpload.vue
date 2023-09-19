<template>
  <div class="file-upload fr-col-md-12">
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
        <div v-if="!isSaving()" class="fr-mt-2w fr-mb-2w">
          {{ $t("fileupload.drag-and-drop-files") }}
          <br />
          {{ $t("fileupload.files-format") }}<br />
          {{ getSizeLimit() }}<br />
          {{ getPagesLimit() }}<br />
          {{ $t("fileupload.or") }}<br />
          <a href="#">{{ $t("fileupload.browse-files") }}</a>
        </div>
        <div v-if="isSaving()">
          {{ $t("fileupload.uploading-files") }}
        </div>
      </div>
    </form>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { UploadStatus } from "df-shared/src/models/UploadStatus";

const { STATUS_INITIAL, STATUS_SUCCESS, STATUS_SAVING, STATUS_FAILED } =
  UploadStatus;

@Component
export default class FileUpload extends Vue {
  @Prop({ default: STATUS_INITIAL }) currentStatus!: number;
  @Prop({ default: 0 }) page!: number;
  @Prop({ default: 10 }) size!: number;

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
      if (f.size > this.size * 1024 * 1024) {
        Vue.toasted.global.error_toast({
          message: this.$i18n.t("fileupload.file-too-big", [this.size]),
        });
        return false;
      }
      return true;
    });
    const fileList = [...e.target.files].filter((f: File) => {
      return f.size < this.size * 1024 * 1024;
    });
    this.$emit("add-files", fileList);
    const form = document.getElementsByName("uploadForm");
    form.forEach((f: any) => {
      f.reset();
    });
  }

  getSizeLimit() {
    if (this.size > 0) {
      return this.$i18n.t("fileupload.size", [this.size]);
    }
    return "";
  }

  getPagesLimit() {
    if (this.page > 0) {
      return this.$i18n.t("fileupload.pages", [this.page]);
    }
    return "";
  }
}
</script>

<style scoped lang="scss">
.dropbox {
  outline: 2px dashed var(--primary);
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

.file-upload:focus-within {
  outline-style: auto;
  outline-width: 2px;
  outline-offset: 4px;
  outline-color: #0a76f6;
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

.dropbox div {
  font-size: 1em;
  text-align: center;
}
</style>
