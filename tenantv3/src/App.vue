<script setup lang="ts">
import { RouterView, useRouter } from 'vue-router'
import useTenantStore from './stores/tenant-store'
import { computed, onBeforeMount } from 'vue'
import TenantSkipLinks from './components/TenantSkipLinks.vue'
import TenantMenu from './components/TenantMenu.vue'
import MyHeader from './components/HeaderComponent.vue'
import ConsentHandler from 'df-shared-next/src/components/ConsentHandler.vue'
import Footer from 'df-shared-next/src/Footer/FooterComponent.vue'
import DeleteAccount from './components/DeleteAccount.vue'
import Announcement from 'df-shared-next/src/components/AnnouncementBanner.vue'
import FollowSocials from 'df-shared-next/src/Footer/FollowSocials.vue'
import { useCookies } from 'vue3-cookies'

const store = useTenantStore()
const router = useRouter()

const isFunnel = computed(() => store.isFunnel)
const isLoggedIn = computed(() => store.isLoggedIn)

const OWNER_URL = `//${import.meta.env.VITE_OWNER_URL}`
const { cookies } = useCookies()

onBeforeMount(() => {
  const lang = cookies.get('lang') === 'en' ? 'en' : 'fr'
  const store = useTenantStore()
  store.setLang(lang)
})

function onLogout() {
  store.logout(true)
}

function onLoginTenant() {
  router.push('/login')
}

function onCreateOwner() {
  window.location.href = OWNER_URL
}
</script>

<template>
  <ConsentHandler />
  <TenantSkipLinks />
  <MyHeader
    :logged-in="isLoggedIn"
    @on-login-tenant="onLoginTenant"
    @on-create-owner="onCreateOwner"
    @on-logout="onLogout"
    :show-accessibility="isFunnel"
  >
    <TenantMenu />
  </MyHeader>
  <div id="content">
    <DeleteAccount></DeleteAccount>
    <Announcement></Announcement>
    <main role="main">
      <div class="page">
        <RouterView />
      </div>
      <FollowSocials v-if="!isFunnel" />
    </main>
  </div>
  <Footer v-if="!isFunnel" />
</template>

<style lang="scss">
@import 'df-shared-next/src/scss/_main.scss';
@import 'vue3-toastify/dist/index.css';

#content {
  flex: auto;
  display: flex;
  flex-direction: column;
}

.page {
  flex: auto;
  min-height: 300px;
  display: flex;
  align-items: stretch;
}

.bold-icon path {
  stroke: currentColor;
  stroke-width: 0.6;
}
</style>
