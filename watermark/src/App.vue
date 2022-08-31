<script setup lang="ts">
import { useI18n } from "vue-i18n";
import { ref } from "vue";
import axios from "axios";
import ProgressIndicator from "./ProgressIndicator.vue";

const file = ref(null);
const token = ref("");
const wait = ref(false);
const url = ref("");

const { t } = useI18n();

const API_URL = import.meta.env.VITE_API_URL;

function getFile() {
  axios
    .get(`${API_URL}/api/document/url/${token.value}`)
    .then((res: any) => {
      if (res.data.url) {
        url.value = `${API_URL}/api/document/${token.value}`;
        wait.value = false;
      }
    })
    .catch(() => {
      setTimeout(function () {
        getFile();
      }, 2000);
    });
}

async function handleSubmit() {
  if (file.value === null) {
    return;
  }
  wait.value = true;
  url.value = "";
  const formData = new FormData();
  formData.append(`files`, file.value);
  axios
    .post(`${import.meta.env.VITE_API_URL}/api/document/files`, formData)
    .then((res: any) => {
      token.value = res.data.token;
      getFile();
    })
    .catch((err: any) => {
      console.dir(err);
      wait.value = false;
    });
}

function handleChange(e: any) {
  url.value = ""
  file.value = e.target.files[0];
}
</script>

<template>
  <header role="banner" class="fr-header">
    <div class="fr-header__body">
      <div class="fr-container">
        <div class="fr-header__body-row">
          <div class="fr-header__brand fr-enlarge-link">
            <div class="fr-header__brand-top">
              <div class="fr-header__logo">
                <a href="/" title="Accueil - FiligraneFacile">
                  <p class="fr-logo">
                    République
                    <br />Française
                  </p>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </header>
  <main class="fr-container">
    <h1 class="fr-h4 fr-mt-3w">
      {{ t("title") }}
    </h1>
    <form name="uploadForm" @submit.prevent="handleSubmit">
      <div class="fr-grid-row fr-grid-row--center">
        <div class="fr-col-12 fr-mb-3w">
          <div class="fr-input-group">
            <div class="fr-upload-group">
              <label class="fr-label" for="file-upload"
                >Ajouter des fichiers
                <span class="fr-hint-text">Formats supportés : jpg, png, pdf.</span>
              </label>
              <input
                class="fr-upload"
                type="file"
                name="files"
                @change="handleChange"
                accept="image/png, image/jpeg, application/pdf"
              />
            </div>
          </div>
        </div>

        <div class="fr-col-12 text-center fr-mb-5w">
          <button class="fr-btn" type="submit" :disabled="wait && !url">
            <span v-if="!wait || url">
              {{ t("submit") }}
            </span>
            <span v-if="wait && !url">
              {{ t("wait")}}
              <ProgressIndicator diameter="22px" border="3px" color="#000091" />
            </span>
          </button>
        </div>

        <div v-if="url">
          <a :href="url" target="_blank">Télécharger</a>
        </div>
      </div>
    </form>
  </main>
</template>

<style lang="scss">
@import "../../node_modules/@gouvfr/dsfr/dist/dsfr/dsfr.min.css";
@import "df-shared-next/src/scss/_main.scss";
</style>

<i18n>
{
  "en": {
    "title": "Add a watermark to any file",
    "submit": "Submit",
    "wait": "Please wait"
  },
  "fr": {
    "title": "Ajoutez un filigrane à n'importe quel document",
    "submit": "Envoyer",
    "wait": "Veuillez patienter"
  }
}
</i18n>
