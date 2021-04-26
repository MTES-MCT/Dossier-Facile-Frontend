<template>
  <div>
    <h1>{{ $t("title") }}</h1>
    <div>{{ $t("subtitle") }}</div>
    <div v-if="!isLogged">
      <login-page></login-page>
    </div>
    <div v-if="isLogged">
      <validation-provider rules="is" v-slot="{ errors }" class="fr-col-10">
        <div
          class="fr-input-group"
          :class="errors[0] ? 'fr-input-group--error' : ''"
        >
          <input
            type="checkbox"
            id="acceptVerification"
            value="false"
            v-model="acceptVerification"
          />
          <label for="acceptVerification">{{
            $t("accept-verification")
          }}</label>
          <span class="fr-error-text" v-if="errors[0]">{{
            $t(errors[0])
          }}</span>
        </div>
      </validation-provider>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { is } from "vee-validate/dist/rules";
import { extend } from "vee-validate";

extend("is", {
  ...is,
  message: "field-required",
  validate: value => !!value
});

@Component
export default class OwnerShare extends Vue {
  token = "";
  mounted() {
    this.token = this.$route.params.token;
  }
}
</script>

<i18n>
{
  "en": {
    "title": "Candidatez pour le logement",
    "subtitle": "DossierFacile est une startup d'État qui vous permet de créer votre dossier de location intelligent et de le partager avec des propriétaires"
  },
  "fr": {
    "title": "Candidatez pour le logement",
    "subtitle": "DossierFacile est une startup d'État qui vous permet de créer votre dossier de location intelligent et de le partager avec des propriétaires"
  }
}
</i18n>
