<script setup lang="ts">
import Footer from 'df-shared-next/src/Footer/FooterComponent.vue'
import FollowSocials from 'df-shared-next/src/Footer/FollowSocials.vue'
import CommonHeader from 'df-shared-next/src/Header/CommonHeader.vue'
import Announcement from 'df-shared-next/src/components/AnnouncementBanner.vue'
import ConsentHandler from 'df-shared-next/src/components/ConsentHandler.vue'
import A11yNavigation from 'df-shared-next/src/components/A11yNavigation.vue'
import SkipLinks from 'df-shared-next/src/components/SkipLinks.vue'
import { type DsfrSkipLinksProps } from '@gouvminint/vue-dsfr'
import { MAIN_NAV, CONTENT } from 'df-shared-next/src/models/SkipLink'
import { changeLang, locale } from './i18n'
import { computed, onBeforeMount, ref, useTemplateRef, provide } from 'vue'
import {
  type AccessibilityPropertiesType,
  AccessibilityPropertiesKey
} from 'df-shared-next/src/models/injectionKeys'

const MESSAGE = import.meta.env.VITE_ANNOUNCEMENT_MESSAGE || ''
const siteTitle = import.meta.env.VITE_SITE_TITLE || 'DossierFacile'

const links: DsfrSkipLinksProps = {
  links: [MAIN_NAV, CONTENT]
}

const mainElement = useTemplateRef<HTMLElement>('main')

const pageTitle = ref<string>()
const a11yNavigationRef = useTemplateRef('a11yNavigation')
const setAccessibilityProperties: AccessibilityPropertiesType = (title, focus = true): void => {
  // set page title for screen readers
  if (title) {
    pageTitle.value = `Page ${title} - ${siteTitle}`
  }
  // focus hidden title container
  if (focus && a11yNavigationRef.value?.a11yTitle) {
    a11yNavigationRef.value.a11yTitle.focus()
  }
}

provide(AccessibilityPropertiesKey, setAccessibilityProperties)

// check for saved locale choice
const currentLocale = computed(() => (localStorage.getItem('lang') === 'en' ? 'en' : 'fr'))
// apply the choice
onBeforeMount(() => {
  changeLang(currentLocale.value)
})
</script>

<template>
  <div class="cdn-background"></div>
  <ConsentHandler />
  <A11yNavigation ref="a11yNavigation" :page-title />
  <SkipLinks :links />
  <CommonHeader
    v-model:current-lang="locale"
    :is-logged-in="false"
    :show-messaging="false"
    @update:current-lang="(lang) => lang && changeLang(lang)"
  />
  <div id="content">
    <Announcement :message="MESSAGE" :to-focus="mainElement" />
    <main ref="main" class="page" role="main" tabindex="-1">
      <RouterView />
      <FollowSocials />
    </main>
  </div>
  <Footer />
</template>

<style lang="scss">
@use 'df-shared-next/src/scss/_main.scss';
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
