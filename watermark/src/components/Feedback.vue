<script setup lang="ts">
import axios from "axios";
import { useI18n } from "vue-i18n";
import { useToast } from "vue-toastification";

const { t } = useI18n();
const toast = useToast();

function like() {
  axios
    .get(`${import.meta.env.VITE_API_URL}/api/feedback/true`)
    .then(() => {
      toast.info(t("feedback.feedback-registered").toString(), {
        timeout: 5000,
      });
    })
    .catch((err) => {
      console.dir(err);
    });
}

function dislike() {
  axios
    .get(`${import.meta.env.VITE_API_URL}/api/feedback/false`)
    .then(() => {
      toast.info(t("feedback.feedback-registered").toString(), {
        timeout: 5000,
      });
    })
    .catch((err) => {
      console.dir(err);
    });
}
</script>

<template>
  <div class="fr-mt-3w">
    <a
      target="_blank"
      rel="noreferrer"
      class="twitter-share-button"
      :href="`https://twitter.com/intent/tweet?text=${encodeURIComponent(
        t('feedback.tweet-content')
      )}`"
    >
      <img
        class="twitter-img"
        src="./../assets/logo_twitter.png"
        alt="{{ t('feedback.share-on-twitter') }}"
      />
    </a>
  </div>
  <div class="fr-mb-3w">
    <button type="button" class="like" @click="like">
      {{ t("feedback.like") }}
    </button>
    <button type="button" class="dislike" @click="dislike">
      {{ t("feedback.dislike") }}
    </button>
    <div class="fr-mt-1w">
      Une suggestion ? Contactez-nous :
      <a href="mailto:contact@filigrane.beta.gouv.fr"
        >contact@filigrane.beta.gouv.fr</a
      >
    </div>
  </div>
</template>

<style scoped lang="scss">
.twitter-img {
  width: 90px;
  height: 30px;
}

.twitter-share-button {
  &:after {
    content: none;
  }
}

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
    background: url("./../assets/like.svg");
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
    background: url("./../assets/dislike.svg");
  }
}
</style>
