<template>
  <section class="rf-grid-row rf-grid-row--center">
    <div class="rf-col-md-8 rf-col-lg-6">
      <h2 class="rf-h2 text-center rf-mt-7w rf-mb-5w">
        {{ $t("title") }}
      </h2>
      <form name="form" @submit.prevent="handleSubmit">
        <div class="rf-grid-row rf-grid-row--center">
          <div class="rf-col-12 rf-mb-3w">
            <validation-provider rules="required" v-slot="{ errors }">
              <div
                class="rf-input-group"
                :class="errors[0] ? 'rf-input-group--error' : ''"
              >
                <label class="rf-label" for="email">{{ $t("email") }}</label>
                <input
                  v-model="user.username"
                  class="form-control rf-input validate-required"
                  id="email"
                  name="username"
                  :placeholder="$t('placeholder')"
                  type="email"
                />
                <span class="rf-error-text" v-if="errors[0]">{{
                  errors[0]
                }}</span>
              </div>
            </validation-provider>
          </div>

          <div class="rf-col-12 text-center rf-mb-5w">
            <button class="rf-btn" type="submit">
              {{ $t('submit')}}
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
  message: "Email non valide"
});

extend("required", {
  ...required,
  message: "Ce champ est requis"
});

@Component({
  components: {
    ValidationProvider
  }
})
export default class ForgottenPassword extends Vue {
  user: User = new User();
  loading = false;

  handleSubmit() {
    this.loading = true;
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
"email-notvalid": "Email non valide"
},
"fr": {
"title": "Mot de passe perdu ?",
"email": "Entrez l'email utilisé lors de la création du compte (attention aux majuscules) :",
"submit": "Valider",
"placeholder": "Ex : exemple@exemple.fr",
"email-notvalid": "Email non valide"
}
}
</i18n>

<style lang="scss">
.text-center {
  text-align: center;
}
</style>
