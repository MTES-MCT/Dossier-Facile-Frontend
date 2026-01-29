<template>
  <div>
    <section class="s0-background fr-pb-9w">
      <div class="fr-container">
        <div class="fr-col-md-8">
          <div class="fr-grid-col">
            <h1 class="fr-h1 color--white fr-mt-5w fr-mb-5w">
              {{ title }}
            </h1>
            <p class="text-bold color--white">
              Votre dossier locatif numérique certifié par l'État, anciennement Locatio
            </p>
          </div>
        </div>
      </div>
    </section>
    <section class="fr-mt-3w fr-mb-5w">
      <div class="fr-container">
        <div class="fr-grid-row">
          <h2>Comment créer votre dossier de location d'appartement avec DossierFacile ?</h2>
          <p>
            DossierFacile est le service public gratuit qui vous permet de constituer un dossier
            locataire numérique fiable et sécurisé. Notre plateforme vous accompagne pour créer un
            dossier de logement complet qui répond aux attentes des propriétaires.
          </p>
          <ol>
            <li>
              <h3>Déposez vos documents pour votre dossier locatif</h3>
              <p>
                Accéder à
                <a href="https://www.dossierfacile.logement.gouv.fr"
                  >www.dossierfacile.logement.gouv.fr</a
                >
                pour constituer votre dossier locatif. Voici les pièces nécessaires pour un dossier
                de location complet&nbsp;:
              </p>

              <ul>
                <li>Pièce d'identité (obligatoire pour tout dossier locataire)</li>
                <li>Justificatif de domicile actuel</li>
                <li>Justificatif professionnel (contrat de travail, carte étudiante...)</li>
                <li>Dernier avis d'imposition</li>
                <li>Justificatifs de ressources (3 derniers bulletins de salaire, bourses...)</li>
              </ul>

              <p>
                Ces documents constituent la base d'un dossier de location d'appartement conforme.
              </p>
            </li>

            <li>
              <h3>Validation de votre dossier locatif par nos experts</h3>
              <p>
                Notre équipe vérifie minutieusement votre dossier de location selon nos critères
                "3C" :
                <strong>Clair, Complet et Cohérent</strong>. Nous vous guidons pour optimiser votre
                dossier si nécessaire et appliquons un filigrane sur les pièces de votre dossier de
                location pour protéger votre dossier d'un usage non autorisé (usurpation d'identité,
                copie illégale...).
              </p>
            </li>
            <li>
              <h3>Partagez votre dossier de location certifié</h3>
              <p>
                Votre dossier locataire numérique est disponible sous deux formats : un lien URL
                sécurisé ou un fichier PDF. Les propriétaires et agents immobiliers peuvent
                consulter vos pièces justificatives en toute sécurité grâce au filigrane
                DossierFacile qui protège vos documents.
              </p>
            </li>
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
import { useSeoMeta } from '@unhead/vue'
import { useI18n } from 'vue-i18n'
import image from '@/assets/cover-features.webp'

const { t } = useI18n()
const REGISTER_URL = import.meta.env.VITE_REGISTER_URL

const title = 'Créez votre dossier de location en ligne avec DossierFacile'
const description =
  'DossierFacile est le service public gratuit qui vous permet de constituer un dossier locataire numérique fiable et sécurisé. Notre plateforme vous accompagne pour créer un dossier de logement complet qui répond aux attentes des propriétaires'

const siteTitle = import.meta.env.VITE_SITE_TITLE
const seoTitle = `${title} - ${siteTitle}`

useSeoMeta({
  title: title,
  description: description,
  ogTitle: seoTitle,
  ogImage: image,
  ogDescription: description,
  twitterTitle: seoTitle,
  twitterImage: image,
  twitterDescription: description
})
</script>

<style scoped lang="scss">
.s0-background {
  width: 100%;
  top: 0;
  left: 0;
  background-size: cover !important;
  background-position: 50% 50% !important;
  background-image: url('@/assets/cover-features.webp');
  z-index: 0;

  @media (max-width: 768px) {
    background-image: url('@/assets/cover-features-mobile.webp');
  }
}

.p-btn {
  width: 100%;
  text-align: center;
}
</style>
