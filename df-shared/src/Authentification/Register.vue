<template>
  <div class="main-container">
    <section class="text-center">
      <div class="container">
        <div class="row">
          <div class="col-md-8 col-lg-6">
            <h2>{{ $t("title") }}</h2>
            <form name="form" @submit.prevent="handleRegister">
              <div class="col-md-12 text-left">
                <validation-provider rules="required" v-slot="{ errors }">
                  <label for="email"><span>Email :</span></label>
                  <input
                    v-model="user.username"
                    class="form-control validate-required"
                    id="email"
                    name="username"
                    placeholder="Ex : exemple@exemple.fr"
                    type="email"
                  />
                  <span>{{ errors[0] }}</span>
                </validation-provider>
              </div>
              <div class="col-md-12 text-left">
                <validation-provider rules="required" v-slot="{ errors }">
                  <label for="password"
                    ><span class="font">Mot de passe :</span></label
                  >
                  <input
                    id="password"
                    placeholder="Ex : 12345679"
                    type="password"
                    v-model="user.password"
                    name="password"
                    class="validate-required form-control"
                  />
                  <span>{{ errors[0] }}</span>
                </validation-provider>
              </div>

              <div class="col-12 justify-content-center align-content-center">
                <vue-recaptcha
                  sitekey="6LcfXvcUAAAAALLhnF408wgF7MH1OwJ4P0WPYjeu"
                  :loadRecaptchaScript="true"
                  v-on:verify="onVerify"
                ></vue-recaptcha>
              </div>

              <div
                class="col-md-12 mt-4 justify-content-center align-content-center"
              >
                <button
                  class="btn btn--primary w-25 text-uppercase"
                  type="submit"
                >
                  valider
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { User } from "df-shared/src/models/User";
import { ValidationProvider } from "vee-validate";
import { extend } from "vee-validate";
import { required, email } from "vee-validate/dist/rules";
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

@Component({
  components: {
    ValidationProvider,
    VueRecaptcha
  }
})
export default class Register extends Vue {
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
"title": "Création de compte DossierFacile"
},
"fr": {
"title": "Création de compte DossierFacile"
}
}
</i18n>
