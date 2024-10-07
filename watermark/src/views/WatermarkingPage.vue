<script setup lang="ts">
import Downloader from "../components/Downloader.vue";
import ProgressIndicator from "../components/ProgressIndicator.vue";
import axios from "axios";
import { ref } from "vue";
import { useI18n } from "vue-i18n";
import Feedback from "../components/Feedback.vue";
import { useToast } from "vue-toastification";

const { t } = useI18n();
const toast = useToast();

const files = ref<File[]>([]);
const token = ref("");
const wait = ref(false);
const url = ref("");
const watermark = ref("");

const API_URL = import.meta.env.VITE_API_URL;

async function handleSubmit() {
  if (files.value.length === 0) {
    return;
  }
  wait.value = true;
  url.value = "";
  const formData = new FormData();
  files.value.forEach((file) => formData.append(`files[]`, file));
  formData.append(`watermark`, watermark.value);

  axios
    .post(`${API_URL}/api/document/files`, formData)
    .then((res) => {
      token.value = res.data.token;
      getFile();
    })
    .catch((err) => {
      console.dir(err);
      toast.error(t("watermarking-page.upload-error"));
      wait.value = false;
    });
}

function handleChange(e: Event) {
  url.value = "";
  if (e.target instanceof HTMLInputElement) {
    files.value = Array.from(e.target.files || []);
  }
}

function getWatermarkedFileName() {
  const originalFileNames = files.value.map((file) => file.name.split(".")[0]);
  return originalFileNames.join("_") + "_filigrane";
}

function getFile() {
  axios
    .get(`${API_URL}/api/document/url/${token.value}`)
    .then((res) => {
      if (res.data.url) {
        url.value = `${API_URL}/api/document/${token.value}`;
        wait.value = false;
      }
    })
    .catch(() => {
      setTimeout(function () {
        getFile();
      }, 5000);
    });
}
</script>

<template>
  <h1 class="fr-h4">
    {{ t("watermarking-page.title") }}
  </h1>
  <p>{{ t("watermarking-page.subtitle-cnil") }}</p>
  <div class="fr-alert fr-alert--info fr-mb-3w">
    <p v-html="t('watermarking-page.behaviour-1')"></p>
    <p v-html="t('watermarking-page.behaviour-2')"></p>
    <p v-html="t('watermarking-page.behaviour-3')"></p>
  </div>
  <form name="uploadForm" @submit.prevent="handleSubmit">
    <div class="fr-grid-row fr-grid-row--center">
      <div class="fr-col-12 fr-mb-3w">
        <div class="fr-input-group">
          <div class="fr-upload-group">
            <label class="fr-label" for="file-upload"
              >{{ t("watermarking-page.add-file-label") }}
              <span class="fr-hint-text">
                {{ t("watermarking-page.supported-file-format") }}
              </span>
            </label>
            <input
              class="fr-upload"
              type="file"
              name="files"
              @change="handleChange"
              accept="image/png, image/jpeg, application/pdf"
              multiple
              required
            />
          </div>
        </div>
      </div>
      <div class="fr-col-12 fr-mb-3w">
        <div class="fr-input-group">
          <div class="fr-text-group">
            <label class="fr-label" for="text">
              {{ t("watermarking-page.add-watermark.label") }}
            </label>
            <input
              class="fr-input"
              type="text"
              v-model="watermark"
              :placeholder="t('watermarking-page.add-watermark.placeholder')"
            />
          </div>
        </div>
      </div>

      <div class="fr-col-12 text-center fr-mb-5w">
        <button class="fr-btn" type="submit" :disabled="wait && !url">
          <span v-if="!wait || url">
            {{ t("watermarking-page.submit") }}
          </span>
          <span v-if="wait && !url">
            {{ t("watermarking-page.wait") }}
            <ProgressIndicator diameter="22px" border="3px" color="#000091" />
          </span>
        </button>
      </div>

      <Downloader
        v-if="url"
        :url="url"
        :fileName="getWatermarkedFileName()"
        @on-downloaded="url = ''"
      />
    </div>
  </form>
  <Feedback />
</template>
