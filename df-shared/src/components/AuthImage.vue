<template>
  <img slot="image" :src="imageData" />
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import axios from "axios";
import { Buffer } from "buffer";

@Component
export default class AuthImage extends Vue {
  @Prop() src!: string;
  imageData = "";

  mounted() {
    axios({ method: "get", url: this.src, responseType: "arraybuffer" })
      .then((resp) => {
        const mimeType = resp.headers["content-type"].toLowerCase();
        const imgBase64 = new Buffer(resp.data, "binary").toString("base64");
        this.imageData = "data:" + mimeType + ";base64," + imgBase64;
      })
      .catch((err) => {
        console.dir(err);
        this.imageData = this.src;
      });
  }
}
</script>
