<template>
  <div class="fr-container">
    <h2 class="fr-h2 text-center fr-mt-7w fr-mb-5w">
      {{ $t("joincouple.title") }}
    </h2>
    <InitPassword @on-init-password="onInitPassword" />
    <ConfirmModal v-if="isLoggedIn" @valid="logout()" @cancel="redirect()">
      <span>{{ $t("joincouple.already-logged") }}</span>
    </ConfirmModal>
  </div>
</template>

<script lang="ts">
import { User } from "df-shared/src/models/User";
import { Component, Vue } from "vue-property-decorator";
import InitPassword from "df-shared/src/Authentification/InitPassword.vue";
import { mapGetters } from "vuex";
import ConfirmModal from "df-shared/src/components/ConfirmModal.vue";

@Component({
  components: {
    InitPassword,
    ConfirmModal,
  },
  computed: {
    ...mapGetters({
      isLoggedIn: "isLoggedIn",
    }),
  },
})
export default class JoinCouple extends Vue {
  isLoggedIn!: boolean;

  onInitPassword(user: User) {
    user.token = this.$route.params.token;
    this.$store.dispatch("createPasswordCouple", user).then(
      () => {
        Vue.toasted.global.success_toast({
          message: "joincouple.password-update",
        });
        this.$router.push({ name: "TenantName" });
      },
      (error: any) => {
        if (
          error.response.data.message.includes(
            "password recovery token or is expired"
          )
        ) {
          Vue.toasted.global.error_toast({
            message: "joincouple.token-expired",
          });
        } else {
          Vue.toasted.global.error_toast({
            message: "joincouple.error",
          });
        }
      }
    );
  }

  async logout() {
    await this.$store.dispatch("logout", false);
  }

  redirect() {
    this.$router.push({ name: "Account" });
  }
}
</script>
