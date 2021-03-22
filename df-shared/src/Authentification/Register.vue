<template>
  <div class="rf-grid-row rf-grid-row--center">
    <div class="col-md-8 col-lg-6">
      <h2 class="rf-h2 text-center rf-mt-7w rf-mb-5w">
        {{ $t("title") }}
      </h2>
    <ValidationObserver v-slot="{ validate }">
      <form name="form" @submit.prevent="validate().then(handleRegister)">
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
                  class="form-control validate-required rf-input"
                  id="email"
                  name="email"
                  :placeholder="$t('email-placeholder')"
                  type="email"
                  required
                />
                <span class="rf-error-text" v-if="errors[0]">{{
                  $t(errors[0])
                }}</span>
              </div>
            </validation-provider>
          </div>
          <div class="rf-col-12 rf-mb-3w">
            <validation-provider
              :rules="`required|strength:${score}`"
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
                  :placeholder="$t('password-placeholder')"
                  type="password"
                  v-model="user.password"
                  name="password"
                  class="validate-required form-control rf-input"
                  required
                />
                <password
                  v-model="user.password"
                  :strength-meter-only="true"
                  @score="setScore"
                />
                <span class="rf-error-text" v-if="errors[0]">{{
                  $t(errors[0])
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
                  :placeholder="$t('password-placeholder')"
                  type="password"
                  v-model="user.confirm"
                  name="confirm-password"
                  class="validate-required form-control rf-input"
                  required
                />
                <span class="rf-error-text" v-if="errors[0]">{{
                  $t(errors[0])
                }}</span>
              </div>
            </validation-provider>
          </div>

          <div class="rf-col-12 rf-mb-3w">
            <vue-recaptcha
              ref="captcha"
              :sitekey="SITE_KEY"
              :loadRecaptchaScript="true"
              @verify="onVerify"
            ></vue-recaptcha>
          </div>
          <div class="rf-col-12 rf-mb-3w">
            <validation-provider
              rules="is"
              v-slot="{ errors }"
            >
              <div
                class="rf-input-group"
                :class="errors[0] ? 'rf-input-group--error' : ''"
              >
                <input
                  type="checkbox"
                  id="acceptCgu"
                  value="false"
                  v-model="acceptCgu"
                />
                <label for="acceptCgu" v-html="$t('accept-cgu')"></label>
                <span class="rf-error-text" v-if="errors[0]">{{
                  $t(errors[0])
                }}</span>
              </div>
            </validation-provider>
          </div>

          <div class="rf-col-12 text-center rf-mb-5w">
            <button class="rf-btn" type="submit">
              {{ $t("submit") }}
            </button>
          </div>
        </div>
      </form>
    </ValidationObserver>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import { User } from "df-shared/src/models/User";
import { ValidationProvider, ValidationObserver } from "vee-validate";
import { extend } from "vee-validate";
import { required, email, confirmed, is } from "vee-validate/dist/rules";
import VueRecaptcha from "vue-recaptcha";
import Password from "vue-password-strength-meter";

// No message specified.
extend("email", {
  ...email,
  message: "email-not-valid"
});

// Override the default message.
extend("required", {
  ...required,
  message: "field-required"
});

extend("confirmed", {
  ...confirmed,
  message: "password-not-confirmed"
});

const MIN_SCORE = 2;
extend("strength", {
  message: "pwd-not-complex",
  validate: (_value, args: any) => {
    if (args !== undefined) {
      return args[0] >= MIN_SCORE;
    }
    return true;
  }
});

extend("is", {
  ...is,
  message: "require-accept",
  validate: value => !!value
});

@Component({
  components: {
    ValidationProvider,
    ValidationObserver,
    VueRecaptcha,
    Password
  }
})
export default class Register extends Vue {
  SITE_KEY = process.env.VUE_APP_CAPTCHA_SITE_KEY;

  @Prop({ default: "" }) email!: string;

  user: User = new User();
  score = 0;
  acceptCgu=false;

  mounted() {
    this.user.email = this.email;
  }

  @Watch("email")
  updateEmail() {
    this.user.email = this.email;
  }

  handleRegister() {
    if (this.score < MIN_SCORE || !this.acceptCgu) {
      return;
    }
    this.$emit("on-register", this.user);
    (this.$refs.captcha as VueRecaptcha).reset();
  }

  onVerify(captcha: string) {
    this.user.captcha = captcha;
  }

  setScore(s: number) {
    this.score = s;
  }
}
</script>

<i18n>
{
"en": {
"title": "Create account",
"password": "Password :",
"email-placeholder": "E.g. : example@example.fr",
"password-placeholder": "E.g. : 12345679",
"confirm-password": "Confirm password :",
"email": "Email :",
"submit": "I create my account",
"email-not-valid": "Email not valid",
"field-required": "This field is required",
"password-not-confirmed": "Password not confirmed",
"pwd-not-complex": "Password not secure enough",
"accept-cgu": "En cochant cette case et en cliquant sur \"Je crée mon compte\", j’accepte expressément les <a target=\"_blank\" href='https://dossierfacile.fr/securite-des-donnees'>Conditions générales</a> d’utilisation de DossierFacile et je comprends que mes données personnelles seront utilisées conformément à la <a target=\"_blank\" href='https://dossierfacile.fr/securite-des-donnees'>Politique de confidentialité</a> de DossierFacile",
"require-accept": "Vous devez accepter les Conditions générales d’utilisation et la Politique de confidentialité de DossierFacile pour continuer"
},
"fr": {
"title": "Création de compte DossierFacile",
"password": "Mot de passe :",
"confirm-password": "Confirmation du mot de passe :",
"email-placeholder": "Ex : exemple@exemple.fr",
"password-placeholder": "Ex : 12345679",
"email": "Email :",
"submit": "Je crée mon compte",
"email-not-valid": "Email non valide",
"field-required": "Ce champ est requis",
"password-not-confirmed": "Le mot de passe ne correspond pas",
"pwd-not-complex": "Mot de passe trop simple",
"accept-cgu": "En cochant cette case et en cliquant sur \"Je crée mon compte\", j’accepte expressément les <a target=\"_blank\" href='https://dossierfacile.fr/securite-des-donnees'>Conditions générales</a> d’utilisation de DossierFacile et je comprends que mes données personnelles seront utilisées conformément à la <a target=\"_blank\" href='https://dossierfacile.fr/securite-des-donnees'>Politique de confidentialité</a> de DossierFacile",
"require-accept": "Vous devez accepter les Conditions générales d’utilisation et la Politique de confidentialité de DossierFacile pour continuer"
}
}
</i18n>
