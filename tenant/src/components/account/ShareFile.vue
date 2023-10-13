<template>
  <div>
    <h2 class="fr-h4 align-items--center" style="display: flex">
      <i class="ri-share-line fr-mr-1w" aria-hidden="true"></i>
      {{ $t("sharefile.title") }}
    </h2>
    <p>
      {{ $t("sharefile.desc1") }}
    </p>
    <p class="bold">
      {{ $t("sharefile.desc2") }}
    </p>
    <p class="bold">
      {{ $t("sharefile.desc3") }}
    </p>
    <form name="form" @submit.prevent="handleSubmit">
      <div class="form-container">
        <div class="fr-mt-md-4w full-mobile">
          <validation-provider name="shareType" v-slot="{ errors, valid }">
            <select
              v-model="shareType"
              class="fr-select"
              :class="{
                'fr-select--valid': valid,
                'fr-select--error': errors[0],
              }"
            >
              <option value="full">{{ $t("sharefile.full") }}</option>
              <option value="resume">{{ $t("sharefile.resume") }}</option>
            </select>
          </validation-provider>
        </div>
        <div class="full-mobile">
          <validation-provider name="shareMethod" v-slot="{ errors, valid }">
            <select
              v-model="shareMethod"
              class="fr-select"
              :class="{
                'fr-select--valid': valid,
                'fr-select--error': errors[0],
              }"
            >
              <option value="mail">{{ $t("sharefile.by-mail") }}</option>
              <option value="link">{{ $t("sharefile.by-link") }}</option>
            </select>
          </validation-provider>
        </div>
        <div v-if="shareMethod === 'mail'" class="full-mobile">
          <validation-provider rules="required" v-slot="{ errors, valid }">
            <div
              class="fr-input-group"
              :class="errors[0] ? 'fr-input-group--error' : ''"
            >
              <label class="fr-label" for="email">{{
                $t("sharefile.email-label")
              }}</label>
              <input
                v-model="email"
                class="form-control validate-required fr-input"
                :class="{
                  'fr-input--valid': valid,
                  'fr-input--error': errors[0],
                }"
                id="email"
                name="email"
                :placeholder="`${$t('sharefile.email-placeholder')}`"
                type="email"
                autocomplete="email"
                required
              />
            </div>
          </validation-provider>
        </div>
        <div v-if="shareMethod === 'link'" class="full-mobile">
          <input class="fr-input" type="text" read-only :value="getUrl()" />
        </div>
        <div class="full-mobile">
          <ul class="fr-btns-group">
            <li>
              <DfButton type="submit" :primary="true">{{
                shareMethod === "mail"
                  ? $t("sharefile.share-btn-email")
                  : $t("sharefile.share-btn-copy")
              }}</DfButton>
            </li>
          </ul>
        </div>
      </div>
    </form>
  </div>
</template>
<script lang="ts">
import { AnalyticsService } from "@/services/AnalyticsService";
import { OwnerService } from "../../services/OwnerService";
import DfButton from "df-shared/src/Button/Button.vue";
import { Component, Vue } from "vue-property-decorator";
import { ValidationProvider } from "vee-validate";
import { mapState } from "vuex";
import { User } from "df-shared/src/models/User";

@Component({
  components: {
    DfButton,
    ValidationProvider,
  },
  computed: {
    ...mapState({
      user: "user",
    }),
  },
})
export default class ShareFile extends Vue {
  TENANT_URL = `https://${process.env.VUE_APP_TENANT_URL}`;
  shareType = "full";
  shareMethod = "mail";
  user!: User;
  email = "";

  handleSubmit() {
    if (this.shareMethod === "mail") {
      this.sendMail();
    } else {
      this.copyLink();
    }
    return true;
  }

  sendMail() {
    AnalyticsService.shareByMail(this.shareType === "full" ? "full" : "resume");
    OwnerService.sendFileByMail(this.email, this.shareType)
      .then(() => {
        Vue.toasted.global.success_toast({
          message: "sharefile.sent-success",
        });
        this.email = "";
        this.$store.dispatch("loadApartmentSharingLinks");
      })
      .catch((res) => {
        Vue.toasted.global.error_toast({
          message: "error",
        });
        console.dir(res);
      });
  }

  getUrl() {
    if (this.shareType === "full") {
      return `${this.TENANT_URL}/file/${this.user.apartmentSharing?.token}`;
    }
    return `${this.TENANT_URL}/public-file/${this.user.apartmentSharing?.tokenPublic}`;
  }

  copyLink() {
    const url = this.getUrl();

    try {
      navigator.clipboard.writeText(url);
      Vue.toasted.global.success_toast({
        message: "account.copied",
      });
      AnalyticsService.copyLink(this.shareType === "full" ? "full" : "resume");
    } catch (err) {
      alert("Oops, unable to copy");
      return Promise.reject("error");
    }
    return Promise.resolve(true);
  }
}
</script>

<style scoped lang="scss">
.form-container {
  display: inline-flex;
  flex-wrap: wrap;
  gap: 1rem;
  align-items: flex-end;
}

select {
  min-width: 200px;
}

.full-mobile {
  @media (max-width: 768px) {
    width: 100%;
  }
}
</style>
