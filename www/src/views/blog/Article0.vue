<template>
  <div>
    <section class="s0-background fr-pb-9w">
      <div class="fr-container">
        <div class="fr-col-md-8">
          <div class="fr-grid-col">
            <h1 class="fr-h1 color--white fr-mt-5w fr-mb-5w">Locatio devient DossierFacile</h1>
            <p class="text-bold color--white">
              Pas de panique ! Le nom change, mais le service reste le même !
            </p>
          </div>
        </div>
      </div>
    </section>
    <section class="fr-mt-3w fr-mb-5w">
      <div class="fr-container">
        <div class="fr-grid-row">
          <p>
            Grâce à DossierFacile, ex-Locatio, vous pouvez monter facilement et gratuitement votre
            dossier de location en ligne. Constituer votre dossier de location numérique en 3 étapes
            simples:
          </p>
          <ol>
            <li>
              Téléchargez vos pièces justificatives sur notre site internet
              <a href="https://www.dossierfacile.logement.gouv.fr"
                >www.dossierfacile.logement.gouv.fr</a
              >, notamment&nbsp;:
            </li>
            <ul>
              <li>Une pièce d'identité</li>
              <li>Un justificatif de situation d'hébergement</li>
              <li>Un justificatif de situation professionnelle</li>
              <li>Un avis d'imposition</li>
              <li>Un justificatif de ressources</li>
              … Et c'est tout
            </ul>
            <li>DossierFacile valide votre dossier</li>
            <p>
              Nos équipes effectuent une batterie de tests pour s’assurer que le dossier répond à
              nos critères “3C”, c'est-à-dire qu'il est clair, complet et cohérent, et vous aide à
              le corriger si besoin
            </p>
            <li>Votre dossier est prêt à être envoyé</li>
            <p>
              Votre dossier sécurisé sous forme de lien URL ou au format PDF est prêt à être envoyé
              aux propriétaires et/ou aux professionnels de l’immobilier. Ceux-ci peuvent
              télécharger les pièces justificatives directement via le lien envoyé.
            </p>
          </ol>
          <p class="p-btn">
            <a class="fr-btn" :href="REGISTER_URL">
              {{ t('button') }}
            </a>
          </p>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { useHead } from '@unhead/vue'
import image from '../../assets/cover-features.webp'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const REGISTER_URL = import.meta.env.VITE_REGISTER_URL

const title = 'Locatio devient DossierFacile'
const description =
  'Locatio, le service d’Etat permettant de monter un dossier de location en ligne certifié clair, complet et cohérent,change de nom et devient DossierFacile.fr'

useHead({
  title: title,
  meta: [
    { name: 'og:title', content: title },
    { name: 'twitter:title', content: title },
    { name: 'description', content: description },
    { name: 'og:description', content: description },
    { name: 'twitter:description', content: description },
    { name: 'og:image', content: new URL(image, import.meta.url).href },
    { name: 'twitter:image', content: new URL(image, import.meta.url).href }
  ]
})
</script>

<style scoped lang="scss">
@import 'df-shared-next/src/scss/_variables.scss';

.s0-background {
  width: 100%;
  top: 0;
  left: 0;
  background-size: cover !important;
  background-position: 50% 50% !important;
  background-image: url('../../assets/cover-features.webp');
  z-index: 0;

  @media (max-width: 768px) {
    background-image: url('../../assets/cover-features-mobile.webp');
  }
}

.p-btn {
  width: 100%;
  text-align: center;
}

ol > li {
  font-weight: bold;
}
</style>
