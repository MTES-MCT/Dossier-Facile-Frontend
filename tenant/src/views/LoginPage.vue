<template>
  <div class="rf-container">
    <Login @on-login="onLogin" />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Login from "df-shared/src/Authentification/Login.vue";
import { User } from "df-shared/src/models/User";

@Component({
  components: {
    Login
  }
})
export default class LoginPage extends Vue {
  onLogin(user: User) {
    if (user.email && user.password) {
      this.$store.dispatch("login", user).then(
        () => {
          console.log("logged !");
          this.$router.push("/profile");
        },
        error => {
          console.dir(error);
        }
      );
    }
  }
}
</script>
