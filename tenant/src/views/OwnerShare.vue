<template>
  <div class="fr-container">
    <div class="fr-grid-row fr-grid-row--center" v-if="owner.owner">
      <div class="fr-col-md-8 fr-col-lg-6">
        <h1 class="fr-h1 fr-mt-3w">
          {{ $t("ownershare.title", [getOwnerAddress()]) }}
        </h1>
        <p>{{ $t("ownershare.subtitle") }}</p>
        <ValidationObserver v-slot="{ validate }" v-if="isCreate()">
          <form name="form" @submit.prevent="validate().then(connectOwner)">
            <validation-provider
              rules="is"
              v-slot="{ errors }"
              class="fr-col-10"
            >
              <div
                class="fr-checkbox-group bg-purple"
                :class="errors[0] ? 'fr-input-group--error' : ''"
              >
                <input
                  type="checkbox"
                  id="acceptOwner"
                  value="false"
                  v-model="acceptOwner"
                />
                <label for="acceptOwner">{{
                  $t("ownershare.accept-owner", [
                    `${owner.owner.firstName} ${owner.owner.lastName}`,
                    getOwnerAddress(),
                  ])
                }}</label>
                <span class="fr-error-text" v-if="errors[0]">{{
                  $t(errors[0])
                }}</span>
              </div>
            </validation-provider>
            <div v-if="isLoggedIn">
              <DfButton type="submit" class="fr-mt-3w" :primary="true">{{
                $t("ownershare.connect-owner")
              }}</DfButton>
            </div>
          </form>
        </ValidationObserver>
        <div v-if="!isCreate()">
          <div class="fr-callout">
            <p class="fr-callout__text">
              {{ $t("ownershare.join-account") }}
            </p>
          </div>
        </div>
        <div v-show="!isLoggedIn">
          <v-gouv-fr-button
            class="fr-mt-2w"
            :label="$t('ownershare.login')"
            :small="false"
            :secondary="false"
            @click="onLogin"
          ></v-gouv-fr-button>
          <div class="fr-mt-3w fr-mb-5w">
            <div v-html="$t('ownershare.no-account-1')"></div>
            <div v-html="$t('ownershare.no-account-2')"></div>
            <div v-html="$t('ownershare.no-account-3')"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { is } from "vee-validate/dist/rules";
import { extend } from "vee-validate";
import { mapGetters, mapState } from "vuex";
import { User } from "df-shared/src/models/User";
import { Owner } from "df-shared/src/models/Owner";
import { ValidationProvider, ValidationObserver } from "vee-validate";
import VGouvFrModal from "df-shared/src/GouvFr/v-gouv-fr-modal/VGouvFrModal.vue";
import DfButton from "df-shared/src/Button/Button.vue";
import { OwnerService } from "../services/OwnerService";
import VGouvFrButton from "df-shared/src/Button/v-gouv-fr-button/VGouvFrButton.vue";

extend("is", {
  ...is,
  message: "field-required",
  validate: (value) => !!value,
});

@Component({
  components: {
    ValidationProvider,
    ValidationObserver,
    VGouvFrModal,
    DfButton,
    VGouvFrButton,
  },
  computed: {
    ...mapState({
      user: "user",
    }),
    ...mapGetters({
      isLoggedIn: "isLoggedIn",
    }),
  },
})
export default class OwnerShare extends Vue {
  isLoggedIn!: boolean;
  acceptOwner = false;
  token = "";
  owner: Owner = new Owner();
  user!: User;

  mounted() {
    this.token = this.$route.params.token;
    OwnerService.getOwnerData(this.token)
      .then((response: any) => {
        this.owner = response.data;
      })
      .catch((error: any) => {
        console.dir(error);
      });
  }

  onLogin() {
    (Vue as any).$keycloak.login({
      redirectUri: this.$route.query.page,
    });
  }

  enableScroll() {
    (window as any)["dsfr"].core.removeClass(
      document.documentElement,
      "fr-no-scroll"
    );
  }

  connectOwner() {
    if (!this.acceptOwner) {
      return;
    }
    OwnerService.registerToOwner(this.token).then(
      () => {
        Vue.toasted.global.success_toast({
          message: "ownershare.connection-success",
        });
        this.$router.push("/account");
      },
      () => {
        Vue.toasted.global.error_toast({
          message: "ownershare.login-error",
        });
      }
    );
  }

  isCreate() {
    return !this.user || this.user.tenantType === "CREATE";
  }

  getOwnerAddress() {
    return this.owner.address || this.owner.name;
  }
}
</script>
