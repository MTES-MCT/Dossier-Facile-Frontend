<script setup lang="ts">
import { computed, onBeforeMount } from 'vue'
import Announcement from 'df-shared-next/src/components/AnnouncementBanner.vue'
import ConsentHandler from 'df-shared-next/src/components/ConsentHandler.vue'
import SkipLinks from 'df-shared-next/src/components/SkipLinks.vue'
import Footer from 'df-shared-next/src/Footer/FooterComponent.vue'
import FollowSocials from 'df-shared-next/src/Footer/FollowSocials.vue'
import useOwnerStore from './store/owner-store'
import DeleteAccount from './components/DeleteAccount.vue'
import cookies from 'js-cookie'
import OwnerHeader from './components/OwnerHeader.vue'

const MESSAGE = `${import.meta.env.VITE_ANNOUNCEMENT_MESSAGE || ''}`

const store = useOwnerStore()

const hasFooter = computed(() => store.hasFooter)

const showDeleteAccountModal = computed(() => store.getShowDeleteAccountModal)

onBeforeMount(() => {
  const lang = cookies.get('lang') === 'en' ? 'en' : 'fr'
  store.setLang(lang)
})
</script>

<template>
  <div class="cdn-background"></div>
  <ConsentHandler />
  <SkipLinks />
  <OwnerHeader />
  <div id="content">
    <DeleteAccount v-show="showDeleteAccountModal"></DeleteAccount>
    <Announcement :message="MESSAGE"></Announcement>
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
@use 'df-shared-next/src/scss/_main.scss';
@import '@gouvfr/dsfr/dist/dsfr/dsfr.min.css';
@import '@gouvfr/dsfr/dist/utility/colors/colors.min.css';

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

.bold-icon path {
  stroke: currentColor;
  stroke-width: 0.6;
}
</style>
