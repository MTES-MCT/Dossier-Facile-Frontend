<template>
  <div class="fr-container">
    <h2 class="fr-h2 text-center fr-mt-7w fr-mb-5w">
      {{ t('joingroup.title') }}
    </h2>
    <InitPassword :is-disabled="isLoading" @on-init-password="onInitPassword" />
    <ConfirmModal v-if="isLoggedIn" @valid="logout()" @cancel="redirect()">
      <span>{{ t('joingroup.already-logged') }}</span>
    </ConfirmModal>
  </div>
</template>

<script setup lang="ts">
import InitPassword from 'df-shared-next/src/Authentification/InitPassword.vue'
import ConfirmModal from 'df-shared-next/src/components/ConfirmModal.vue'
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useLoading } from 'vue-loading-overlay'
import { useRoute, useRouter } from 'vue-router'
import { useTenantStore } from '../stores/tenant-store'
import { getNextBtnInFooter, toast } from '@/components/toast/toastUtils'

const { t } = useI18n()
const store = useTenantStore()
const isLoggedIn = computed(() => store.isLoggedIn)
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
      console.log('Erreur ' + error.message)
      if (error.code == 'ERR_BAD_REQUEST') {
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
