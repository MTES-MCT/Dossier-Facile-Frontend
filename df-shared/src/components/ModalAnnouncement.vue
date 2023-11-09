<template>
  <Modal v-if="isVisible()" @close="closeAnnouncement">
    <template v-slot:body>
      <div class="fr-container">
        <div class="fr-grid-row justify-content-center">
          <div class="fr-col-12">
            <slot></slot>
          </div>
        </div>
      </div>
    </template>
  </Modal>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import Modal from "./Modal.vue";
import { CookiesService } from "../services/CookiesService";

@Component({
  components: {
    Modal
  },
})
export default class ModalAnnouncement extends Vue {
  MAIN_URL = `//${process.env.VUE_APP_MAIN_URL}`;

  @Prop() cookiekey!: string;
  @Prop() showmodal!: boolean;

  announcementClosedCookieKey = `announcement-closed-${btoa(this.cookiekey)}`;
  announcementClosed =
    this.$cookies.get(this.announcementClosedCookieKey) === "true";

  isVisible() {
    return this.showmodal && !this.announcementClosed;
  }

  closeAnnouncement() {
    this.createAnnouncementClosedCookie();
    this.announcementClosed = true;
  }

  createAnnouncementClosedCookie() {
    CookiesService.setCookie(
      this.announcementClosedCookieKey,
      "true",
      CookiesService.datePlusDaysFromNow(1)
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
