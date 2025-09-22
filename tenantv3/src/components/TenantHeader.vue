<template>
  <HeaderComponent type="other" :logged-in="store.isLoggedIn" @on-logout="store.logout">
    <template #login>
      <RouterLink to="/login" class="fr-btn fr-btn--sm">
        <RiAccountCircleLine aria-hidden="true" class="fr-mr-1v" />
        {{ t('signin') }}
      </RouterLink>
    </template>
    <template #other>
      <a class="fr-btn fr-btn--sm fr-btn--secondary" :href="OWNER_URL">
        <RiCommunityLine aria-hidden="true" class="fr-mr-1v" />
        {{ t('owner-header') }}
      </a>
    </template>
    <TenantMenu />
  </HeaderComponent>
</template>

<script setup lang="ts">
import HeaderComponent from 'df-shared-next/src/Header/HeaderComponent.vue'
import TenantMenu from './TenantMenu.vue'
import { RiAccountCircleLine, RiCommunityLine } from '@remixicon/vue'
import { useI18n } from 'vue-i18n'
import { useTenantStore } from '@/stores/tenant-store'

const OWNER_URL = `//${import.meta.env.VITE_OWNER_URL}`

const store = useTenantStore()
const { t } = useI18n()
</script>
