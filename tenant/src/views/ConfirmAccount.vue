<template>
  <div class="fr-container">
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
    const token = this.$route.params.token;
    AuthService.confirmAccount(token)
      .then(() => {
        this.$router.push("/profile");
      })
      .catch(err => {
        this.error = err;
      });
  }
}
</script>
