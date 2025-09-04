<template>
  <BlogArticle
    title="DossierFacile.fr devient enfin DossierFacile.logement.gouv.fr !"
    date="11 Octobre 2023"
    hashtags=""
  >
    <p>
      Vous avez été nombreux à vous interroger sur la raison pour laquelle DossierFacile, un site
      proposé par l’Etat pour faciliter la création de dossiers de location et l’accès au logement,
      n'avait pas l'extension .gouv.fr. Nous avions d’ailleurs publié un article à ce sujet
      récemment :
      <a
        href="https://www.dossierfacile.logement.gouv.fr/blog/dossierfacile-un-service-numerique-de-letat-sans-gouv-fr"
      >
        https://www.dossierfacile.logement.gouv.fr/blog/dossierfacile-un-service-numerique-de-letat-sans-gouv-fr</a
      >
    </p>
    <p>C’est désormais chose faite et nous vous en disons plus ci-dessous.</p>
    <img class="fr-mb-3w" alt="" src="../../assets/images/blog-article22.webp" />
    <p>
      DossierFacile est donc enfin accessible depuis l’URL DossierFacile.logement.gouv.fr, une
      adresse qui reflète mieux notre mission de service public et notre engagement en faveur de la
      transparence et de la sécurité de nos usagers et de leurs données personnelles.
    </p>
    <h2 class="fr-h6">DossierFacile.logement.gouv.fr : un gage de qualité et de sécurité</h2>
    <p>
      Le domaine en .gouv est un signe de reconnaissance et de qualité fourni par le gouvernement
      aux services publics numériques respectant des conditions strictes. Il garantit que le site
      est un service de l’État, et qu’il respecte les normes les plus élevées en matière de
      protection des données personnelles, de sécurité, d’accessibilité et de transparence.
    </p>
    <p>
      En passant au domaine ".gouv", DossierFacile renforce ainsi son identité de service public et
      vous apporte une garantie supplémentaire sur la protection et le respect de vos données
      personnelles. Vous pouvez ainsi continuer à créer et partager votre dossier de location
      numérique en toute confiance et sécurité.
    </p>
    <h2 class="fr-h6">Qu'est-ce que cela signifie pour vous ?</h2>
    <p>
      Rien ne change dans les faits à part l’URL. Vous pouvez ainsi continuer d’utiliser
      DossierFacile en toute confiance et sécurité pour créer et gérer votre dossier de location.
    </p>
    <ul>
      <li>Votre garantie d’authenticité</li>
      <p>
        Une des principales façons de reconnaître un site institutionnel légitime est le domaine en
        .gouv. Ce suffixe est une indication claire que vous êtes sur un site gouvernemental
        officiel. Il est attribué uniquement aux institutions gouvernementales, ce qui garantit que
        vous avez affaire à une source fiable.
      </p>
      <li>Protection de vos données personnelles</li>
      <p>
        Nous comprenons également l'importance de la sécurité de vos données personnelles. Notre
        site institutionnel est construit avec les normes de sécurité les plus strictes pour
        protéger vos informations. Vous pouvez naviguer sur notre site en toute confiance, sachant
        que vos données sont entre de bonnes mains. Les opérateurs et l’équipe technique
        DossierFacile sont les seuls à accéder à vos données lors de la vérification de vos données.
        Vos données personnelles ne seront jamais revendues, et elles ne seront pas non plus
        communiquées à des tiers sans votre accord.
      </p>
      <li>Accessibilité numérique</li>
      <p>
        Un autre signe distinctif des sites institutionnels est leur engagement envers
        l'accessibilité. Nous nous efforçons de rendre notre site accessible à tous, y compris aux
        personnes ayant des besoins spécifiques. Vous trouverez des fonctionnalités qui facilitent
        la navigation pour tous les utilisateurs, quel que soit leur niveau d'accessibilité.
        Aujourd’hui, DossierFacile a un taux de conformité à 75% mais nous souhaitons atteindre les
        100% d'accessibilité d’ici la fin de l’année.
      </p>
    </ul>
    <p>
      Un très grand nombre de conditions devaient être remplies pour obtenir le .gouv. Vous pouvez
      toujours les découvrir via le lien précédemment joint.
    </p>
  </BlogArticle>
</template>

<script setup lang="ts">
import BlogArticle from '@/views/blog/BlogArticle.vue'
import { useHead } from '@unhead/vue'
import image from '../../assets/images/blog-article22.webp'

const title = 'DossierFacile.fr devient enfin DossierFacile.logement.gouv.fr ! - DossierFacile'
const description =
  'DossierFacile est donc enfin accessible depuis l’URL DossierFacile.logement.gouv.fr, une adresse qui reflète mieux notre mission de service public'
useHead({
  title: title,
  meta: [
    { name: 'og:title', content: title },
    { name: 'twitter:title', content: title },
    { name: 'description', content: description },
    { name: 'og:description', content: description },
    { name: 'twitter:description', content: description },
    { name: 'og:image', content: image },
    { name: 'twitter:image', content: image }
  ]
})
</script>

<style lang="scss" scoped>
li {
  font-weight: bold;
  font-size: 1.1rem;
}

ul > p {
  margin-left: -1rem;
}
</style>
