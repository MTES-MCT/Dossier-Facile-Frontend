<template>
  <BlogArticle
    title="Quand les journalistes parlent de DossierFacile"
    date="14 Février 2022"
    hashtags="DossierFacile"
  >
    <p>
      <img alt="" class="img-center" src="../../assets/images/blog-article10.webp" />
    </p>
    <p>
      Constituer son dossier de location est une étape indispensable pour trouver le logement de ses
      rêves et pourtant c’est un parcours semé d’embûches ! DossierFacile est le service public
      numérique gratuit et indispensable pour constituer et partager sereinement son dossier. En
      pleine croissance, le service a fait l’objet de nombreux articles. Revue de presse.
    </p>
    <h2>Aider et protéger les candidats à la location</h2>
    <p>
      <i>
        “DossierFacile : nouveau-né dans les services en ligne de l'État, permet de vérifier et
        certifier les dossiers de location pour rassurer les bailleurs.”
      </i>
      présente
      <a
        href="https://start.lesechos.fr/au-quotidien/budget-conso/rentree-universitaire-toutes-les-aides-2021-pour-les-etudiants-1345229"
        target="_blank"
        >Les Echos Start</a
      >
      dans un article de septembre 2021 sur les aides pour les étudiants.
      <i>
        “Dès que votre dossier est complet et conforme, le service vous envoie un lien unique à
        communiquer aux propriétaires.”
      </i>
      En effet, constituer un dossier complet et conforme est souvent un premier écueil.
      <i>
        “Déposer une candidature incomplète, surtout dans cette période, c’est prendre le risque que
        les propriétaires l’éliminent directement. Ils en reçoivent tellement qu’ils ne prennent
        souvent pas la peine de relancer les candidats au dossier incomplet.”
      </i>
      explique le magazine
      <a
        href="https://www.capital.fr/immobilier/6-conseils-pour-denicher-son-logement-etudiant-1412317"
        target="_blank"
        >Capital.fr</a
      >
      le 19 août 2021. Avec DossierFacile, le dossier est toujours complet !
    </p>
    <p>
      Second constat alarmant : de plus en plus de propriétaires demandent aux futurs locataires des
      pièces qui dépassent le
      <a href="https://www.legifrance.gouv.fr/loda/id/JORFTEXT000031444493/" target="_blank"
        >cadre légal</a
      >.
      <i>
        “Saviez-vous qu’il existe un téléservice appelé « DossierFacile », où un locataire a la
        possibilité de déposer les documents qui peuvent être légalement exigés ?”
      </i>
      relève
      <a
        href="https://immobilier.lefigaro.fr/annonces/edito/louer/je-prepare-mon-dossier/cheque-reservation-location-est-ce-legal"
        target="_blank"
        >Le Figaro Immobilier</a
      >
      dans un article de 2020.
      <a
        href="https://www.connexionfrance.com/Practical/Property/French-website-makes-rental-paperwork-easier-for-tenants-and-landlords"
        target="_blank"
        >The Connexion</a
      >, un magazine d’actualités françaises en anglais, et qui consacre ce mois-ci un plein article
      à DossierFacile, ne dit pas autre chose :
      <i>
        “As well as being convenient, the site is useful in providing only information to estate
        agents and landlords that is legally required. This has helped stop abuses, such as them
        demanding months of bank statements, something which is actually illegal.”
      </i>
    </p>
    <p>
      Autre sujet crucial : le nombre croissant de victimes de fausses annonces et de vols
      d’identité. La protection des données personnelles est au cœur du service, comme le rappelle
      <a
        href="https://www.lemonde.fr/argent/article/2021/11/29/immobilier-attention-aux-dossiers-de-location-falsifies_6103974_1657007.html"
        target="_blank"
        >LeMonde.fr</a
      >
      le 29 novembre 2021 :
      <i>
        “Autre avantage pour le locataire : les documents personnels envoyés sont recouverts de
        filigrane afin de le protéger contre la fraude” </i
      >.
    </p>
    <h2>Rassurer les propriétaires</h2>
    <p>
      <i>
        “L'Etat propose le service DossierFacile (...) pour rassurer le propriétaire pour qui le
        paiement du loyer et l'entretien du bien sont les points les plus importants.”
      </i>
      note
      <a
        href="https://www.bfmtv.com/immobilier/location/location-cinq-conseils-pour-votre-recherche-de-logement_AN-202112010367.html"
        target="_blank"
        >BFM Immo</a
      >
      le 1er décembre 2021.
      <i>
        “Cette plateforme a l’avantage d’aider à vérifier que le dossier est complet et que les
        justificatifs sont cohérents.”
      </i>
      abonde Le Figaro Immobilier. Ainsi la plateforme se charge d’éviter aux bailleurs les dossiers
      falsifiés ainsi que le pénible travail de relance sur des dossiers incomplets, pour
      <i> in fine </i>
      faciliter le choix du bon candidat ! Objectif final : rétablir la confiance entre les
      locataires et les propriétaires.
    </p>
    <h2>FranceConnect et automatisation pour 2022</h2>
    <p>
      En 2022,
      <i>
        “Nous allons faire en sorte que le dossier soit encore plus simple à utiliser et qu’il donne
        encore plus confiance aux propriétaires. L’idée est de synchroniser DossierFacile et
        FranceConnect.”
      </i>
      rapporte
      <a
        href="https://www.destinationimmo.com/article-dossierfacile-la-start-up-d-etat-qui-securise-le-dossier-de-location"
        target="_blank"
        >destinationimmo.com</a
      >
      dans une interview réalisée fin janvier 2022.
      <i>
        “Lorsque vous vous connectez à FranceConnect, votre dossier est déjà constitué et vous
        n’avez rien à faire. (...) La vérification est automatique et le bailleur est rassuré.”
      </i>
    </p>
  </BlogArticle>
</template>

<style scoped lang="scss">
.img-center {
  max-width: 768px;
  max-height: 512px;
  width: 100%;
  height: auto;
}
</style>
<script setup lang="ts">
import BlogArticle from '@/views/blog/BlogArticle.vue'
import { useHead } from '@unhead/vue'
import image from '../../assets/images/blog-article10.webp'

const title = 'Quand les journalistes parlent de DossierFacile'
const description =
  'Constituer son dossier de location est une étape indispensable pour trouver le logement de ses rêves et pourtant c’est un parcours semé d’embûches'
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
