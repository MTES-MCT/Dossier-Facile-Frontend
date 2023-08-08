<script setup lang="ts">
import axios from "axios";

const props = defineProps<{
  url: string;
  fileName: string;
}>();

const emit = defineEmits(["on-downloaded"]);

function downloadFile() {
  axios
    .get(props.url, { responseType: "blob" })
    .then((response) => {
      const blob = new Blob([response.data], { type: "application/pdf" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = props.fileName;
      link.click();
      URL.revokeObjectURL(link.href);
      emit("on-downloaded");
    })
    .catch(console.error);
}
</script>

<template>
  <a
    :href="props.url"
    target="_blank"
    @click.prevent="downloadFile()"
  >
    Télécharger le document filigrané
  </a>
</template>

<style scoped lang="scss"></style>