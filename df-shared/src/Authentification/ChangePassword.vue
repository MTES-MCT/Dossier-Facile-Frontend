<template>
  <div class="fr-grid-row fr-grid-row--center">
    <div class="fr-col-md-8 fr-col-lg-6">
      <h2 class="fr-h2 text-center fr-mt-7w fr-mb-5w">
        {{ $t("title") }}
      </h2>
      <form name="form" @submit.prevent="handleRegister">
        <div class="fr-grid-row fr-grid-row--center">
          <div class="fr-col-12 fr-mb-3w">
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
                  :placeholder="$t('password-placeholder')"
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
                  :placeholder="$t('password-placeholder')"
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

          <div class="fr-col-12 text-center fr-mb-5w">
            <button class="fr-btn" type="submit">
              {{ $t("submit") }}
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
import { required, confirmed } from "vee-validate/dist/rules";
import Password from "vue-password-strength-meter";

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

@Component({
  components: {
    ValidationProvider,
    Password
  }
})
export default class ChangePassword extends Vue {
  score = 0;
  user: User = new User();
  handleRegister() {
    this.$emit("on-change-password", this.user);
  }

  setScore(s: number) {
    this.score = s;
  }
}
</script>

<i18n>
{
  "en": {
    "title": "Password update",
    "password": "Password",
    "confirm-password": "Confirm password :",
    "password-placeholder": "Ex : 12345679",
    "confirm": "Confirm password",
    "password-not-confirmed": "Password not confirmed",
    "pwd-not-complex": "Password not secure enough",
    "field-required": "This field is required"
  },
  "fr": {
    "title": "Modification du mot de passe",
    "password": "Nouveau mot de passe",
    "confirm-password": "Confirmation du mot de passe :",
    "password-placeholder": "Ex : 12345679",
    "confirm": "Confirmation du mot de passe",
    "password-not-confirmed": "Le mot de passe ne correspond pas",
    "pwd-not-complex": "Mot de passe trop simple",
    "field-required": "Ce champ est requis"
  }
}
</i18n>
