<template>
  <section class="fr-mb-12w">
    <article class="fr-container fr-mt-3w">
      <div class="fr-grid-row justify-content-center">
        <div class="fr-col-md-8">
          <h1>{{ t('sitemap') }}</h1>

          <ul class="page-list">
            <li v-for="page in mainPages" :key="page.url" class="fr-h4">
              <a :href="page.url">{{ page.name }}</a>
            </li>
          </ul>

          <h2 class="fr-h4">{{ t('other') }}</h2>
          <ul>
            <li v-for="page in otherPages" :key="page.url">
              <a :href="page.url">{{ page.name }}</a>
            </li>
          </ul>

          <h2 class="fr-mt-3w fr-h4">{{ t('socials') }}</h2>
          <ul>
            <li v-for="social in socials" :key="social.name">
              <a :href="social.url">{{ social.name }}</a>
            </li>
          </ul>
        </div>
      </div>
    </article>
  </section>
</template>
<script setup lang="ts">
import { useCanonicalUrl, useMeta } from 'df-shared-next/src/composables/useSeo'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const TENANT_URL = import.meta.env.VITE_TENANT_URL
const OWNER_URL = import.meta.env.VITE_OWNER_URL
const REGISTER_URL = import.meta.env.VITE_REGISTER_URL
const PARTNER_URL = import.meta.env.VITE_PARTNER_URL

const mainPages = [
  {
    name: t('page-titles.createFile'),
    url: REGISTER_URL
  },
  {
    name: t('page-titles.login'),
    url: `${TENANT_URL}/login`
  },
  {
    name: t('page-titles.owner'),
    url: `${OWNER_URL}`
  },
  {
    name: t('page-titles.information'),
    url: '/information'
  },
  {
    name: t('page-titles.becomePartner'),
    url: PARTNER_URL
  },
  {
    name: t('page-titles.blog'),
    url: '/blog'
  },
  {
    name: t('page-titles.help'),
    url: 'https://aide.dossierfacile.logement.gouv.fr/fr'
  },
  {
    name: t('page-titles.contact'),
    url: '/contact'
  }
]

const otherPages = [
  {
    name: t('page-titles.accessibility'),
    url: '/accessibilite'
  },
  {
    name: t('page-titles.mentionsLegales'),
    url: '/mentions-legales'
  },
  {
    name: t('page-titles.politiqueDeConfidentialite'),
    url: '/politique-de-confidentialite'
  },
  {
    name: t('page-titles.CGU'),
    url: '/cgu'
  },
  {
    name: t('page-titles.statistiques'),
    url: '/stats'
  },
  {
    name: t('page-titles.source'),
    url: 'https://github.com/MTES-MCT/Dossier-Facile-Frontend'
  }
]

const socials = [
  {
    name: 'Twitter',
    url: 'https://twitter.com/dossierfacile'
  },
  {
    name: 'Facebook',
    url: 'https://www.facebook.com/DossierFacile'
  },
  {
    name: 'Linkedin',
    url: 'https://www.linkedin.com/company/startup-d-etat-locatio'
  },
  {
    name: 'Instagram',
    url: 'https://www.instagram.com/dossierfacile'
  },
  {
    name: 'TikTok',
    url: 'https://www.tiktok.com/@dossierfacile'
  }
]

useMeta({
  title: () => t('page-titles.planDuSite'),
  canonicalUrl: useCanonicalUrl()
})
</script>

<style scoped>
.page-list {
  list-style: none;
  padding-left: 0;
  & > li {
    padding: 0;
  }
}
</style>

<i18n lang="json">
{
  "en": {
    "sitemap": "Site map",
    "other": "Other pages",
    "socials": "Social networks"
  },
  "fr": {
    "sitemap": "Plan du site",
    "other": "Autres pages",
    "socials": "Réseaux sociaux"
  }
}
</i18n>
