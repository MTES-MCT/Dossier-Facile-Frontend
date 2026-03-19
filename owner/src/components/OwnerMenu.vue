<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import LanguageSelector from 'df-shared-next/src/Header/LanguageSelector.vue'
import useOwnerStore from '../store/owner-store'
import { DsfrButton } from '@gouvminint/vue-dsfr'
import { useModalStore } from 'df-shared-next/src/stores/useModalStore'

const store = useOwnerStore()
const isLoggedIn = computed(() => store.isLoggedIn)
const route = useRoute()
const { t, locale } = useI18n()

const { openModal } = useModalStore('deleteAccount')

const MAIN_URL = `//${import.meta.env.VITE_MAIN_URL}`
const DOCS_URL = `//${import.meta.env.VITE_DOCS_URL}`

const currentPage = computed(() => route.name)

function changeLang(lang: 'fr' | 'en') {
  store.setLang(lang)
}
</script>

<template>
  <ul class="fr-nav__list">
    <li class="fr-nav__item">
      <a :href="`${MAIN_URL}/information`" class="fr-nav__link">
        {{ t('menu.information') }}
      </a>
    </li>
    <li class="fr-nav__item">
      <a :href="`${MAIN_URL}/blog`" class="fr-nav__link">
        {{ t('menu.blog') }}
      </a>
    </li>
    <li class="fr-nav__item">
      <a :href="`${MAIN_URL}/partenaires`" class="fr-nav__link">
        {{ t('partners') }}
      </a>
    </li>
    <li class="fr-nav__item">
      <a
        :href="DOCS_URL"
        :title="`${t('menu.help')} - ${t('new-window')}`"
        class="fr-nav__link fr-external-link"
        target="_blank"
        rel="noreferrer"
      >
        {{ t('menu.help') }}
      </a>
    </li>
    <li v-if="isLoggedIn" class="fr-nav__item break">
      <button
        class="fr-nav__btn"
        aria-expanded="false"
        aria-controls="menu-774"
        :aria-current="
          currentPage === 'AccountName' || currentPage === 'Dashboard' ? true : undefined
        "
      >
        {{ t('menu.account') }}
      </button>
      <div id="menu-774" class="fr-collapse fr-menu">
        <ul class="fr-menu__list">
          <li>
            <RouterLink
              class="fr-nav__link"
              to="/proprietaire"
              target="_self"
              :aria-current="currentPage === 'AccountName' ? 'page' : undefined"
              >{{ t('menu.personal-data') }}</RouterLink
            >
          </li>
          <li>
            <RouterLink
              class="fr-nav__link"
              to="/"
              target="_self"
              :aria-current="currentPage === 'Dashboard' ? 'page' : undefined"
              >{{ t('menu.dashboard') }}</RouterLink
            >
          </li>
          <li>
            <DsfrButton
              id="delete-account-btn"
              class="fr-nav__link"
              :label="t('menu.deleteAccount')"
              :tertiary="true"
              @click="openModal"
            />
          </li>
        </ul>
      </div>
    </li>
    <li class="fr-nav__item" :class="{ break: !isLoggedIn }">
      <a
        href="/contact"
        :aria-current="currentPage === 'Contact' ? 'page' : undefined"
        class="fr-nav__link"
      >
        <span class="fr-icon-mail-line fr-icon--sm" aria-hidden="true"></span>
        {{ t('menu.contact-us') }}
      </a>
    </li>
    <li class="fr-nav__item fr-translate">
      <LanguageSelector :initial-language="locale" @on-change-lang="changeLang" />
    </li>
  </ul>
</template>

<style scoped lang="scss">
.fr-nav__item {
  position: relative;

  a.fr-external-link::after {
    content: '';
  }
}

.lang {
  box-shadow: none;
}

.fr-nav__list > li.break {
  @media all and (min-width: 992px) {
    margin-left: auto;
  }
}
</style>

<i18n lang="json">
{
  "en": {
    "partners": "Partners",
    "new-window": "Open in a new window"
  },
  "fr": {
    "partners": "Partenaires",
    "new-window": "Ouvre une nouvelle fenêtre"
  }
}
</i18n>
