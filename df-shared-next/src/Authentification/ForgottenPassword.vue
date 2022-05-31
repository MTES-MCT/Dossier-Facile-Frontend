<template>
  <section class="fr-grid-row fr-grid-row--center">
    <div class="fr-col-md-8 fr-col-lg-6">
      <h2 class="fr-h2 text-center fr-mt-7w fr-mb-5w">
        {{ t("title") }}
      </h2>
      <Form name="form" @submit="handleSubmit">
        <div class="fr-grid-row fr-grid-row--center">
          <div class="fr-col-12 fr-mb-3w">
            <div class="fr-input-group">
              <label class="fr-label" for="email">{{ t("email") }}</label>
              <Field
                v-model="user.email"
                class="form-control fr-input validate-required"
                id="email"
                name="email"
                :placeholder="t('placeholder')"
                type="email"
                rules="validateEmail"
                required
              />
              <ErrorMessage name="email" class="fr-error-text"></ErrorMessage>
            </div>
          </div>

          <div class="fr-col-12 text-center fr-mb-5w">
            <button class="fr-btn" type="submit">
              {{ t("submit") }}
            </button>
          </div>
        </div>
      </Form>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useI18n } from "vue-i18n";
import { User } from "df-shared-next/src/models/User";
import { Form, Field, ErrorMessage } from "vee-validate";

const emit = defineEmits(["on-forgotten-password"]);

const { t } = useI18n();

const user = new User();

function handleSubmit() {
  emit("on-forgotten-password", user);
}
</script>

<style lang="scss">
.text-center {
  text-align: center;
}
</style>

<i18n>
{
  "en": {
    "title": "Forgotten password ?",
    "email": "Enter the email address used when creating the account (attention to case sensitivity) :",
    "submit": "Submit",
    "placeholder": "E.g. : example{'@'}example.fr",
    "email-not-valid": "Email not valid",
    "field-required": "This field is required"
  },
  "fr": {
    "title": "Mot de passe perdu ?",
    "email": "Entrez l'email utilisé lors de la création du compte (attention aux majuscules) :",
    "submit": "Valider",
    "placeholder": "Ex : exemple{'@'}exemple.fr",
    "email-not-valid": "Email non valide",
    "field-required": "Ce champ est requis"
  }
}
</i18n>
