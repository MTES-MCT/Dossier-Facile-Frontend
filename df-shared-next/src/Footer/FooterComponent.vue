<template>
  <footer id="footer" class="fr-footer" role="contentinfo" tabindex="-1">
    <div class="fr-container">
      <div class="fr-footer__body">
        <div class="fr-footer__brand">
          <p class="fr-logo">
            république
            <br />française
          </p>
          <a class="fr-footer__brand-link" href="https://beta.gouv.fr/">
            <img
              src="./logo-betagouvfr.svg"
              class="logo-beta"
              aria-label="Accueil - beta.gouv.fr"
            />
          </a>
        </div>
        <div class="fr-footer__content">
          <p class="fr-footer__content-desc">
            DossierFacile est propulsé par la
            <a
              href="https://www.ecologie.gouv.fr/direction-generale-lamenagement-du-logement-et-nature-dgaln"
              title="direction générale de l'aménagement, du logement et de la nature - Nouvelle fenêtre"
              target="_blank"
              rel="noreferrer noopener"
              >direction générale de l'aménagement, du logement et de la nature</a
            >. <br />Le code source est disponible en licence libre
          </p>
          <ul class="fr-footer__content-list">
            <li class="fr-footer__content-item">
              <a
                class="fr-footer__content-link"
                title="legifrance.gouv.fr - nouvelle fenêtre"
                rel="noreferrer noopener"
                target="_blank"
                href="https://www.legifrance.gouv.fr/"
                >legifrance.gouv.fr</a
              >
            </li>
            <li class="fr-footer__content-item">
              <a
                class="fr-footer__content-link"
                title="info.gouv.fr - nouvelle fenêtre"
                rel="noreferrer noopener"
                target="_blank"
                href="https://www.info.gouv.fr/"
                >info.gouv.fr</a
              >
            </li>
            <li class="fr-footer__content-item">
              <a
                class="fr-footer__content-link"
                title="service-public.fr - nouvelle fenêtre"
                rel="noreferrer noopener"
                target="_blank"
                href="https://service-public.fr"
                >service-public.fr</a
              >
            </li>
            <li class="fr-footer__content-item">
              <a
                class="fr-footer__content-link"
                title="data.gouv.fr - nouvelle fenêtre"
                rel="noreferrer noopener"
                target="_blank"
                href="https://data.gouv.fr"
                >data.gouv.fr</a
              >
            </li>
          </ul>
        </div>
      </div>
      <div class="fr-footer__bottom">
        <ul class="fr-footer__bottom-list">
          <li class="fr-footer__bottom-item">
            <a class="fr-footer__bottom-link" :href="`${VITE_MAIN_URL}/plan-du-site`">
              {{ t('sitemap') }}
            </a>
          </li>
          <li class="fr-footer__bottom-item">
            <a
              class="fr-footer__bottom-link"
              :href="`${VITE_MAIN_URL}/accessibilite`"
              :title="t('accessibility-link')"
              >{{ t('accessibility') }}</a
            >
          </li>
          <li class="fr-footer__bottom-item">
            <a class="fr-footer__bottom-link" :href="`${VITE_MAIN_URL}/mentions-legales`">
              {{ t('legals') }}
            </a>
          </li>
          <li class="fr-footer__bottom-item">
            <a
              class="fr-footer__bottom-link"
              :href="`${VITE_MAIN_URL}/politique-de-confidentialite`"
            >
              {{ t('privacy-policy') }}
            </a>
          </li>
          <li class="fr-footer__bottom-item">
            <button
              type="button"
              class="fr-footer__bottom-link"
              data-fr-opened="false"
              aria-controls="fr-consent-modal"
            >
              {{ t('cookies') }}
            </button>
          </li>
          <li class="fr-footer__bottom-item">
            <a
              class="fr-footer__bottom-link"
              :title="t('cgu-link-title')"
              :href="`${VITE_MAIN_URL}/cgu`"
            >
              {{ t('cgu') }}
            </a>
          </li>
          <li class="fr-footer__bottom-item">
            <a class="fr-footer__bottom-link" :href="`${VITE_MAIN_URL}/stats`">
              {{ t('statistics') }}
            </a>
          </li>
          <li class="fr-footer__bottom-item">
            <a
              class="fr-footer__bottom-link"
              :href="`${VITE_DOCS_URL}`"
              target="_blank"
              rel="noreferrer"
              :title="t('faq-link-title')"
            >
              {{ t('faq') }}
            </a>
          </li>
          <li class="fr-footer__bottom-item">
            <a
              class="fr-footer__bottom-link"
              href="https://partenaire.dossierfacile.logement.gouv.fr"
              target="_blank"
              rel="noreferrer"
              :title="t('partner-link-title')"
            >
              {{ t('partner') }}
            </a>
          </li>
          <li class="fr-footer__bottom-item">
            <a
              class="fr-footer__bottom-link"
              target="_blank"
              rel="noreferrer"
              :title="t('sources-link-title')"
              href="https://github.com/MTES-MCT/Dossier-Facile-Frontend"
            >
              {{ t('sources') }}
            </a>
          </li>
        </ul>
        <div class="fr-footer__bottom-copy">
          <p>
            Sauf mention contraire, tous les contenus de ce site sont sous
            <a href="https://github.com/etalab/licence-ouverte/blob/master/LO.md" target="_blank"
              >licence etalab-2.0</a
            >
          </p>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

