<template>
  <div class="rf-container">
    <div class="row justify-content-center">
      <div class="col-12 col-md-8">
        <div>
          <img :src="getUrl(file.path)" v-if="isImage()" />
          <PdfViewer
            :src="getUrl(file.path)"
            v-if="!isImage()"
          ></PdfViewer>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { DfFile } from "df-shared/src/models/DfFile";
import { Component, Prop, Vue } from "vue-property-decorator";
import PdfViewer from "../PdfViewer.vue";

@Component({
  components: {
    PdfViewer
  }
})
export default class ShowDoc extends Vue {
  @Prop({ default: "" }) file!: DfFile;

  getUrl(path: string) {
    return `//${process.env.VUE_APP_API_URL}/api/file/tenants_file/${path}`;
  }

  isImage() {
    if (this.file.path) {
      return !this.file.path.endsWith('pdf');
    }
    return !this.file.name?.endsWith('pdf');
  }
}
</script>