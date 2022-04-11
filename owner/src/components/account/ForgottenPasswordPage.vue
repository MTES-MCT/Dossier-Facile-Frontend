<script setup lang="ts">
import { User } from 'df-shared/src/models/User';
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useToast } from 'vue-toastification';
import { useStore } from 'vuex';
import ForgottenPassword from 'df-shared/src/Authentification/ForgottenPassword.vue';

const MAIN_URL = `//${import.meta.env.VITE_MAIN_URL}`;
const { t } = useI18n();
const store = useStore();
const toast = useToast();

const isValidModalVisible = ref(false);

function onForgottenPassword(user: User) {
  if (user.email) {
    store.dispatch('resetPassword', user).then(
      () => {
        isValidModalVisible.value = true;
      },
      () => {
        toast.error(t('email-not-found').toString(), {
          timeout: 7000,
        });
      },
    );
  }
}

function closeModal() {
  isValidModalVisible.value = false;
  window.location.replace(MAIN_URL);
}
</script>

<template>
  <div class="fr-container">
    <ForgottenPassword @on-forgotten-password="onForgottenPassword" />
    <Modal v-show="isValidModalVisible" @close="closeModal">
      <template v-slot:body>
        <div class="fr-container">
          <div class="fr-grid-row justify-content-center">
            <div class="fr-col-12">
              <p>
                {{ t("mail-sent") }}
              </p>
              <p>
                {{ t("clic-to-confirm") }}
              </p>
            </div>
          </div>
        </div>
      </template>
    </Modal>
  </div>
</template>

<i18n>
{
  "en": {
    "email-not-found": "Email not found",
    "mail-sent": "An email has been sent to the requested address.",
    "clic-to-confirm": "Please click on the given link to confirm your email and continue your password modification."
  },
  "fr": {
    "email-not-found": "Email non trouvé",
    "mail-sent": "Un mail vous a été envoyé à l'adresse indiquée.",
    "clic-to-confirm": "Veuillez cliquer sur le lien envoyé afin de confirmer votre adresse mail et poursuivre le changement de mot de passe."
  }
}

</i18n>
