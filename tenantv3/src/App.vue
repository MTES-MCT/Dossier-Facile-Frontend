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
import { changeLang, locale } from './i18n'
import ToastContainer from '@/components/toast/ToastContainer.vue'
import CommonHeader from 'df-shared-next/src/Header/CommonHeader.vue'

const MESSAGE = `${import.meta.env.VITE_ANNOUNCEMENT_MESSAGE || ''}`

const store = useTenantStore()
const route = useRoute()

const isFunnel = computed(() => route.meta.hideFooter)
const isLoggedIn = computed(() => store.isLoggedIn ?? false)
const user = computed(() => store.user)

// check for saved locale choice
const currentLocale = computed(() => (localStorage.getItem('lang') === 'en' ? 'en' : 'fr'))
// apply the choice
onBeforeMount(() => {
  changeLang(currentLocale.value)
})

const announcementMessage = computed(() => MESSAGE.replace('[[tenantId]]', `${store.user.id}`))

const showMessaging = computed(() => {
  return (
    (isLoggedIn.value === true && user.value.status !== 'INCOMPLETE') ||
    (store.messageList[user.value.id] !== undefined && store.messageList[user.value.id].length > 0)
  )
})
</script>

<template>
  <div class="cdn-background"></div>
  <ConsentHandler />
  <TenantSkipLinks />
  <CommonHeader
    v-model:current-lang="locale"
    :is-logged-in
    :show-messaging
    @update:current-lang="changeLang"
    @on-logout="store.logout"
  />
  <Announcement :message="announcementMessage" />
  <ToastContainer />
  <div id="content">
    <DeleteAccount />
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
