<template>
  <header role="banner" class="fr-header">
    <div class="fr-header__body">
      <div class="fr-container">
        <div class="fr-header__body-row">
          <div class="fr-header__brand fr-enlarge-link">
            <div class="fr-header__brand-top">
              <div class="fr-header__logo">
                <p class="fr-logo">
                  République<br />
                  française
                </p>
              </div>
              <div class="fr-header__navbar">
                <button
                  class="fr-btn--menu fr-btn"
                  data-fr-opened="false"
                  aria-controls="modal-dc"
                  aria-haspopup="menu"
                  title="Menu"
                >
                  Menu
                </button>
              </div>
            </div>
            <div class="fr-header__service">
              <a :href="`${MAIN_URL}/`" title="Dossier Facile - Accueil">
                <p class="fr-header__service-title">
                  <span style="font-weight: normal">Dossier</span>Facile
                </p>
              </a>
              <p class="fr-header__service-tagline">Le dossier de location numérique de l'État</p>
            </div>
          </div>

          <div class="fr-header__tools">
            <div class="fr-header__tools-links">
              <ul class="fr-btns-group">
                <li v-if="loggedIn">
                  <DfButton type="button" @click="$emit('on-logout')">
                    <RiAccountCircleLine aria-hidden="true" class="fr-mr-1v" />
                    {{ t('logout') }}
                  </DfButton>
                </li>
                <template v-else>
                  <li>
                    <slot name="login">
                      <a :href="TENANT_URL" class="fr-btn fr-btn--sm">
                        <RiAccountCircleLine aria-hidden="true" class="fr-mr-1v" />
                        {{ t('tenant') }}
                      </a>
                    </slot>
                  </li>
                  <li>
                    <slot name="other">
                      <a :href="OWNER_URL" class="fr-btn fr-btn--sm">
                        <RiCommunityLine aria-hidden="true" class="fr-mr-1v" />
                        {{ t('owner') }}
                      </a>
                    </slot>
                  </li>
                  <li>
                    <a
                      class="fr-external-link fr-btn fr-btn--sm"
                      :href="PARTNER_URL"
                      target="_blank"
                      rel="noopener"
                      :title="t('partner-link-title')"
                    >
                      <RiHomeHeartLine aria-hidden="true" class="fr-mr-1v" />
                      {{ t('partner') }}
                    </a>
                  </li>
                </template>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- Navigation principale -->
    <div id="modal-dc" class="fr-header__menu fr-modal">
      <div class="fr-container">
        <button class="fr-btn--close fr-btn" aria-controls="modal-dc" title="fermer">Fermer</button>
        <div class="fr-header__menu-links" style="display: none"></div>
        <div class="fr-header__menu-links-hack">
          <ul class="fr-btns-group">
            <li v-if="loggedIn">
              <DfButton type="button" class="fr-ml-3" size="small" @click="$emit('on-logout')">
                <RiAccountCircleLine aria-hidden="true" class="fr-mr-1v" />
                {{ t('logout') }}
              </DfButton>
            </li>
            <template v-else>
              <li>
                <slot name="login">
                  <a :href="TENANT_URL" class="fr-btn fr-btn--sm fr-btn--secondary">
                    <RiAccountCircleLine aria-hidden="true" class="fr-mr-1v" />
                    {{ t('tenant') }}
                  </a>
                </slot>
              </li>
              <li>
                <slot name="other">
                  <a :href="OWNER_URL" class="fr-btn fr-btn--sm fr-btn--secondary">
                    <RiCommunityLine aria-hidden="true" class="fr-mr-1v" />
                    {{ t('owner') }}
                  </a>
                </slot>
              </li>
              <li>
                <a
                  class="fr-external-link fr-btn fr-btn--sm fr-btn--secondary"
                  :href="PARTNER_URL"
                  target="_blank"
                  rel="noopener"
                  :title="t('partner-link-title')"
                >
                  <RiHomeHeartLine aria-hidden="true" class="fr-mr-1v" />
                  {{ t('partner') }}
                </a>
              </li>
            </template>
          </ul>
        </div>
        <nav id="navigation-832" class="fr-nav" role="navigation" aria-label="Menu principal">
          <slot></slot>
        </nav>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { RiAccountCircleLine, RiCommunityLine, RiHomeHeartLine } from '@remixicon/vue'
import DfButton from '../Button/DfButton.vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const MAIN_URL = `//${import.meta.env.VITE_MAIN_URL}`
const TENANT_URL = `//${import.meta.env.VITE_TENANT_URL}/login`
const OWNER_URL = `${import.meta.env.VITE_OWNER_URL}`
const PARTNER_URL =
  'https://partenaire.dossierfacile.logement.gouv.fr/devenir-partenaire-1/pourquoi-devenir-partenaire-dossierfacile'

withDefaults(defineProps<{ loggedIn?: boolean }>(), { loggedIn: false })

defineEmits<{ 'on-logout': [] }>()
</script>

<style lang="scss" scoped>
.logo {
  width: 290px;
  max-width: 290px;
  height: 89px;
}

:deep(.fr-btn--secondary) {
  box-shadow: none;
}

li {
  margin: 0.5rem;
}

.fr-header__service-tagline {
  @media all and (max-width: 768px) {
    display: none;
  }
}

.fr-header__menu-links-hack {
  @media all and (min-width: 992px) {
    display: none;
  }
}
</style>

<i18n>
{
  "en": {
    "logout": "Logout",
    "owner": "Owner area",
    "tenant": "Tenant area",
    "partner": "Become partner",
    "partner-link-title": "Become partner (New Window)"
  },
  "fr": {
    "logout": "Se déconnecter",
    "owner": "Espace propriétaire",
    "tenant": "Espace locataire",
    "partner": "Devenir partenaire",
    "partner-link-title": "Devenir partenaire (Nouvelle fenêtre)"
  }
}
</i18n>
