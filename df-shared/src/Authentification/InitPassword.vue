<template>
  <div class="fr-grid-row fr-grid-row--center">
    <div class="fr-col-md-8 fr-col-lg-6">
      <ValidationObserver v-slot="{ validate }">
        <form name="form" @submit.prevent="validate().then(handleRegister)">
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
                    :placeholder="$t('example-prefix') + passwordExample"
                    type="password"
                    v-model="user.password"
                    name="password"
                    class="validate-required form-control fr-input"
                    autocomplete="username"
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
                    autocomplete="username"
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
      </ValidationObserver>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { User } from "df-shared/src/models/User";
import { ValidationObserver, ValidationProvider } from "vee-validate";
import Password from "vue-password-strength-meter";
import { AuthService } from "../services/AuthService";

@Component({
  components: {
    ValidationObserver,
    ValidationProvider,
    Password
  }
})
export default class InitPassword extends Vue {
  score = 0;
  user: User = new User();

  passwordExample = AuthService.generatePasswordPlaceholder();

  handleRegister() {
    this.$emit("on-init-password", this.user);
  }

  setScore(s: number) {
    this.score = s;
  }
}
</script>

<i18n>
{
  "en": {
    "password": "Password",
    "confirm-password": "Confirm password :",
    "confirm": "Confirm password",
    "password-not-confirmed": "Password not confirmed",
    "pwd-not-complex": "Password not secure enough",
    "field-required": "This field is required",
    "submit": "Submit"
  },
  "fr": {
    "password": "Mot de passe",
    "confirm-password": "Confirmation du mot de passe :",
    "confirm": "Confirmation du mot de passe",
    "password-not-confirmed": "Le mot de passe ne correspond pas",
    "pwd-not-complex": "Mot de passe trop simple",
    "field-required": "Ce champ est requis",
    "submit": "Valider"
  }
}
</i18n>