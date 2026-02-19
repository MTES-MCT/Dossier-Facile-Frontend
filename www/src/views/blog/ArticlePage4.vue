<template>
  <BlogArticle
    title="5 astuces pour booster votre dossier de location"
    date="25 Mars 2021"
    hashtags="Location,DossierFacile"
  >
    <p>
      En pleine crise sanitaire, il est encore plus difficile que d’habitude de trouver un logement
      de location. Pour se distinguer des autres, un seul moyen : constituer un dossier de location
      clair, cohérent et complet. En effet, c’est par le dossier de location que le propriétaire
      prend connaissance des informations qui vous sont relatives. C’est le seul moyen pour lui de
      comparer les différents candidats. Alors voici 5 astuces pour booster votre dossier de
      location.
    </p>
    <BlogPostImage :src="image" />

    <h2>1. Donner tous les documents obligatoires</h2>
    <ul>
      <li>
        <b>Une pièce d’identité recto-verso parmi&nbsp;:</b> carte d'identité française ou étrangère
        (avec photo), passeport français ou étranger (avec photo), permis de conduire français ou
        étranger (avec photo), carte de séjour temporaire, carte de résident, carte de ressortissant
        d'un État membre de l'UE.
      </li>
      <li>
        <b>Un justificatif de domicile parmi&nbsp;:</b> 3 dernières quittances de loyer, attestation
        sur l'honneur datée et signée de l'hébergeant indiquant que le candidat à la location réside
        à son domicile à titre gratuit, attestation d'élection de domicile, dernier avis de taxe
        foncière ou, si nécessaire, titre de propriété de la résidence principale.
      </li>
      <li>
        <b>Un justificatif d’activité professionnelle&nbsp;:</b> contrat de travail ou de stage ou
        d'engagement (service civique), attestation de l'employeur, carte d'étudiant recto-verso ou
        certificat de scolarité pour l'année en cours, copie de la carte professionnelle (profession
        libérale), copie du certificat d'identification de l'Insee comportant les numéros
        d'identification (travailleur indépendant), extrait D1 original du registre des métiers de
        moins de 3 mois (artisan), extrait K ou K bis du registre du commerce et des sociétés de
        moins de 3 mois (entreprises commerciales).
      </li>
      <li>
        <b>Un justificatif de ressources&nbsp;:</b> 3 derniers bulletins de salaire, 2 derniers
        bilans comptables, justificatif de versement des indemnités, retraites, pensions,
        prestations sociales et familiales et allocations perçues lors des 3 derniers mois ou
        justificatif de l'ouverture des droits établis par l'organisme payeur, justification de
        revenus fonciers, de rentes viagères ou de revenus de valeurs et capitaux mobiliers.
      </li>
    </ul>

    <h2>2. Rédiger une page de garde avec sommaire pour son dossier de location</h2>
    <p>
      Un dossier de location comporte de nombreux documents et dépasse souvent la quinzaine de
      pages. Alors n’hésitez pas à insérer un sommaire pour permettre au propriétaire de se repérer
      dans votre dossier. De plus, il est recommandé de soigner la page de garde pour renvoyer
      l’image d’un candidat ordonné.
    </p>

    <h2>3. Rédiger une lettre de présentation et de motivation</h2>
    <p>
      Le dossier de location en lui-même ne donne que des informations factuelles sur le locataire.
      Parmi toutes les données accumulées, le propriétaire cherche malgré tout à trouver une
      personnalité qu’il juge compatible avec la location de son appartement. Vous pouvez donc lui
      écrire une lettre de présentation dans laquelle vous expliquez les motifs de votre demande de
      location afin de prouver votre sérieux et votre envie de prendre soin du logement.
    </p>

    <h2>4. Avoir un garant</h2>
    <p>
      Avoir un garant permet de rassurer le propriétaire. Le garant est une personne physique ou
      morale qui s’engage à payer le loyer et les charges locatives au cas où le locataire ne peut
      faire face à ses obligations. Si jamais vous ne connaissez pas de personne physique acceptant
      de se porter caution pour vous, il existe également des organismes comme Visale qui se portent
      garant gratuitement pour vous sous certaines conditions.
    </p>

    <h2>5. Apparaître comme un locataire stable voulant s’installer sur la durée</h2>
    <p>
      Il est toujours pénible pour un propriétaire de repartir à la recherche du bon locataire. Le
      propriétaire veut aussi s’assurer que vous n’allez pas quitter son logement trop rapidement.
      Alors montrez votre intérêt pour le logement et n’hésitez pas à préciser que le logement vous
      plait et que vous n’allez pas le quitter dans trois jours !
    </p>
  </BlogArticle>
</template>

<script setup lang="ts">
import BlogArticle from '@/views/blog/BlogArticle.vue'
import { useSeoMeta } from '@unhead/vue'
import image from '@images/blog-article4.webp'
import BlogPostImage from '@/components/BlogPostImage.vue'

const title = '5 astuces pour booster votre dossier de location'
const description =
  'Pour se distinguer des autres, un seul moyen : constituer un dossier de location clair, cohérent et complet'

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
