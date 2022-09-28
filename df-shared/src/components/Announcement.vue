<template>
  <div class="announcement fr-pt-2w fr-pb-2w" v-if="isVisible()">
    <div class="fr-container message">
      {{ MESSAGE }}
      <button class="fr-btn--close close" @click="closeAnnouncement()"></button>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";

@Component
export default class Announcement extends Vue {
  MESSAGE = `${process.env.VUE_APP_ANNOUNCEMENT_MESSAGE}`;
  MAIN_URL = `//${process.env.VUE_APP_MAIN_URL}`;

  announcementClosedCookieKey = `announcement-closed-${btoa(this.MESSAGE)}`;
  announcementClosed =
    this.$cookies.get(this.announcementClosedCookieKey) === "true";

  isVisible() {
    const isMessageSet = this.MESSAGE.trim().length > 0;
    return isMessageSet && !this.announcementClosed;
  }

  closeAnnouncement() {
    this.createAnnouncementClosedCookie();
    this.announcementClosed = true;
  }

  createAnnouncementClosedCookie() {
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + 1);
    const domain = this.MAIN_URL.endsWith("dossierfacile.fr")
      ? "dossierfacile.fr"
      : "localhost";

    this.$cookies.set(
      this.announcementClosedCookieKey,
      true,
      expirationDate.toUTCString(),
      "",
      domain
    );
  }
}
</script>

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
