<template>
  <ul class="fr-nav__list">
    <li class="fr-nav__item">
      <router-link
        to="/information"
        class="fr-nav__link"
        :aria-current="currentPage === 'Information' ? 'page' : undefined"
      >
        {{ t('information') }}
      </router-link>
    </li>
    <li class="fr-nav__item">
      <router-link
        to="/blog"
        class="fr-nav__link"
        :aria-current="currentPage === 'Blog' ? 'page' : undefined"
      >
        {{ t('blog') }}
      </router-link>
    </li>
    <li class="fr-nav__item">
      <router-link
        to="/partenaires"
        class="fr-nav__link"
        :aria-current="currentPage === 'Partenaires' ? 'page' : undefined"
      >
        {{ t('partners.menu') }}
      </router-link>
    </li>
    <li class="fr-nav__item">
      <a :href="DOCS_URL" class="fr-nav__link fr-external-link" target="_blank" rel="noreferrer">
        {{ t('help') }}
      </a>
    </li>
    <li class="fr-nav__item">
      <router-link
        to="/contact"
        :aria-current="currentPage === 'Contact' ? 'page' : undefined"
        class="fr-nav__link"
        id="contact-us"
      >
        <span class="fr-icon-mail-line fr-icon--sm" aria-hidden="true"></span>
        {{ t('contact-us') }}
      </router-link>
    </li>
    <li class="fr-nav__item fr-translate">
      <LanguageSelector @on-change-lang="store.setLang" />
    </li>
  </ul>
</template>

<script setup lang="ts">
import LanguageSelector from 'df-shared-next/src/Header/LanguageSelector.vue'
import { useI18n } from 'vue-i18n'
import useWwwStore from '../stores/www-store'
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const DOCS_URL = `//${import.meta.env.VITE_DOCS_URL}`

const route = useRoute()
const { t } = useI18n()
const store = useWwwStore()

const currentPage = computed(() => route.name)
</script>

<style scoped lang="scss">
@import '@gouvfr/dsfr/dist/utility/icons/icons-business/icons-business.min.css';

.fr-nav__item {
  position: relative;

  a.fr-external-link::after {
    content: '';
  }
}

.fr-nav__list > li:nth-last-child(2) {
  @media all and (min-width: 992px) {
    margin-left: auto;
  }
}

.warn {
  background-color: #fdf2f3;
  a {
    color: var(--error);
  }
}
</style>
