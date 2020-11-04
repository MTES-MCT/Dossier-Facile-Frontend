<template>
  <div class="signup">
    <Register v-on:on-register="onRegister" />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { User } from "df-shared/src/models/User";
import Register from "df-shared/src/Authentification/Register.vue";

@Component({
  components: {
    Register
  }
})
export default class SignupPage extends Vue {
  onRegister(user: User) {
    if (user.username && user.password) {
      this.$store.dispatch("register", user).then(
        () => {
          console.log("register !");
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
