<template>
  <div class="rf-container">
    <div class="rf-grid-row justify-content-center">
      <div class="rf-col-12">
        <div v-if="file.path">
          <img slot="image" v-auth-image="file.path" v-if="isImage()" />
          <PdfViewer :src="file.path" v-if="!isImage()"></PdfViewer>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { DfFile } from "df-shared/src/models/DfFile";
import { Component, Prop, Vue } from "vue-property-decorator";
import PdfViewer from "../PdfViewer.vue";
import { ImageService } from "@/services/ImageService";

@Component({
  components: {
    PdfViewer
  }
})
export default class ShowDoc extends Vue {
  @Prop({ default: "" }) file!: DfFile;

  isImage() {
    return ImageService.isImage(this.file);
  }
}
</script>
