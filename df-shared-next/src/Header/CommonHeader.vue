<script setup lang="ts">
import type {
  DsfrHeaderProps,
  DsfrLanguageSelectorElement,
  DsfrNavigationProps
} from '@gouvminint/vue-dsfr'
import { DsfrHeader, DsfrNavigation } from '@gouvminint/vue-dsfr'
import type { Locale } from '../i18n'
import { useModalStore } from '../stores/useModalStore'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

interface Props {
  isLoggedIn: boolean
  showMessaging: boolean
}

const { isLoggedIn, showMessaging } = defineProps<Props>()
const { t } = useI18n()
const emit = defineEmits<{ 'on-logout': [] }>()

const { openModal } = useModalStore('deleteAccount')

const MAIN_URL = import.meta.env.VITE_MAIN_URL
const TENANT_URL = import.meta.env.VITE_TENANT_URL
const OWNER_URL = import.meta.env.VITE_OWNER_URL
const PARTNER_URL = import.meta.env.VITE_PARTNER_URL
const DOCS_URL = import.meta.env.VITE_DOCS_URL

const logoText = ['République', 'française']
const serviceTitle = 'Dossier Facile'
const serviceDescription = "Le dossier de location numérique de l'État"
const quickLinks = computed<DsfrHeaderProps['quickLinks']>(() => [
  {
    label: isLoggedIn ? t('logout') : t('tenant'),
    to: isLoggedIn ? undefined : `${TENANT_URL}/login`,
    button: isLoggedIn,
    onClick: isLoggedIn ? () => emit('on-logout') : undefined,
    icon: 'ri:account-circle-line'
  },
  ...(isLoggedIn
    ? [
        {
          label: t('menu.deleteAccount'),
          button: true,
          onClick: openModal,
          icon: 'ri:delete-bin-line'
        }
      ]
    : []),
  ...(!isLoggedIn ? [{ label: t('owner'), to: OWNER_URL, icon: 'ri:community-line' }] : []),
  ...(!isLoggedIn
    ? [
        {
          label: t('partner'),
          to: PARTNER_URL,
          icon: 'ri:home-heart-line'
        }
      ]
    : [])
])

const lang = defineModel<Locale>('currentLang', { required: true })

const languageSelector = computed<DsfrHeaderProps['languageSelector']>(() => {
  return {
    id: 'language-selector',
    languages: [
      { label: 'Français', codeIso: 'fr' },
      { label: 'English', codeIso: 'en' }
    ],
    currentLanguage: lang.value
  }
})

const navItems = computed<DsfrNavigationProps['navItems']>(() => [
  ...(!isLoggedIn
    ? [
        {
          to: `${MAIN_URL}/information`,
          text: t('nav.information')
        },
        {
          to: `${MAIN_URL}/blog`,
          text: t('nav.blog')
        },
        {
          to: `${MAIN_URL}/partenaires`,
          text: t('nav.partners')
        }
      ]
    : []),
  ...(isLoggedIn
    ? [
        {
          title: t('menu.account'),
          links: [
            {
              to: `${TENANT_URL}/account`,
              text: t('menu.file')
            },
            {
              to: `${TENANT_URL}/partages`,
              text: t('menu.shared')
            }
          ]
        }
      ]
    : []),
  ...(showMessaging
    ? [
        {
          id: 'nav-notification',
          to: `${TENANT_URL}/messaging`,
          text: t('nav.messaging'),
          icon: 'ri:error-warning-line'
        }
      ]
    : []),
  {
    to: DOCS_URL,
    text: t('nav.help')
  },
  {
    to: isLoggedIn ? '/contact' : `${MAIN_URL}/contact`,
    text: t('nav.contact')
  }
])

const updateLang = (payload: DsfrLanguageSelectorElement) => {
  lang.value = payload.codeIso as Locale
}
</script>

<template>
  <DsfrHeader
    :logo-text
    :service-title
    :service-description
    :quick-links
    :language-selector
    @language-select="updateLang"
  >
    <template #mainnav>
      <DsfrNavigation id="main-nav" :nav-items />
    </template>
  </DsfrHeader>
</template>

<style scoped>
:deep(#nav-notification a) {
  justify-content: start;
  gap: 0.25rem;
}
:deep(#nav-notification a svg) {
  font-size: 1rem !important;
  margin-block-end: auto;
  color: var(--text-default-warning) !important;
}
</style>

<i18n lang="json">
{
  "en": {
    "logout": "Logout",
    "owner": "Owner area",
    "tenant": "Tenant area",
    "partner": "Become partner",
    "partner-link-title": "Become partner (New Window)",
    "nav": {
      "information": "Who are we?",
      "blog": "Blog",
      "partners": "Partners",
      "help": "Help",
      "contact": "Contact us",
      "messaging": "New messages"
    }
  },
  "fr": {
    "logout": "Se déconnecter",
    "owner": "Espace propriétaire",
    "tenant": "Espace locataire",
    "partner": "Devenir partenaire",
    "partner-link-title": "Devenir partenaire (Nouvelle fenêtre)",
    "nav": {
      "information": "Qui sommes-nous ?",
      "blog": "Blog",
      "partners": "Partenaires",
      "help": "Aide",
      "contact": "Nous contacter",
      "messaging": "Nouveaux messages"
    }
  }
}
</i18n>
