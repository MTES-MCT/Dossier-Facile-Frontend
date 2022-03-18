<template>
  <Announcement v-if="announcementVisibility">
    <img
      class="img-announcement"
      alt=""
      :src="require('df-shared/src/assets/speaker.svg')"
    />
    Locataires et propriétaires, venez échanger sur vos droits et devoirs lors
    du webinaire organisé avec le
    <img
      class="img-announcement"
      alt="clcv"
      :src="require('df-shared/src/assets/clcv.svg')"
    />
    , le 6 avril prochain.
    <a
      href="https://contact582510.typeform.com/to/c4vxi0sg"
      class="fr-btn fr-ml-1w fr-btn--secondary fr-btn--announcement"
      target="_blank"
      >S'inscrire</a
    >
    <a href class="fr-ml-1w no-shadow" @click.prevent="closeAnnouncement"
      ><span
        class="fr-fi--lg fr-fi-close-line color--white"
        aria-hidden="true"
      ></span>
    </a>
  </Announcement>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import Announcement from "./Announcement.vue";

@Component({
  components: {
    Announcement
  }
})
export default class ClcvAnnouncement extends Vue {
  MAIN_URL = `//${process.env.VUE_APP_MAIN_URL}`;
  announcementVisibility =
    !this.$cookies.isKey("announcement-visibility") ||
    this.$cookies.get("announcement-visibility") !== "false";

  closeAnnouncement() {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    this.$cookies.set(
      "announcement-visibility",
      false,
      d.toUTCString(),
      "",
      this.MAIN_URL.endsWith("dossierfacile.fr")
        ? "dossierfacile.fr"
        : "localhost"
    );
    this.announcementVisibility = false;
  }
}
</script>

<style scoped lang="scss">
.fr-btn--announcement {
  color: #45a07a;
  background-color: #fff;
  box-shadow: none !important;
}
.fr-fi-close-line:before {
  vertical-align: middle;
}
.img-announcement {
  display: inline;
  vertical-align: middle;
}
</style>
