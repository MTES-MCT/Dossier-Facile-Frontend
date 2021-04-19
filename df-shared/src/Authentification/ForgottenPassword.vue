<template>
  <section class="fr-grid-row fr-grid-row--center">
    <div class="fr-col-md-8 fr-col-lg-6">
      <h2 class="fr-h2 text-center fr-mt-7w fr-mb-5w">
        {{ $t("title") }}
      </h2>
      <form name="form" @submit.prevent="handleSubmit">
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
                  :placeholder="$t('placeholder')"
                  type="email"
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
export default class ForgottenPassword extends Vue {
  user: User = new User();

  handleSubmit() {
    this.$emit("on-forgotten-password", this.user);
  }
}
</script>

<i18n>
{
"en": {
"title": "Forgotten password ?",
"email": "Enter the email address used when creating the account (attention to case sensitivity) :",
"submit": "Submit",
"placeholder": "E.g. : example@example.fr",
"email-not-valid": "Email not valid",
"field-required": "This field is required"
},
"fr": {
"title": "Mot de passe perdu ?",
"email": "Entrez l'email utilisé lors de la création du compte (attention aux majuscules) :",
"submit": "Valider",
"placeholder": "Ex : exemple@exemple.fr",
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
