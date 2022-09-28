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
      {{ MESSAGE }}
      <button class="fr-btn--close close" @click="closeAnnouncement()"></button>
    </div>
  </div>
</template>

<style scoped lang="scss">
.announcement {
  background-color: #45a07a;
  color: #fff;
}
.message {
  display: flex;
  align-items: center;
}
.close {
  color: #fff;
}
</style>
