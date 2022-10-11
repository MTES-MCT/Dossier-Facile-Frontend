<template>
  <div class="fr-container">
    <ChangePassword @on-change-password="onChangePassword" />
  </div>
</template>

<script setup lang="ts">
import { User } from 'df-shared-next/src/models/User';
import { useI18n } from 'vue-i18n';
import { useRoute, useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';
import ChangePassword from 'df-shared-next/src/Authentification/ChangePassword.vue';
import useOwnerStore from '../../store/owner-store';

const route = useRoute();
const router = useRouter();
const store = useOwnerStore();
const toast = useToast();
const { t } = useI18n();

function onChangePassword(user: User) {
  const u = { ...user };
  u.token = route.params.token.toString();
  store.changePassword(u).then(
    () => {
      toast.success(t('password-update').toString(), {
        timeout: 7000,
      });
      router.push({ name: 'Dashboard' });
    },
    (error: any) => {
      if (error.response.data.message.includes('password recovery token or is expired')) {
        toast.error(t('token-expired').toString(), {
          timeout: 7000,
        });
      } else {
        toast.error(t('error').toString(), {
          timeout: 7000,
        });
      }
    },
  );
}
</script>

<i18n>
{
  "en": {
    "error": "Error",
    "password-update": "The password has been updated",
    "token-expired": "The token has expired, please run the forgotten password process"
  },
  "fr": {
    "error": "Erreur",
    "password-update": "Le mot de passe a été mis à jour",
    "token-expired": "Le lien a expiré, veuillez lancer la procédure de mot de passe oublié"
  }
}

</i18n>
