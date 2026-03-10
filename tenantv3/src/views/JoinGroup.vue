<template>
  <div class="fr-container">
    <h2 class="fr-h2 text-center fr-mt-7w fr-mb-5w">
      {{ t('joingroup.title') }}
    </h2>
    <InitPassword :is-disabled="isLoading" @on-init-password="onInitPassword" />
    <ConfirmModal
      v-model:is-opened="isLoggedIn"
      :title="t('joingroup.already-logged')"
      @valid="logout()"
      @cancel="redirect()"
    />
  </div>
</template>

<script setup lang="ts">
import InitPassword from 'df-shared-next/src/Authentification/InitPassword.vue'
import ConfirmModal from 'df-shared-next/src/components/ConfirmModal.vue'
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { isAxiosError } from 'axios'
import { useRoute, useRouter } from 'vue-router'
import { useLoading } from 'vue-loading-overlay'
import { useTenantStore } from '../stores/tenant-store'
import { getNextBtnInFooter, toast } from '@/components/toast/toastUtils'
import { storeToRefs } from 'pinia'

const { t } = useI18n()
const store = useTenantStore()
const { isLoggedIn } = storeToRefs(store)
const $loading = useLoading({})
const isLoading = ref(false)
const route = useRoute()
const router = useRouter()

function onInitPassword(password: string) {
  const loader = $loading.show()
  isLoading.value = true
  const token = route.params.token.toString()
  store.createPasswordGroup({ token, password }).then(
    () => {
      toast.keep.success(t('joingroup.password-created'), getNextBtnInFooter)
      router.push({ name: 'TenantName' })
      loader.hide()
      isLoading.value = false
    },
    (error) => {
      loader.hide()
      isLoading.value = false
      if (isAxiosError(error) && error.code === 'ERR_BAD_REQUEST') {
        toast.error(t('joingroup.bad-request'), document.getElementById('password'))
      } else {
        toast.error(t('errors.submit-failed'), document.getElementById('password'))
      }
    }
  )
}

async function logout() {
  await store.logout()
}

function redirect() {
  router.push({ name: 'Account' })
}
</script>
