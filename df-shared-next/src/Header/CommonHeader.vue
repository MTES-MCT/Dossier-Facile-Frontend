<script setup lang="ts">
import type {
  DsfrHeaderProps,
  DsfrLanguageSelectorElement,
  DsfrNavigationProps
} from '@gouvminint/vue-dsfr'
import { DsfrHeader, DsfrNavigation } from '@gouvminint/vue-dsfr'
import type { Locale } from '../i18n'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

interface Props {
  isLoggedIn: boolean
  showMessaging: boolean
  newMessage?: number
}

const { isLoggedIn, showMessaging, newMessage = undefined } = defineProps<Props>()
const { t } = useI18n()
const emit = defineEmits<{ 'on-logout': [] }>()

const TENANT_URL = import.meta.env.VITE_TENANT_URL
const OWNER_URL = import.meta.env.VITE_OWNER_URL
const PARTNER_URL = import.meta.env.VITE_PARTNER_URL
const DOCS_URL = import.meta.env.VITE_DOCS_URL

const logoText = ['République', 'française']
const serviceDescription = "Le dossier de location numérique de l'État"
const quickLinks = computed<DsfrHeaderProps['quickLinks']>(() => [
  {
    label: isLoggedIn ? t('logout') : t('tenant'),
    to: isLoggedIn ? undefined : `${TENANT_URL}/login`,
    button: isLoggedIn,
    onClick: isLoggedIn ? () => emit('on-logout') : undefined,
    icon: 'ri:account-circle-line'
  },
  ...(!isLoggedIn
    ? [
        { label: t('owner'), to: OWNER_URL, icon: 'ri:community-line' },
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
          to: '/information',
          text: t('nav.information')
        },
        {
          to: '/blog',
          text: t('nav.blog')
        },
        {
          to: '/partenaires',
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
              to: '/account',
              text: t('menu.file')
            },
            {
              to: '/partages',
              text: t('menu.shared')
            },
            {
              to: '/settings',
              text: t('menu.settings')
            }
          ]
        }
      ]
    : []),
  ...(showMessaging
    ? [
        {
          id: 'nav-notification',
          to: '/messaging',
          text: newMessage ? t('nav.new-messaging', newMessage) : t('nav.messaging'),
          icon: newMessage ? 'ri:error-warning-line' : undefined
        }
      ]
    : []),
  {
    to: DOCS_URL,
    text: t('nav.help'),
    target: '_blank',
    title: `${t('nav.help')} - ${t('new-window')}`
  },
  {
    to: '/contact',
    text: t('nav.contact')
  }
])

const updateLang = (payload: DsfrLanguageSelectorElement) => {
  lang.value = payload.codeIso as Locale
}
</script>

<template>
  <DsfrHeader :logo-text :quick-links :language-selector @language-select="updateLang">
    <template #operator>
      <p class="fr-text--xl">Dossier<b>Facile</b></p>
      <p class="fr-text--sm">{{ serviceDescription }}</p>
    </template>
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
      "messaging": "Messages",
      "new-messaging": "{n} new message | {n} new messages"
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
      "messaging": "Messagerie",
      "new-messaging": "{n} nouveau message | {n} nouveaux messages"
    }
  }
}
</i18n>
