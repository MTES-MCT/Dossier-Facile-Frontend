<template>
  <img slot="image" :src="imageData" />
</template>

<script setup lang="ts">
import axios from "axios";
import { Buffer } from "buffer";
import { onMounted, ref } from "vue";

const props = defineProps<{
  src: string;
}>();

const imageData = ref("");

onMounted(() => {
  axios({ method: "get", url: props.src, responseType: "arraybuffer" })
    .then((resp) => {
      const mimeType = resp.headers["content-type"].toLowerCase();
      const imgBase64 = new Buffer(resp.data, "binary").toString("base64");
      imageData.value = "data:" + mimeType + ";base64," + imgBase64;
    })
    .catch((err) => {
      console.dir(err);
      imageData.value = props.src;
    });
});
</script>
