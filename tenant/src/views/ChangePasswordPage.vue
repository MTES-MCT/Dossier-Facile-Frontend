<template>
  <div class="fr-container">
    <ChangePassword @on-change-password="onChangePassword" />
  </div>
</template>

<script lang="ts">
import { User } from "df-shared/src/models/User";
import { Component, Vue } from "vue-property-decorator";
import ChangePassword from "df-shared/src/Authentification/ChangePassword.vue";

@Component({
  components: {
    ChangePassword,
  },
})
export default class ChangePasswordPage extends Vue {
  onChangePassword(user: User) {
    user.token =
      this.$route.params.token != "null" ? this.$route.params.token : "";
    this.$store.dispatch("changePassword", user).then(
      () => {
        Vue.toasted.global.success_toast({
          message: "changepasswordpage.password-update",
        });
        this.$router.push({ name: "Account" });
      },
      (error: any) => {
        if (
          error.response.data.message.includes(
            "password recovery token or is expired"
          )
        ) {
          Vue.toasted.global.error_toast({
            message: "changepasswordpage.token-expired",
          });
        } else {
          Vue.toasted.global.error_toast({
            message: "changepasswordpage.error",
          });
        }
      }
    );
  }
}
</script>
