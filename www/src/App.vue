<script setup lang="ts">
import Footer from 'df-shared-next/src/Footer/FooterComponent.vue'
import FollowSocials from 'df-shared-next/src/Footer/FollowSocials.vue'
import Announcement from 'df-shared-next/src/components/AnnouncementBanner.vue'
import MyHeader from 'df-shared-next/src/Header/HeaderComponent.vue'
import WwwMenu from './components/WwwMenu.vue'
import ConsentHandler from 'df-shared-next/src/components/ConsentHandler.vue'
import SkipLinks from 'df-shared-next/src/components/SkipLinks.vue'
import { onBeforeMount } from 'vue'
import Cookies from 'js-cookie'
import i18n from './i18n'

const MESSAGE = `${import.meta.env.VITE_ANNOUNCEMENT_MESSAGE || ''}`
const TENANT_URL = `//${import.meta.env.VITE_TENANT_URL}`
const OWNER_URL = `${import.meta.env.VITE_OWNER_URL}`

function onCreateOwner() {
  window.location.href = OWNER_URL
}

function onLoginTenant() {
  window.location.replace(`${TENANT_URL}/login`)
}

onBeforeMount(() => {
  const lang = Cookies.get('lang') === 'en' ? 'en' : 'fr'
  i18n.global.locale.value = lang
  i18n.global.fallbackLocale.value = 'fr'
})
</script>

<template>
  <div class="cdn-background"></div>
  <ConsentHandler />
  <SkipLinks />
  <MyHeader @on-login="onLoginTenant" @on-access-owner="onCreateOwner">
    <WwwMenu />
  </MyHeader>
  <div id="content">
    <Announcement :message="MESSAGE"></Announcement>
    <main class="page" role="main">
      <RouterView />
      <FollowSocials />
    </main>
  </div>
  <Footer />
</template>

<style lang="scss">
@use 'df-shared-next/src/scss/_main.scss';
@import '@gouvfr/dsfr/dist/dsfr/dsfr.min.css';
@import '@gouvfr/dsfr/dist/utility/colors/colors.min.css';
@import 'vue3-toastify/dist/index.css';

#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.page {
  min-height: 300px;
}

#content {
  flex: auto;
  display: flex;
  flex-direction: column;
}
</style>
