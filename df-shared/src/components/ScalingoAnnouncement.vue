<template>
  <Announcement v-if="announcementVisibility">
    Notre hébergeur a rencontré dans la nuit du 05/04/2022 un incident technique
    bloquant l’accès à notre site. L'incident étant résolu, nous redémarrons
    progressivement nos applications. Toutes nos excuses pour ce désagrément.
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
export default class ScalingoAnnouncement extends Vue {
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
