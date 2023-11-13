<template>
  <div class="fr-container fr-grid-row fr-mt-9w fr-grid-row--center">
    <div v-if="tokenErr" class="fr-col-6">
      <p v-html="$t('confirmaccount.token-err')"></p>
    </div>
    <div v-if="!tokenErr" class="fr-col-6">
      {{ error }}
    </div>
  </div>
</template>

<script lang="ts">
import { AuthService } from "df-shared-next/src/services/AuthService";
import { Vue, Component } from "vue-property-decorator";

@Component
export default class ConfirmAccount extends Vue {
  error?: any = null;
  tokenErr = false;

  mounted() {
    const token = this.$route.params.token;
    AuthService.confirmAccount(token)
      .then(() => {
        this.$router.push({ name: "TenantName" });
      })
      .catch((err) => {
        this.error = err;
        if (err.response.status === 404) {
          this.tokenErr = true;
        }
      });
  }
}
</script>
