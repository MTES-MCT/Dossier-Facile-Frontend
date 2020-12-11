<template>
  <section class="rf-grid-row rf-grid-row--center">
    <div class="rf-col-md-8 rf-col-lg-6">
      <h2 class="rf-h2 text-center rf-mt-7w rf-mb-5w">
        {{ $t("title") }}
      </h2>
      <form name="form" @submit.prevent="handleLogin">
        <div class="rf-grid-row rf-grid-row--center">
          <div class="rf-col-12 rf-mb-3w">
            <validation-provider rules="required" v-slot="{ errors }">
              <div
                class="rf-input-group"
                :class="errors[0] ? 'rf-input-group--error' : ''"
              >
                <label class="rf-label" for="email">{{ $t("email") }}</label>
                <input
                  v-model="user.email"
                  class="form-control rf-input validate-required"
                  id="email"
                  name="email"
                  :placeholder="$t('email-placeholder')"
                  type="email"
                />
                <span class="rf-error-text" v-if="errors[0]">{{
                  $t(errors[0])
                }}</span>
              </div>
            </validation-provider>
          </div>
          <div class="rf-col-12 rf-mb-3w">
            <validation-provider rules="required" v-slot="{ errors }">
              <div
                class="rf-input-group"
                :class="errors[0] ? 'rf-input-group--error' : ''"
              >
                <label for="password" class="rf-label">{{
                  $t("password")
                }}</label>
                <input
                  id="password"
                  :placeholder="$t('password-placeholder')"
                  type="password"
                  v-model="user.password"
                  name="password"
                  class="validate-required form-control rf-input"
                />
                <span class="rf-error-text" v-if="errors[0]">{{
                  $t(errors[0])
                }}</span>
              </div>
            </validation-provider>
          </div>

          <div class="rf-col-12 text-center rf-mb-5w">
            <button class="rf-btn" type="submit">
              {{ $t("submit")}}
            </button>
          </div>
          <div class="rf-col-12 text-center rf-mb-3w">
            <router-link to="/forgotten-password"
              >{{ $t("forgotten-password") }}</router-link
            >
          </div>
          <div class="rf-col-12 text-center rf-mb-12w">
            <router-link to="/signup">{{ $t("no-account") }}</router-link>
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
  loading = false;

  handleLogin() {
    this.loading = true;
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
"forgotten-password": "Forgotten password",
"no-account": "I don't have an account yet",
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
"forgotten-password": "mot de passe oublié",
"no-account": "je n'ai pas encore de compte",
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
