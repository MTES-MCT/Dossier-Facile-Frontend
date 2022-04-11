<template>
  <div class="fr-grid-row fr-grid-row--center">
    <div class="fr-col-md-8 fr-col-lg-6">
      <h2 class="fr-h2 text-center fr-mt-7w fr-mb-5w">
        {{ t("title") }}
      </h2>
      <Form @submit="handleRegister">
        <div class="fr-grid-row fr-grid-row--center">
          <div class="fr-col-12 fr-mb-3w">
            <div class="fr-input-group">
              <label class="fr-label" for="password">{{ t("password") }}</label>
              <Field
                id="password"
                :placeholder="t('password-placeholder')"
                type="password"
                v-model="user.password"
                name="password"
                class="validate-required form-control fr-input"
                required
              />
              <password v-model="user.password" />
              <ErrorMessage name="password"></ErrorMessage>
            </div>
          </div>
          <div class="fr-col-12 fr-mb-3w">
            <div class="fr-input-group">
              <label class="fr-label" for="confirm-password">
                {{ t("confirm-password") }}</label
              >
              <Field
                id="confirm-password"
                :placeholder="t('password-placeholder')"
                type="password"
                v-model="user.confirm"
                name="confirm-password"
                class="validate-required form-control fr-input"
                required
              />
              <ErrorMessage name="password"></ErrorMessage>
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
  </div>
</template>

<script setup lang="ts">
import { useI18n } from "vue-i18n";
import { User } from "../models/User";
import { Form, Field, ErrorMessage } from "vee-validate";

const emit = defineEmits(["on-change-password"]);
const { t } = useI18n();

const user = new User();

function handleRegister() {
  emit("on-change-password", user);
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
    "field-required": "This field is required",
    "submit": "Submit"
  },
  "fr": {
    "title": "Modification du mot de passe",
    "password": "Nouveau mot de passe",
    "confirm-password": "Confirmation du mot de passe :",
    "password-placeholder": "Ex : 12345679",
    "confirm": "Confirmation du mot de passe",
    "password-not-confirmed": "Le mot de passe ne correspond pas",
    "pwd-not-complex": "Mot de passe trop simple",
    "field-required": "Ce champ est requis",
    "submit": "Valider"
  }
}
</i18n>
