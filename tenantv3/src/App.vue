<script setup lang="ts">
import { RouterView, useRoute } from 'vue-router'
import { useTenantStore } from './stores/tenant-store'
import { computed, onBeforeMount } from 'vue'
import TenantSkipLinks from './components/TenantSkipLinks.vue'
import ConsentHandler from 'df-shared-next/src/components/ConsentHandler.vue'
import Footer from 'df-shared-next/src/Footer/FooterComponent.vue'
import DeleteAccount from './components/DeleteAccount.vue'
import Announcement from 'df-shared-next/src/components/AnnouncementBanner.vue'
import FollowSocials from 'df-shared-next/src/Footer/FollowSocials.vue'
import cookies from 'js-cookie'
import ToastContainer from '@/components/toast/ToastContainer.vue'
import TenantHeader from './components/TenantHeader.vue'

const MESSAGE = `DOCUMENT IA`

const store = useTenantStore()
const route = useRoute()

const isFunnel = computed(() => route.meta.hideFooter)

onBeforeMount(() => {
  const lang = cookies.get('lang') === 'en' ? 'en' : 'fr'
  const store = useTenantStore()
  store.setLang(lang)
})

const announcementMessage = computed(() => MESSAGE.replace('[[tenantId]]', `${store.user.id}`))
</script>

<template>
  <div class="cdn-background"></div>
  <ConsentHandler />
  <TenantSkipLinks />
  <TenantHeader />
  <Announcement :message="announcementMessage"></Announcement>
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
