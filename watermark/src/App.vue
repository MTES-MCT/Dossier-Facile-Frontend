<script setup lang="ts">
import { useI18n } from "vue-i18n";
import { ref } from "vue";
import axios from "axios";
import ProgressIndicator from "./ProgressIndicator.vue";
import { useToast } from "vue-toastification";

const files = ref([]);
const token = ref("");
const wait = ref(false);
const url = ref("");
const watermark = ref("");

const { t } = useI18n();
const toast = useToast();

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
      }, 5000);
    });
}

async function handleSubmit() {
  if (files.value === null) {
    return;
  }
  wait.value = true;
  url.value = "";
  const formData = new FormData();
  files.value.forEach( file => formData.append(`files[]`, file));
  formData.append(`watermark`, watermark.value);

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
  url.value = "";
  files.value = Array.from(e.target.files);
}

function like() {
  axios
    .get(`${import.meta.env.VITE_API_URL}/api/feedback/true`)
    .then((res: any) => {
      toast.info(t("feedback-registered").toString(), {
        timeout: 5000,
      });
    })
    .catch((err: any) => {
      console.dir(err);
    });
}

function dislike() {
  axios
    .get(`${import.meta.env.VITE_API_URL}/api/feedback/false`)
    .then((res: any) => {
      toast.info(t("feedback-registered").toString(), {
        timeout: 5000,
      });
    })
    .catch((err: any) => {
      console.dir(err);
    });
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
      <div class="fr-hint-text">
          {{ t("behaviour-1") }}<br/>
          {{ t("behaviour-2") }}<br/>
          {{ t("behaviour-3") }}<br/>
      </div>
    <form name="uploadForm" @submit.prevent="handleSubmit">
      <div class="fr-grid-row fr-grid-row--center">
        <div class="fr-col-12 fr-mb-3w">
          <div class="fr-input-group">
            <div class="fr-upload-group">
              <label class="fr-label" for="file-upload"
                >{{ t("add-file-label") }}
                <span class="fr-hint-text">Formats supportés : jpg, png, pdf.</span>
              </label>
              <input
                class="fr-upload"
                type="file"
                name="files"
                @change="handleChange"
                accept="image/png, image/jpeg, application/pdf"
                multiple
              />
            </div>
          </div>
        </div>
        <div class="fr-col-12 fr-mb-3w">
          <div class="fr-input-group">
            <div class="fr-text-group">
              <label class="fr-label" for="text">
                {{ t("add-watermark-label") }}
              </label>
              <input
                class="fr-input"
                type="text"
                v-model="watermark"
                :placeholder="'Ex: Document exclusivement destiné à la location immobilière'"
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
              {{ t("wait") }}
              <ProgressIndicator diameter="22px" border="3px" color="#000091" />
            </span>
          </button>
        </div>

        <div v-if="url">
          <a :href="url" target="_blank">Télécharger</a>
        </div>
      </div>
    </form>
    <div class="fr-mt-12w">
      <button type="button" class="like" @click="like">{{ t("like") }}</button>
      <button type="button" class="dislike" @click="dislike">{{ t("dislike") }}</button>
      <div class="fr-mt-3w">
        <a target="_blank" rel="noreferrer" class="twitter-share-button"
         :href="`https://twitter.com/intent/tweet?text=${encodeURIComponent(t('tweet-content' ))}`">
         <img style="twitter-img" src="./assets/logo_twitter.png" alt="{{ t('share-on-twitter') }}"/>
          </a
        >
      </div>
    </div>
  </main>
</template>

<style lang="scss">
@import "../../node_modules/@gouvfr/dsfr/dist/dsfr/dsfr.min.css";
@import "df-shared-next/src/scss/_main.scss";

.like {
  background-color: rgb(184, 254, 201);
  color: rgb(24, 117, 60);
  padding: 0.5rem;
  margin-right: 1rem;
  &:before {
    content: "";
    display: block;
    width: 15px;
    height: 15px;
    float: left;
    margin: 0 6px 0 0;
    background: url("./assets/like.svg");
  }
}

.dislike {
  background-color: #ffe9e6;
  color: #9c0400;
  padding: 0.5rem;
  margin-top: 1rem;
  &:before {
    content: "";
    display: block;
    width: 15px;
    height: 15px;
    float: left;
    margin: 0 6px 0 0;
    background: url("./assets/dislike.svg");
  }
}

.twitter-img {
  width: 90px;
  height: 30px;
}

.twitter-share-button {
  &:after {
    content: none;
  }
}
</style>

<i18n>
{
  "en": {
    "title": "Add a watermark to any file",
    "behaviour-1": "Watermarked file will be a pdf file.",
    "behaviour-2": "Original's files will be deleted immediately after the watermarked file generation.",
    "behaviour-3": "Watermarked file will be deleted immediately after the download (or 10 days if the file is not downloaded).",
    "add-file-label" : "Add files",
    "submit": "Submit",
    "wait": "Please wait",
    "like": "I liked this app",
    "dislike": "You can do better",
    "feedback-registered": "Thank you for your feedback",
    "tweet-content": "Usurpation d’identité, escroqueries, interdit bancaire... Découvrez Filigrane Facile, le site de l’État qui protège vos documents de toute réutilisation frauduleuse : https://filigrane.beta.gouv.fr",
    "share-on-twitter": "Share on twitter",
    "add-watermark-label": "Define the watermark to add"
  },
  "fr": {
    "title": "Ajoutez un filigrane à n'importe quel document",
    "behaviour-1": "Le fichier filigrané sera au format PDF.",
    "behaviour-2": "Les fichiers originaux seront effacés après la génération du fichier filigrané.",
    "behaviour-3": "Le fichier filigrané sera effacé après le premier téléchargement (ou 10 jours après s'il n'y a pas eu de téléchargement).",
    "add-file-label" : "Ajouter des fichiers",
    "submit": "Envoyer",
    "wait": "Veuillez patienter",
    "like": "J'ai aimé ce service",
    "dislike": "Vous pouvez mieux faire",
    "feedback-registered": "Merci pour votre retour",
    "tweet-content": "Usurpation d’identité, escroqueries, interdit bancaire... Découvrez Filigrane Facile, le site de l’État qui protège vos documents de toute réutilisation frauduleuse : https://filigrane.beta.gouv.fr",
    "share-on-twitter": "Partager sur twitter",
    "add-watermark-label": "Indiquez le filigrane à insérer"
  }
}
</i18n>
