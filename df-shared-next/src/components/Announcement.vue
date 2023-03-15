<script setup lang="ts">
import { useCookies } from "vue3-cookies";
const { cookies } = useCookies();

const MESSAGE = `${import.meta.env.VITE_ANNOUNCEMENT_MESSAGE}`;
const MAIN_URL = `//${import.meta.env.VUE_APP_MAIN_URL}`;

const announcementClosedCookieKey = `announcement-closed-${btoa(MESSAGE)}`;
let announcementClosed = cookies.get(announcementClosedCookieKey) === "true";

function isVisible() {
  const isMessageSet = MESSAGE.trim().length > 0;
  return isMessageSet && !announcementClosed;
}

function createAnnouncementClosedCookie() {
  const expirationDate = new Date();
  expirationDate.setDate(expirationDate.getDate() + 1);
  const domain = MAIN_URL.endsWith("dossierfacile.fr")
    ? "dossierfacile.fr"
    : "";

  cookies.set(
    announcementClosedCookieKey,
    "true",
    expirationDate.toUTCString(),
    "",
    domain
  );
}

function closeAnnouncement() {
  createAnnouncementClosedCookie();
  announcementClosed = true;
}
</script>

<template>
  <div class="announcement fr-pt-2w fr-pb-2w" v-if="isVisible()">
    <div class="fr-container message">
      <span v-html="MESSAGE"></span>
      <button
        title="Fermer l'annonce"
        class="fr-btn--close close"
        @click="closeAnnouncement()"
      ></button>
    </div>
  </div>
</template>

<style scoped lang="scss">
.announcement {
  background-color: #18753c;
  color: #fff;
}
.message {
  display: flex;
  align-items: center;
}
.close {
  color: #fff;
  &:hover {
    background-color: rgba(250, 250, 250, 0.7);
    color: #000;
  }
}

.fr-btn--close {
  display: flex;
  align-items: center;
  justify-content: center;
  &:before {
    margin-left: 0;
  }
}
</style>
