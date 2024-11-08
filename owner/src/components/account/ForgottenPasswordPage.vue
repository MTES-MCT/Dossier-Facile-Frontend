<script setup lang="ts">
import { User } from 'df-shared-next/src/models/User'
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useToast } from 'vue-toastification'
import ForgottenPassword from 'df-shared-next/src/Authentification/ForgottenPassword.vue'
import Modal from 'df-shared-next/src/components/ModalComponent.vue'
import useOwnerStore from '../../store/owner-store'

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

function closeModal() {
  isValidModalVisible.value = false
  window.location.replace(MAIN_URL)
}
</script>

<template>
  <div class="fr-container">
    <ForgottenPassword @on-forgotten-password="onForgottenPassword" />
    <Modal v-show="isValidModalVisible" @close="closeModal">
      <template #body>
        <div class="fr-container">
          <div class="fr-grid-row justify-content-center">
            <div class="fr-col-12">
              <p>
                {{ t('forgottenpasswordpage.mail-sent') }}
              </p>
              <p>
                {{ t('forgottenpasswordpage.clic-to-confirm') }}
              </p>
            </div>
          </div>
        </div>
      </template>
    </Modal>
  </div>
</template>
