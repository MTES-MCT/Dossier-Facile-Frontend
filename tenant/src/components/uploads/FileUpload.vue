<template>
  <div class="file-upload">
    <form enctype="multipart/form-data" novalidate v-if="isInitial || isSaving">
      <div class="dropbox">
        <input
          type="file"
          multiple
          :name="uploadFieldName"
          :disabled="isSaving()"
          @change="
            filesChange($event.target.name, $event.target.files);
            fileCount = $event.target.files.length;
          "
          class="input-file"
        />
        <p v-if="isInitial()">
          Drag your file(s) here to begin<br />
          or click to browse
        </p>
        <p v-if="isSaving">Uploading {{ fileCount }} files...</p>
      </div>
    </form>
    <div v-if="isSuccess()">
      <h2>Uploaded {{ uploadedFiles.length }} file(s) successfully.</h2>
      <p>
        <a href="javascript:void(0)" @click="reset()">Upload again</a>
      </p>
      <ul class="list-unstyled">
        <li v-for="(item, k) in uploadedFiles" :key="k">
          <img
            :src="item.url"
            class="img-responsive img-thumbnail"
            :alt="item.originalName"
          />
        </li>
      </ul>
    </div>
    <div v-if="isFailed()">
      <h2>Uploaded failed.</h2>
      <p>
        <a href="javascript:void(0)" @click="reset()">Try again</a>
      </p>
      <pre>{{ uploadError }}</pre>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { UploadService } from "./UploadService";

const STATUS_INITIAL = 0,
  STATUS_SAVING = 1,
  STATUS_SUCCESS = 2,
  STATUS_FAILED = 3;

@Component
export default class FileUpload extends Vue {
  uploadedFiles = [];
  uploadError = null;
  currentStatus: number = STATUS_INITIAL;
  uploadFieldName = "documents";
  fileCount = 0;

  isInitial() {
    return this.currentStatus === STATUS_INITIAL;
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
    this.currentStatus = STATUS_INITIAL;
    this.uploadedFiles = [];
    this.uploadError = null;
  }

  save(formData: FormData) {
    this.currentStatus = STATUS_SAVING;

    UploadService.upload(formData)
      .then(x => {
        this.uploadedFiles = [].concat(x);
        this.currentStatus = STATUS_SUCCESS;
      })
      .catch(err => {
        this.uploadError = err.response;
        this.currentStatus = STATUS_FAILED;
      });
  }

  filesChange(fieldName: string, fileList: File[]) {
    const formData = new FormData();

    if (!fileList.length) return;

    Array.from(Array(fileList.length).keys()).map(x => {
      formData.append(fieldName, fileList[x], fileList[x].name);
    });

    this.save(formData);
  }
}
</script>

<style scoped lang="scss">
.dropbox {
  outline: 2px dashed grey;
  outline-offset: -10px;
  color: dimgray;
  padding: 10px 10px;
  min-height: 100px;
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
  font-size: 1.2em;
  text-align: center;
}
</style>
