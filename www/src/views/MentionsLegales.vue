<template>
  <section class="fr-mb-12w">
    <article>
      <div class="imagebg text-center">
        <div class="fr-container">
          <div class="fr-grid-row height-40">
            <div class="fr-col-md-12">
              <div>
                <h1 class="fr-h1 color--white">Mentions légales</h1>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div>
        <div class="fr-container">
          <div class="fr-grid-row justify-content-center fr-mt-2w">
            <div class="fr-col-md-10">
              <h2 class="fr-h3">Éditeur de la plateforme</h2>
              <p>
                La plateforme “DossierFacile” est éditée par :<br />
                La Direction générale de l’aménagement, du logement et de la nature (DGALN) :<br />
                Tour Séquoia<br />
                1 place Carpeaux<br />
                92800 Puteaux<br />
                France
              </p>
              <h2 class="fr-h3">Directeur de la publication</h2>
              <p>
                Le directeur de la publication est Monsieur Philippe MAZENC, directeur général de la
                DGALN.
              </p>
              <h2 class="fr-h3">Hébergement de la plateforme</h2>
              <p>
                Le site dossierfacile.logement.gouv.fr est hébergé par la société Scalingo SAS,
                inscrite au RCS (Strasbourg B 808 665 483) et dont les serveurs se situent en
                France.<br />
                SIREN : 808665483<br />
                Siège social :15 avenue du Rhin, 67100 Strasbourg, France.<br />
              </p>
              <h2 class="fr-h3">Accessibilité</h2>
              <p>
                La plateforme est partiellement conforme, nous tâchons de la rendre accessible à
                toutes et à tous.
              </p>
              <h2 class="fr-h3">En savoir plus</h2>
              <p>
                Pour en savoir plus sur la politique d’accessibilité numérique de l’État :
                https://accessibilite.numerique.gouv.fr/
              </p>
              <p>
                Pour en savoir plus sur la politique d’accessibilité de la plateforme :
                https://www.dossierfacile.logement.gouv.fr/accessibilite
              </p>
              <h2 class="fr-h3">Signaler un dysfonctionnement</h2>
              <p>
                Si vous rencontrez un défaut d’accessibilité vous empêchant d’accéder à un contenu
                ou une fonctionnalité de la plateforme, merci de nous en faire part :
                contact@dossierfacile.logement.gouv.fr
              </p>
              <p>
                Si vous n’obtenez pas de réponse rapide de notre part, vous êtes en droit de faire
                parvenir vos doléances ou une demande de saisine au Défenseur des droits.
              </p>
              <h2 class="fr-h3">Sécurité</h2>
              <p>
                La plateforme est protégée par un certificat électronique, matérialisé pour la
                grande majorité des navigateurs par un cadenas. Cette protection participe à la
                confidentialité des échanges.
              </p>
              <p>
                En aucun cas, les services associés à la Plateforme ne seront à l’origine d’envoi de
                courriels pour vous demander la saisie d’informations personnelles.
              </p>
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
  title: 'Mentions légales - DossierFacile',
  meta: [
    {
      name: 'description',
      content:
        'DossierFacile s’engage à protéger vos données personnelles : créez votre dossier de location en toute sécurité'
    }
  ]
})
</script>

<style scoped lang="scss">
@use 'df-shared-next/src/scss/_variables.scss';

a {
  color: var(--light-blue);
}

.height-40 {
  height: auto;
  align-items: center;
  @media (min-height: 600px) and (min-width: 767px) {
    height: 40vh;
  }
}

.imagebg {
  width: 100%;
  top: 0;
  left: 0;
  background-size: cover !important;
  background-position: 50% 50% !important;
  background-image: url('../assets/images/en-savoir-plus/en-savoir-plus-image2.webp');
  background-color: #314467;
  z-index: 0;
}
</style>
