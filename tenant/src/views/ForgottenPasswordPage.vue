<template>
  <div class="rf-container">
    <ForgottenPassword @on-forgotten-password="onForgottenPassword" />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { User } from "df-shared/src/models/User";
import ForgottenPassword from "df-shared/src/Authentification/ForgottenPassword.vue";

@Component({
  components: {
    ForgottenPassword
  }
})
export default class ForgottenPasswordPage extends Vue {
  onForgottenPassword(user: User) {
    if (user.username) {
      this.$store.dispatch("resetPassword", user).then(
        () => {
          this.$router.push("/");
        },
        error => {
          console.dir(error);
        }
      );
    }
  }
}
</script>
