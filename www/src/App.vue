<script setup lang="ts">
import Footer from 'df-shared-next/src/Footer/FooterComponent.vue'
import FollowSocials from 'df-shared-next/src/Footer/FollowSocials.vue'
import CommonHeader from 'df-shared-next/src/Header/CommonHeader.vue'
import Announcement from 'df-shared-next/src/components/AnnouncementBanner.vue'
import ConsentHandler from 'df-shared-next/src/components/ConsentHandler.vue'
import SkipLinks from 'df-shared-next/src/components/SkipLinks.vue'
import { useHead } from '@unhead/vue'
import { type DsfrSkipLinksProps } from '@gouvminint/vue-dsfr'
import { MAIN_NAV, CONTENT } from 'df-shared-next/src/models/SkipLink'
import { changeLang, locale } from './i18n'
import { computed, onBeforeMount } from 'vue'

const MESSAGE = import.meta.env.VITE_ANNOUNCEMENT_MESSAGE || ''
const siteTitle = import.meta.env.VITE_SITE_TITLE || 'DossierFacile'

const links: DsfrSkipLinksProps = {
  links: [MAIN_NAV, CONTENT]
}

// SEO defaults
const titleTemplate = (title?: string) => (title ? `${title} - ${siteTitle}` : siteTitle)
const seoDescription =
  "Avec DossierFacile, créez un dossier de location en ligne complet et vérifié par l'Etat pour trouver votre appartement ou votre logement"

useHead({
  titleTemplate,
  meta: [
    { name: 'og:title', content: siteTitle },
    { name: 'description', content: seoDescription },
    { name: 'og:description', content: seoDescription }
  ]
})

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
  <SkipLinks :links />
  <CommonHeader
    v-model:current-lang="locale"
    :is-logged-in="false"
    :show-messaging="false"
    @update:current-lang="changeLang"
  />
  <div id="content">
    <Announcement :message="MESSAGE" />
    <main class="page" role="main">
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
