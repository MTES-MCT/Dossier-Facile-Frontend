<script setup lang="ts">
import Footer from 'df-shared-next/src/Footer/FooterComponent.vue'
import FollowSocials from 'df-shared-next/src/Footer/FollowSocials.vue'
import Announcement from 'df-shared-next/src/components/AnnouncementBanner.vue'
import MyHeader from 'df-shared-next/src/Header/HeaderComponent.vue'
import WwwMenu from './components/WwwMenu.vue'
import ConsentHandler from 'df-shared-next/src/components/ConsentHandler.vue'
import SkipLinks from 'df-shared-next/src/components/SkipLinks.vue'

const TENANT_URL = `//${import.meta.env.VITE_TENANT_URL}`
const OWNER_URL = `${import.meta.env.VITE_OWNER_URL}`

function onCreateOwner() {
  window.location.href = OWNER_URL
}

function onLoginTenant() {
  window.location.replace(`${TENANT_URL}/login`)
}
</script>

<template>
  <ConsentHandler />
  <SkipLinks />
  <MyHeader @on-login="onLoginTenant" @on-access-owner="onCreateOwner">
    <WwwMenu />
  </MyHeader>
  <div id="content">
    <Announcement></Announcement>
    <main class="page" role="main">
      <RouterView />
      <FollowSocials />
    </main>
  </div>
  <Footer />
</template>

<style lang="scss">
@import 'df-shared-next/src/scss/_main.scss';
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
