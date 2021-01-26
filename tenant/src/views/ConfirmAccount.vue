<template>
  <div class="rf-container">
    {{ error }}
  </div>
</template>

<script lang="ts">
import { AuthService } from "df-shared/src/services/AuthService";
import { Vue, Component } from "vue-property-decorator";

@Component
export default class ConfirmAccount extends Vue {
  error?: any = null;

  mounted() {
    console.log("truc");
    const token = this.$route.params.token;
    console.dir(token);
    AuthService.confirmAccount(token)
      .then(() => {
        this.$router.push("/login");
      })
      .catch(err => {
        this.error = err;
      });
  }
}
</script>
