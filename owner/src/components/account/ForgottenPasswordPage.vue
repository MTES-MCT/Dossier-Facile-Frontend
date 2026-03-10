<script setup lang="ts">
import { User } from 'df-shared-next/src/models/User'
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useToast } from 'vue-toastification'
import ForgottenPassword from 'df-shared-next/src/Authentification/ForgottenPassword.vue'
import useOwnerStore from '../../store/owner-store'
import DsfrModalPatch from 'df-shared-next/src/components/patches/DsfrModalPatch.vue'

const MAIN_URL = `//${import.meta.env.VITE_MAIN_URL}`
const { t } = useI18n()
const store = useOwnerStore()
const toast = useToast()

const isValidModalVisible = ref(false)

function onForgottenPassword(user: User) {
  if (user.email) {
    store.resetPassword(user).then(
      () => {
        isValidModalVisible.value = true
      },
      () => {
        toast.error(t('forgottenpasswordpage.email-not-found').toString(), {
          timeout: 7000
        })
      }
    )
  }
}
</script>

<template>
  <div class="fr-container">
    <ForgottenPassword @on-forgotten-password="onForgottenPassword" />
    <DsfrModalPatch
      v-model:is-opened="isValidModalVisible"
      :title="t('forgottenpasswordpage.mail-sent')"
      size="lg"
    >
      <p>
        {{ t('forgottenpasswordpage.clic-to-confirm') }}
      </p>
    </DsfrModalPatch>
  </div>
</template>
