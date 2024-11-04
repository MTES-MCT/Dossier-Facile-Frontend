<template>
  <div class="fr-container">
    <ChangePassword @on-change-password="onChangePassword" />
  </div>
</template>

<script setup lang="ts">
import { User } from 'df-shared-next/src/models/User'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import ChangePassword from 'df-shared-next/src/Authentification/ChangePassword.vue'
import useOwnerStore from '../../store/owner-store'
import { isAxiosError } from 'axios'

const route = useRoute()
const router = useRouter()
const store = useOwnerStore()
const toast = useToast()
const { t } = useI18n()

function onChangePassword(user: User) {
  const u = { ...user }
  u.token = route.params.token.toString()
  store.changePassword(u).then(
    () => {
      toast.success(t('changepasswordpage.password-update').toString(), {
        timeout: 7000
      })
      router.push({ name: 'Dashboard' })
    },
    (error: unknown) => {
      if (
        isAxiosError(error) &&
        error.response?.data.message.includes('password recovery token or is expired')
      ) {
        toast.error(t('changepasswordpage.token-expired').toString(), {
          timeout: 7000
        })
      } else {
        toast.error(t('changepasswordpage.error').toString(), {
          timeout: 7000
        })
      }
    }
  )
}
</script>
