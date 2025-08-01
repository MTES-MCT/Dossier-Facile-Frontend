<script setup lang="ts">
import { RouterView, useRoute, useRouter } from 'vue-router'
import { useTenantStore } from './stores/tenant-store'
import { computed, onBeforeMount } from 'vue'
import TenantSkipLinks from './components/TenantSkipLinks.vue'
import TenantMenu from './components/TenantMenu.vue'
import MyHeader from './components/HeaderComponent.vue'
import ConsentHandler from 'df-shared-next/src/components/ConsentHandler.vue'
import Footer from 'df-shared-next/src/Footer/FooterComponent.vue'
import DeleteAccount from './components/DeleteAccount.vue'
import Announcement from 'df-shared-next/src/components/AnnouncementBanner.vue'
import FollowSocials from 'df-shared-next/src/Footer/FollowSocials.vue'
import cookies from 'js-cookie'
import ToastContainer from '@/components/toast/ToastContainer.vue'

const MESSAGE = `${import.meta.env.VITE_ANNOUNCEMENT_MESSAGE || ''}`
const MESSAGE_FOR_VALIDATED = `${import.meta.env.VITE_MESSAGE_FOR_VALIDATED || ''}`

const store = useTenantStore()
const router = useRouter()
const route = useRoute()

const isFunnel = computed(() => route.meta.hideFooter)
const isLoggedIn = computed(() => store.isLoggedIn)

const OWNER_URL = `//${import.meta.env.VITE_OWNER_URL}`

onBeforeMount(() => {
  const lang = cookies.get('lang') === 'en' ? 'en' : 'fr'
  const store = useTenantStore()
  store.setLang(lang)
})

const announcementMessage = computed(() => MESSAGE.replace('[[tenantId]]', `${store.user.id}`))
const validatedMessage = computed(() =>
  MESSAGE_FOR_VALIDATED.replace('[[tenantId]]', `${store.user.id}`)
)

function onLogout() {
  store.logout()
}

function onLoginTenant() {
  router.push('/login')
}

function onCreateOwner() {
  window.location.href = OWNER_URL
}

function hasToDisplayAnnoncement() {
  return store.user.ownerType === 'THIRD_PARTY'
}
</script>

<template>
  <div class="cdn-background"></div>
  <ConsentHandler />
  <TenantSkipLinks />
  <MyHeader
    :logged-in="isLoggedIn"
    :show-accessibility="isFunnel"
    @on-login-tenant="onLoginTenant"
    @on-create-owner="onCreateOwner"
    @on-logout="onLogout"
  >
    <TenantMenu />
  </MyHeader>
  <Announcement
    :is-displayed="hasToDisplayAnnoncement()"
    :message="announcementMessage"
  ></Announcement>
  <Announcement v-if="store.user.status === 'VALIDATED'" :message="validatedMessage"></Announcement>
  <ToastContainer />
  <div id="content">
    <DeleteAccount></DeleteAccount>
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
@use 'df-shared-next/src/scss/_main.scss';

#content {
  flex: auto;
  display: flex;
  flex-direction: column;
  position: relative;
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
