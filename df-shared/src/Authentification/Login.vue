<template>
  <section>
    <div>
      <h2 class="fr-h2 text-center fr-mt-7w fr-mb-5w">
        {{ $t("title") }}
      </h2>
      <form name="form" @submit.prevent="handleLogin">
        <div class="fr-grid-row fr-grid-row--center">
          <div class="fr-col-12 fr-mb-3w">
            <validation-provider rules="required" v-slot="{ errors }">
              <div
                class="fr-input-group"
                :class="errors[0] ? 'fr-input-group--error' : ''"
              >
                <label class="fr-label" for="email">{{ $t("email") }}</label>
                <input
                  v-model="user.email"
                  class="form-control fr-input validate-required"
                  id="email"
                  name="email"
                  :placeholder="$t('email-placeholder')"
                  type="email"
                  required
                />
                <span class="fr-error-text" v-if="errors[0]">{{
                  $t(errors[0])
                }}</span>
              </div>
            </validation-provider>
          </div>
          <div class="fr-col-12 fr-mb-3w">
            <validation-provider rules="required" v-slot="{ errors }">
              <div
                class="fr-input-group"
                :class="errors[0] ? 'fr-input-group--error' : ''"
              >
                <label for="password" class="fr-label">{{
                  $t("password")
                }}</label>
                <input
                  id="password"
                  :placeholder="$t('password-placeholder')"
                  type="password"
                  v-model="user.password"
                  name="password"
                  class="validate-required form-control fr-input"
                  required
                />
                <span class="fr-error-text" v-if="errors[0]">{{
                  $t(errors[0])
                }}</span>
              </div>
            </validation-provider>
          </div>

          <div class="fr-col-12 text-center fr-mb-5w">
            <button class="fr-btn" type="submit">
              {{ $t("submit") }}
            </button>
          </div>
        </div>
      </form>
    </div>
  </section>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { User } from "df-shared/src/models/User";
import { ValidationProvider } from "vee-validate";
import { extend } from "vee-validate";
import { required, email } from "vee-validate/dist/rules";

extend("email", {
  ...email,
  message: "email-not-valid"
});

extend("required", {
  ...required,
  message: "field-required"
});

@Component({
  components: {
    ValidationProvider
  }
})
export default class Login extends Vue {
  user: User = new User();

  handleLogin() {
    this.$emit("on-login", this.user);
  }
}
</script>

<i18n>
{
"en": {
"title": "Connection to my account DossierFacile",
"email": "Email :",
"password": "Password :",
"email-placeholder": "E.g. : example@example.fr",
"password-placeholder": "E.g. : 12345679",
"submit": "Submit",
"email-not-valid": "Email not valid",
"field-required": "This field is required"
},
"fr": {
"title": "Connexion à mon compte DossierFacile",
"email": "Email :",
"password": "Mot de passe :",
"email-placeholder": "Ex : exemple@exemple.fr",
"password-placeholder": "Ex : 12345679",
"submit": "Valider",
"email-not-valid": "Email non valide",
"field-required": "Ce champ est requis"
}
}
</i18n>

<style lang="scss">
.text-center {
  text-align: center;
}
</style>
