<template>
  <div>
    <div>
      <h2 class="fr-h2 text-center fr-mt-7w fr-mb-5w blue-text">
        {{ $t("title") }}
      </h2>
    <ValidationObserver v-slot="{ validate }">
      <form name="form" @submit.prevent="validate().then(handleRegister)">
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
                  class="form-control validate-required fr-input"
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
          <div class="fr-col-12 fr-mb-1w">
            <validation-provider
              :rules="`required|strength:${score}`"
              v-slot="{ errors }"
              name="password"
              vid="password"
            >
              <div
                class="fr-input-group"
                :class="errors[0] ? 'fr-input-group--error' : ''"
              >
                <label class="fr-label" for="password">{{
                  $t("password")
                }}</label>
                <input
                  id="password"
                  :placeholder="generatedPwd"
                  type="password"
                  v-model="user.password"
                  name="password"
                  class="validate-required form-control fr-input"
                  required
                />
                <password
                  v-model="user.password"
                  :strength-meter-only="true"
                  @score="setScore"
                />
                <span class="fr-error-text" v-if="errors[0]">{{
                  $t(errors[0])
                }}</span>
              </div>
            </validation-provider>
          </div>
          <div class="fr-col-12 fr-mb-3w">
            <validation-provider
              rules="required|confirmed:password"
              v-slot="{ errors }"
            >
              <div
                class="fr-input-group"
                :class="errors[0] ? 'fr-input-group--error' : ''"
              >
                <label class="fr-label" for="confirm-password">
                  {{ $t("confirm-password") }}</label
                >
                <input
                  id="confirm-password"
                  type="password"
                  v-model="user.confirm"
                  name="confirm-password"
                  class="validate-required form-control fr-input"
                  required
                />
                <span class="fr-error-text" v-if="errors[0]">{{
                  $t(errors[0])
                }}</span>
              </div>
            </validation-provider>
          </div>

          <div class="fr-col-12 fr-mb-3w">
            <vue-recaptcha
              ref="captcha"
              :sitekey="SITE_KEY"
              :loadRecaptchaScript="true"
              @verify="onVerify"
            ></vue-recaptcha>
          </div>
          <div class="fr-col-12 fr-mb-3w">
            <validation-provider
              rules="is"
              v-slot="{ errors }"
            >
              <div
                class="fr-input-group"
                :class="errors[0] ? 'fr-input-group--error' : ''"
              >
                <input
                  type="checkbox"
                  id="acceptCgu"
                  value="false"
                  v-model="acceptCgu"
                />
                <label for="acceptCgu" v-html="$t('accept-cgu')"></label>
                <span class="fr-error-text" v-if="errors[0]">{{
                  $t(errors[0])
                }}</span>
              </div>
            </validation-provider>
          </div>

          <div class="fr-col-12 text-center fr-mb-5w">
            <button class="fr-btn full-width-btn" type="submit">
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
  generatedPwd ="";

  mounted() {
    this.user.email = this.email;
    this.generatePlaceholder();
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

  generatePlaceholder() {
    const chars = ["ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz","0123456789", "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789", "#!?-_."];
    this.generatedPwd = this.$i18n.t('ex') + [4,4,2,2].map(function(len, i) { return Array(len).fill(chars[i]).map(function(x) { return x[Math.floor(Math.random() * x.length)] }).join('') }).concat().join('').split('').sort(function(){return 0.5-Math.random()}).join('');
  }
}
</script>

<style lang="scss">
.full-width-btn {
  width: 100%;
  display: table-cell;
}
</style>

<i18n>
{
"en": {
"title": "Create account",
"password": "Password :",
"email-placeholder": "E.g.: example@example.fr",
"confirm-password": "Confirm password :",
"email": "Email :",
"submit": "I create my account",
"email-not-valid": "Email not valid",
"field-required": "This field is required",
"password-not-confirmed": "Password not confirmed",
"pwd-not-complex": "Password not secure enough",
"accept-cgu": "En cochant cette case et en cliquant sur \"Je crée mon compte\", j’accepte expressément les <a target=\"_blank\" href='https://dossierfacile.fr/securite-des-donnees'>Conditions générales</a> d’utilisation de DossierFacile et je comprends que mes données personnelles seront utilisées conformément à la <a target=\"_blank\" href='https://dossierfacile.fr/securite-des-donnees'>Politique de confidentialité</a> de DossierFacile",
"require-accept": "Vous devez accepter les Conditions générales d’utilisation et la Politique de confidentialité de DossierFacile pour continuer",
"ex": "E.g.: "
},
"fr": {
"title": "Rejoindre DossierFacile",
"password": "Votre mot de passe :",
"confirm-password": "Confirmation de votre mot de passe :",
"email-placeholder": "Ex : exemple@exemple.fr",
"email": "Votre e-mail :",
"submit": "Je crée mon compte",
"email-not-valid": "Email non valide",
"field-required": "Ce champ est requis",
"password-not-confirmed": "Le mot de passe ne correspond pas",
"pwd-not-complex": "Mot de passe trop simple",
"accept-cgu": "En cochant cette case et en cliquant sur \"Je crée mon compte\", j’accepte expressément les <a class=\"cgu\" target=\"_blank\" href='https://www.dossierfacile.fr/securite-des-donnees#securite'>Conditions générales</a> d’utilisation de DossierFacile et je comprends que mes données personnelles seront utilisées conformément à la <a target=\"_blank\" class=\"cgu\" href='https://www.dossierfacile.fr/securite-des-donnees#confidentialite'>Politique de confidentialité</a> de DossierFacile",
"require-accept": "Vous devez accepter les Conditions générales d’utilisation et la Politique de confidentialité de DossierFacile pour continuer",
"ex": "Ex : "
}
}
</i18n>
