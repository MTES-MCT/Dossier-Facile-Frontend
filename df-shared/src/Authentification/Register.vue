<template>
  <div class="rf-grid-row rf-grid-row--center">
    <div class="col-md-8 col-lg-6">
      <h2 class="rf-h2 text-center rf-mt-7w rf-mb-5w">
        {{ $t("title") }}
      </h2>
      <form name="form" @submit.prevent="handleRegister">
        <div class="rf-grid-row rf-grid-row--center">
          <div class="rf-col-12 rf-mb-3w">
            <validation-provider rules="required" v-slot="{ errors }">
              <div
                class="rf-input-group"
                :class="errors[0] ? 'rf-input-group--error' : ''"
              >
                <label class="rf-label" for="username">{{ $t("email") }}</label>
                <input
                  v-model="user.username"
                  class="form-control validate-required rf-input"
                  id="username"
                  name="username"
                  placeholder="Ex : exemple@exemple.fr"
                  type="email"
                />
                <span class="rf-error-text" v-if="errors[0]">{{
                  errors[0]
                }}</span>
              </div>
            </validation-provider>
          </div>
          <div class="rf-col-12 rf-mb-3w">
            <validation-provider
              rules="required"
              v-slot="{ errors }"
              name="password"
              vid="password"
            >
              <div
                class="rf-input-group"
                :class="errors[0] ? 'rf-input-group--error' : ''"
              >
                <label class="rf-label" for="password">{{
                  $t("password")
                }}</label>
                <input
                  id="password"
                  placeholder="Ex : 12345679"
                  type="password"
                  v-model="user.password"
                  name="password"
                  class="validate-required form-control rf-input"
                />
                <span class="rf-error-text" v-if="errors[0]">{{
                  errors[0]
                }}</span>
              </div>
            </validation-provider>
          </div>
          <div class="rf-col-12 rf-mb-3w">
            <validation-provider
              rules="required|confirmed:password"
              v-slot="{ errors }"
            >
              <div
                class="rf-input-group"
                :class="errors[0] ? 'rf-input-group--error' : ''"
              >
                <label class="rf-label" for="confirm-password">
                  {{ $t("confirm-password") }}</label
                >
                <input
                  id="confirm-password"
                  placeholder="Ex : 12345679"
                  type="password"
                  v-model="user.confirm"
                  name="confirm-password"
                  class="validate-required form-control rf-input"
                />
                <span class="rf-error-text" v-if="errors[0]">{{
                  errors[0]
                }}</span>
              </div>
            </validation-provider>
          </div>

          <div class="rf-col-12 rf-mb-3w">
            <vue-recaptcha
              :sitekey="SITE_KEY"
              :loadRecaptchaScript="true"
              @verify="onVerify"
            ></vue-recaptcha>
          </div>

          <div class="rf-col-12 text-center rf-mb-5w">
            <button class="rf-btn" type="submit">
              valider
            </button>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { User } from "df-shared/src/models/User";
import { ValidationProvider } from "vee-validate";
import { extend } from "vee-validate";
import { required, email, confirmed } from "vee-validate/dist/rules";
import VueRecaptcha from "vue-recaptcha";

// No message specified.
extend("email", {
  ...email,
  message: "Email non valide"
});

// Override the default message.
extend("required", {
  ...required,
  message: "Ce champ est requis"
});
extend("confirmed", {
  ...confirmed,
  message: "Le mot de passe ne correspond pas"
});

@Component({
  components: {
    ValidationProvider,
    VueRecaptcha
  }
})
export default class Register extends Vue {
  SITE_KEY = process.env.VUE_APP_CAPTCHA_SITE_KEY;

  user: User = new User();
  loading = false;

  handleRegister() {
    this.loading = true;
    this.$emit("on-register", this.user);
  }

  onVerify(captcha: string) {
    this.user.captcha = captcha;
  }
}
</script>

<i18n>
{
"en": {
"title": "Création de compte DossierFacile",
"password": "Mot de passe :",
"confirm-password": "Confirmation du mot de passe :",
"email": "Email :"
},
"fr": {
"title": "Création de compte DossierFacile",
"password": "Mot de passe :",
"confirm-password": "Confirmation du mot de passe :",
"email": "Email :"
}
}
</i18n>
