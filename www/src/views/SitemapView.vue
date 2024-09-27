<template>
  <section class="fr-mb-12w">
    <article>
      <div>
        <div class="fr-container fr-mt-3w">
          <div class="fr-grid-row justify-content-center">
            <div class="fr-col-md-8">
              <h1>Plan du site</h1>
              <p><i>Dossier</i><b>Facile</b>, le dossier de location numérique de l’État.</p>

              <h2 v-for="page in mainPages" v-bind:key="page.url" class="fr-h4">
                <a :href="page.url">{{ page.name }}</a>
              </h2>

              <h2 class="fr-h4">Autres pages</h2>
              <ul>
                <li v-for="page in otherPages" v-bind:key="page.url">
                  <a :href="page.url">{{ page.name }}</a>
                </li>
              </ul>

              <h2 class="fr-mt-3w fr-h4">Réseaux sociaux</h2>
              <ul>
                <li v-for="social in socials" v-bind:key="social.name">
                  <a :href="social.url">{{ social.name }}</a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </article>
  </section>
</template>
<script setup lang="ts">
import { useHead } from '@unhead/vue'

useHead({
  title: 'DossierFacile, le dossier de location numérique de l’État'
})
const TENANT_URL = `//${import.meta.env.VITE_TENANT_URL}`
const OWNER_URL = import.meta.env.VITE_OWNER_URL
const REGISTER_URL = import.meta.env.VITE_REGISTER_URL

const mainPages = [
  {
    name: 'Monter mon dossier de location',
    url: REGISTER_URL
  },
  {
    name: 'Se connecter',
    url: `${TENANT_URL}/login`
  },
  {
    name: 'Espace propriétaire',
    url: `${OWNER_URL}`
  },
  {
    name: 'Qui sommes-nous ?',
    url: '/information'
  },
  {
    name: 'Devenir partenaire',
    url: 'https://partenaire.dossierfacile.logement.gouv.fr'
  },
  {
    name: 'Blog',
    url: '/blog'
  },
  {
    name: 'Aide',
    url: 'https://docs.dossierfacile.logement.gouv.fr'
  },
  {
    name: 'Contact',
    url: '/contact'
  }
]

const otherPages = [
  {
    name: 'Accessibilité',
    url: '/accessibilite'
  },
  {
    name: 'Mentions légales',
    url: '/mentions-legales'
  },
  {
    name: 'Politique de confidentialité',
    url: '/politique-de-confidentialite'
  },
  {
    name: "Conditions générales d'utilisation",
    url: '/cgu'
  },
  {
    name: 'Statistiques',
    url: '/stats'
  },
  {
    name: 'Code source',
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
</script>