defineEmits<{ showModal: [] }>()

const VITE_MAIN_URL = ref(`//${import.meta.env.VITE_MAIN_URL}`)
const VITE_DOCS_URL = ref(`//${import.meta.env.VITE_DOCS_URL}`)

const { t } = useI18n()
</script>

<style lang="scss" scoped>
ul.fr-follow {
  background-color: transparent;
  display: inline-flex;
  flex-direction: row;
  justify-content: center;
  list-style: none;
  margin: 0;
  padding: 0;
  height: auto;
  width: auto;
  .fr-btn {
    background-color: white;
    color: grey;
    max-width: 1.5rem;
    vertical-align: middle;
    --icon-size: 1rem;
    padding-left: 0.15rem;
    &:before {
      visibility: visible;
    }
  }
  li {
    padding: 0 0.25rem 0 0.25rem;
  }
}
.fr-footer__brand-link {
  background-image: none;
}
.fr-follow a.fr-btn--tiktok:before {
  content: '';
  -webkit-mask-image: url(../../../node_modules/@gouvfr/dsfr/dist/icons/logo/fr--tiktok-fill.svg);
  mask-image: url(../../../node_modules/@gouvfr/dsfr/dist/icons/logo/fr--tiktok-fill.svg);
  --icon-size: 1.5rem;
  background-color: currentColor;
  display: inline-block;
  flex: 0 0 auto;
  height: var(--icon-size);
  -webkit-mask-size: 100% 100%;
  mask-size: 100% 100%;
  vertical-align: middle;
  width: var(--icon-size);
}
.logo-beta {
  height: 103px;
  width: 300px;
}
</style>

<i18n>
{
  "en": {
    "legals": "Legal notice",
    "privacy-policy": "Privacy Policy",
    "cookies": "Cookie management",
    "cgu": "GCU",
    "faq": "Help",
    "sitemap": "Sitemap",
    "sources": "Source code",
    "accessibility": "Accessibility: partially compliant",
    "statistics": "Statistics",
    "partner": "Become partners",
    "cgu-link-title": "General condition of use",
    "faq-link-title": "Help - new window",
    "partner-link-title": "Partners - new window",
    "accessibility-link": "Accessibility - new window",
    "sources-link-title": "Source code - new window"
  },
  "fr": {
    "legals": "Mentions légales",
    "privacy-policy": "Politique de confidentialité",
    "cookies": "Gestion des cookies",
    "cgu": "CGU",
    "faq": "Aide",
    "sitemap": "Plan du site",
    "information": "En savoir plus",
    "sources": "Code source",
    "accessibility": "Accessibilité : partiellement conforme",
    "statistics": "Statistiques",
    "partner": "Devenir partenaire",
    "cgu-link-title": "Conditions générales d’utilisation",
    "faq-link-title": "Aide - Ouvre nouvelle fenêtre",
    "partner-link-title": "Devenir partenaire - Ouvre nouvelle fenêtre",
    "accessibility-link": "Accessibilité : partiellement conforme - Ouvre nouvelle fenêtre",
    "sources-link-title": "Code source - Ouvre nouvelle fenêtre"
  }
}
</i18n>
