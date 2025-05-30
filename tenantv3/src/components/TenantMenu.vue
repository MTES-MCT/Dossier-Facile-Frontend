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
        {{ t('menu.partners') }}
      </a>
    </li>
    <li class="fr-nav__item">
      <a
        :href="`${DOCS_URL}`"
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
        :aria-current="currentPage === 'Account' ? true : undefined"
      >
        {{ t('menu.account') }}
      </button>
      <div id="menu-774" class="fr-collapse fr-menu">
        <ul class="fr-menu__list">
          <li>
            <router-link
              class="fr-nav__link"
              to="/account"
              target="_self"
              :aria-current="currentPage === 'Account' ? 'page' : undefined"
            >
              {{ t('menu.file') }}
              <br />
              <span class="fr-label--disabled fr-text--xs">
                {{ user.email }}
              </span>
            </router-link>
          </li>
          <li v-if="partners.length > 0">
            <router-link
              class="fr-nav__link"
              to="/partners"
              target="_self"
              :aria-current="currentPage === 'PartnerAccessPage' ? 'page' : undefined"
            >
              {{ t('menu.shared') }}
            </router-link>
          </li>
          <li>
            <router-link
              class="fr-nav__link"
              to="/applications"
              target="_self"
              :aria-current="currentPage === 'SharingPage' ? 'page' : undefined"
            >
              {{ t('menu.applications') }}
            </router-link>
          </li>
          <li>
            <DfButton
              class="fr-nav__link"
              data-fr-opened="false"
              aria-controls="modal-delete-account"
              style="visibility: none"
            >
              {{ t('menu.deleteAccount') }}
            </DfButton>
          </li>
        </ul>
      </div>
    </li>
    <li v-if="showMessaging()" class="fr-nav__item">
      <router-link
        to="/messaging"
        class="fr-nav__link"
        :aria-current="currentPage === 'Messages' ? 'page' : undefined"
      >
        {{ t('menu.messaging') }}
        <span v-if="newMessage > 0" class="badge">{{ newMessage }}</span>
      </router-link>
    </li>
    <li class="fr-nav__item" :class="{ break: !isLoggedIn }">
      <router-link
        to="/contact"
        :aria-current="currentPage === 'Contact' ? 'page' : undefined"
        class="fr-nav__link"
      >
        <span class="fr-icon-mail-line fr-icon--sm" aria-hidden="true"></span>
        {{ t('menu.contact-us') }}
      </router-link>
    </li>
    <li class="fr-nav__item fr-translate">
      <LanguageSelector :initial-language="lang" @on-change-lang="changeLang" />
    </li>
  </ul>
</template>

<script setup lang="ts">
import DfButton from 'df-shared-next/src/Button/DfButton.vue'
import LanguageSelector from 'df-shared-next/src/Header/LanguageSelector.vue'

import { useI18n } from 'vue-i18n'
import { computed } from 'vue'
import { useTenantStore } from '@/stores/tenant-store'
import { i18n } from '@/i18n'
import { useRoute } from 'vue-router'

const { t } = useI18n()
const store = useTenantStore()
const user = computed(() => store.user)
const isLoggedIn = computed(() => store.isLoggedIn)
const newMessage = computed(() => store.newMessage)
const partners = computed(() => store.partnerAccesses)

const MAIN_URL = `//${import.meta.env.VITE_MAIN_URL}`
const DOCS_URL = `//${import.meta.env.VITE_DOCS_URL}`
const route = useRoute()

const currentPage = computed(() => {
  return route.name
})

const lang = i18n.global.locale.value

function showMessaging() {
  return (
    (isLoggedIn.value === true && user.value.status !== 'INCOMPLETE') ||
    (store.messageList[user.value.id] !== undefined && store.messageList[user.value.id].length > 0)
  )
}
function changeLang(lang: 'fr' | 'en') {
  store.setLang(lang)
}
</script>

<style scoped lang="scss">
.badge {
  position: absolute;
  top: 0.5rem;
  right: 0.25rem;
  border-radius: 50%;
  background: var(--secondary);
  color: var(--primary);
  z-index: 1;
  min-width: 1.6em;
  height: 1.6em;
  border: 0.05em solid white;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 0.8em;
}

.fr-nav__item {
  position: relative;

  a.fr-external-link::after {
    content: '';
  }
}

.fr-nav__list > li.break {
  @media all and (min-width: 992px) {
    margin-left: auto;
  }
}

.fr-nav__link {
  &.fr-btn--secondary {
    box-shadow: none;
  }
}
</style>
