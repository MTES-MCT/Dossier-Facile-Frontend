<script setup lang="ts">
import { useI18n } from "vue-i18n";
import { ref } from "vue";
import axios from "axios";
import ProgressIndicator from "./ProgressIndicator.vue";
import { useToast } from "vue-toastification";
import Downloader from "./components/Downloader.vue";

const files = ref<File[]>([]);
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

function getWatermarkedFileName() {
  const originalFileNames = files.value.map(file => file.name.split('.')[0]);
  return originalFileNames.join('_') + '_filigrane';
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
            <div class="fr-header__service">
                <p class="fr-header__service-title">
                  <span style="font-weight: normal">Filigrane</span>Facile
                  <span class="fr-badge fr-badge--sm fr-badge--green-menthe">BÊTA</span>
                </p>
            </div>
          </div>
          <div class="fr-header__tools">
            <div class="fr-header__tools-links">
              <ul class="fr-btns-group">
                <li>
                  <a class="fr-btn fr-icon-add-circle-line" href="https://www.dossierfacile.fr" target="_blank">
                    Vous constituez un dossier de location ? Essayez DossierFacile
                  </a>
                </li>
              </ul>
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
    <div class="fr-alert fr-alert--info fr-mb-3w">
      <p v-html="t('behaviour-1')"></p>
      <p v-html="t('behaviour-2')"></p>
      <p v-html="t('behaviour-3')"></p>
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
                :placeholder="'Ex : Document exclusivement destiné à la location immobilière'"
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

        <Downloader
          v-if="url"
          :url="url"
          :fileName="getWatermarkedFileName()"
          @on-downloaded="url = ''"
        />
      </div>
    </form>
    <div class="fr-mt-3w">
      <a target="_blank" rel="noreferrer" class="twitter-share-button"
         :href="`https://twitter.com/intent/tweet?text=${encodeURIComponent(t('tweet-content' ))}`">
        <img style="twitter-img" src="./assets/logo_twitter.png" alt="{{ t('share-on-twitter') }}"/>
      </a
      >
    </div>
    <div class="fr-mb-3w">
      <button type="button" class="like" @click="like">{{ t("like") }}</button>
      <button type="button" class="dislike" @click="dislike">{{ t("dislike") }}</button>
      <div class="fr-mt-1w">
        Une suggestion ? Contactez-nous : <a href='mailto:contact@dossierfacile.fr'>contact@dossierfacile.fr</a>
      </div>
    </div>
  </main>
  <footer role="contentinfo" id="footer" tabindex="-1">
    <div class="fr-follow">
      <div class="fr-container">
        <div class="fr-grid-row">
          <div class="fr-col-12">
            <div class="fr-follow__social">
              <h2 class="fr-h5">Suivez-nous sur les réseaux sociaux</h2>
              <ul class="fr-btns-group">
                <li>
                  <a
                    class="fr-btn--twitter fr-btn"
                    title="Suivre Dossier facile sur twitter - Ouvre une nouvelle fenêtre"
                    href="https://twitter.com/dossierfacile/"
                    target="_blank"
                  >
                    Suivre Dossier facile sur twitter
                  </a>
                </li>
                <li>
                  <a
                    class="fr-btn--facebook fr-btn"
                    title="Suivre Dossier facile sur facebook - Ouvre une nouvelle fenêtre"
                    href="https://www.facebook.com/DossierFacile.fr/"
                    target="_blank"
                  >
                    Suivre Dossier facile sur facebook
                  </a>
                </li>
                <li>
                  <a
                    class="fr-btn--linkedin fr-btn"
                    lang="en"
                    title="Suivre Dossier facile sur linkedin - Ouvre une nouvelle fenêtre"
                    href="https://www.linkedin.com/company/startup-d-etat-locatio/"
                    target="_blank"
                  >
                    Suivre Dossier facile sur linkedin
                  </a>
                </li>
                <li>
                  <a
                    class="fr-btn--instagram fr-btn"
                    title="Suivre Dossier facile sur instagram - Ouvre une nouvelle fenêtre"
                    href="https://www.instagram.com/dossierfacile/"
                    target="_blank"
                  >
                    Suivre Dossier facile sur instagram
                  </a>
                </li>
                <li>
                  <a
                    class="fr-btn--tiktok fr-btn"
                    title="Suivre Dossier facile sur tiktok - Ouvre une nouvelle fenêtre"
                    href="https://www.tiktok.com/@dossierfacile/"
                    target="_blank"
                  >
                    Suivre Dossier facile sur tiktok
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </footer>
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
