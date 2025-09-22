<template>
  <HeaderComponent :logged-in="store.isLoggedIn" @on-logout="store.logout"
    ><template #login>
      <RouterLink to="/home" class="fr-btn fr-btn--sm">
        <RiAccountCircleLine aria-hidden="true" class="fr-mr-1v" />
        {{ t('signin') }}
      </RouterLink>
    </template>
    <template #other>
      <a :href="TENANT_URL" class="fr-btn fr-btn--sm">
        <RiUserStarLine aria-hidden="true" class="fr-mr-1v" />
        {{ t('tenant') }}
      </a>
    </template>
    <OwnerMenu />
  </HeaderComponent>
</template>

<script setup lang="ts">
import { RiAccountCircleLine, RiUserStarLine } from '@remixicon/vue'
import HeaderComponent from 'df-shared-next/src/Header/HeaderComponent.vue'
import { useI18n } from 'vue-i18n'
import OwnerMenu from './OwnerMenu.vue'
import useOwnerStore from '@/store/owner-store'

const TENANT_URL = `//${import.meta.env.VITE_TENANT_URL}`

const { t } = useI18n({ useScope: 'local' })
const store = useOwnerStore()
</script>

<i18n>
{
  "en": {
    "signin": "Sign-in",
    "tenant": "Tenant area",
  },
  "fr": {
    "signin": "Se connecter",
    "tenant": "Espace locataire",
  }
}
</i18n>
