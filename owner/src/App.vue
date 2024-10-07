<script setup lang="ts">
import { computed, onMounted, onUnmounted } from 'vue'
import MyHeader from 'df-shared-next/src/Header/Header.vue'
import Announcement from 'df-shared-next/src/components/Announcement.vue'
import SkipLinks from 'df-shared-next/src/components/SkipLinks.vue'
import Footer from 'df-shared-next/src/Footer/Footer.vue'
import FollowSocials from 'df-shared-next/src/Footer/FollowSocials.vue'
import { useRouter } from 'vue-router'
import Menu from './components/Menu.vue'
import useOwnerStore from './store/owner-store.ts'
import DeleteAccount from './components/DeleteAccount.vue'

const TENANT_URL = `//${import.meta.env.VITE_TENANT_URL}`

const store = useOwnerStore()
const router = useRouter()

const isLoggedIn = computed(() => store.isLoggedIn)

const hasFooter = computed(() => store.hasFooter)

const showDeleteAccountModal = computed(() => store.getShowDeleteAccountModal)

onMounted(() => {
  window.Beacon('init', '330e68d2-2a04-4659-8048-c05d242ee8f5')
})

onUnmounted(() => {
  window.Beacon('destroy')
})

function onLogin() {
  router.push({ name: 'Dashboard' })
}

function goToTenant() {
  window.location.href = TENANT_URL
}

function onLogout() {
  store.logout(true)
}
</script>

<template>
  <SkipLinks></SkipLinks>
  <MyHeader
    type="owner"
    :logged-in="isLoggedIn"
    @on-login="onLogin"
    @on-access-tenant="goToTenant"
    @on-logout="onLogout"
    :showAccessibility="false"
  >
    <Menu></Menu>
  </MyHeader>
  <div id="content">
    <DeleteAccount v-show="showDeleteAccountModal"></DeleteAccount>
    <Announcement></Announcement>
    <main role="main">
      <div class="page fr-background-alt--blue-france">
        <router-view />
      </div>
      <FollowSocials v-if="hasFooter" />
    </main>
  </div>
  <div v-if="hasFooter">
    <Footer />
  </div>
</template>

<style lang="scss">
@import '@gouvfr/dsfr/dist/dsfr/dsfr.min.css';
@import '@gouvfr/dsfr/dist/utility/colors/colors.min.css';
@import 'df-shared-next/src/scss/_main.scss';
@import 'df-shared-next/src/scss/_variables.scss';
@import '../../node_modules/remixicon/fonts/remixicon.css';

#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.page {
  flex: auto;
  min-height: 300px;
  display: flex;
  align-items: stretch;
}

#content {
  flex: auto;
  display: flex;
  flex-direction: column;
}
</style>
