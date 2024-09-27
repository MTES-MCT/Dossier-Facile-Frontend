<script setup lang="ts">
import { onMounted, onBeforeUnmount } from 'vue'
import Footer from 'df-shared-next/src/Footer/Footer.vue'
import FollowSocials from 'df-shared-next/src/Footer/FollowSocials.vue'
import Announcement from 'df-shared-next/src/components/Announcement.vue'
import MyHeader from 'df-shared-next/src/Header/Header.vue'
import WwwMenu from './components/WwwMenu.vue'
import SkipLinks from 'df-shared-next/src/components/SkipLinks.vue'

const TENANT_URL = `//${import.meta.env.VITE_TENANT_URL}`
const OWNER_URL = `${import.meta.env.VITE_OWNER_URL}`

onMounted(() => {
  setTimeout(function () {
    let beaconScript = document.createElement('script')
    beaconScript.setAttribute('src', '/js/helpscout.js')
    // beaconScript.setAttribute('id', 'beacon')
    document.head.appendChild(beaconScript)
    beaconScript.addEventListener('load', () => {
      window.Beacon('init', 'e9f4da7d-11be-4b40-9514-ac7ce3e68f67')
    })
  }, 10000)
})

onBeforeUnmount(() => {
  window.Beacon('destroy')
})

function onCreateOwner() {
  window.location.href = OWNER_URL
}

function onLoginTenant() {
  window.location.replace(`${TENANT_URL}/login`)
}
</script>

<template>
  <SkipLinks></SkipLinks>
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
@import '../../node_modules/@gouvfr/dsfr/dist/dsfr/dsfr.min.css';
@import '../../node_modules/@gouvfr/dsfr/dist/utility/colors/colors.min.css';
@import 'vue3-toastify/dist/index.css';
@import '../../node_modules/remixicon/fonts/remixicon.css';

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
