<template>
  <BlogArticle
    title="Quelles pièces justificatives fournir pour mon dossier de location ?"
    date="14 Novembre 2019"
    hashtags="Location,DossierFacile"
  >
    <p>
      A cause de l’augmentation de la demande immobilière, il devient de plus en plus difficile de
      trouver un bon appartement à louer. Dans cette recherche,
      <b> le dossier est un facteur démarquant.</b> Comment constituer mon dossier de location ? Que
      peut demander le propriétaire ? Bien que la loi encadre ces pratiques, un grand flou règne
      encore souvent autour des éléments qu’il faut fournir pour avoir un dossier de location
      complet, clair et cohérent.
    </p>
    <img alt="" src="../../assets/images/blog-article.webp" class="img-center" />
    <p>
      Le propriétaire peut exiger auprès du candidat locataire des documents attestant : de
      l’identité du candidat, de son précédent domicile, de son activité professionnelle, de ses
      ressources.
    </p>
    <h3 class="fr-h3">La carte nationale d’identité ou les documents alternatifs</h3>
    <p>
      Afin de justifier son identité, le locataire peut fournir plusieurs documents tels que sa
      <b>carte d’identité,</b> son <b>passeport,</b> mais aussi son <b>permis de conduire.</b> Une
      <b>carte</b> de séjour peut également convenir si celle-ci est valable.
    </p>
    <h3 class="fr-h3">Le justificatif de domicile ou de bon paiement des loyers</h3>
    <p>En ce qui concerne le justificatif de domicile, il faut distinguer plusieurs cas :</p>
    <ul class="bullets">
      <li>
        Si le locataire était auparavant propriétaire de son logement, il doit fournir un
        <b> titre de propriété </b> ou un
        <b> avis de taxe foncière.</b>
      </li>
      <li>
        Si le locataire était déjà locataire auparavant, les
        <b>trois dernières quittances de loyer</b> sont sollicitées (ou une
        <b>attestation de bon paiement des loyers</b> couvrant au moins les trois derniers mois et
        émanant de l’ancien propriétaire).
      </li>
      <li>
        Si le locataire était hébergé à titre gratuit (chez ses parents par exemple), il doit
        présenter une
        <b> déclaration sur l’honneur d’hébergement à titre gratuit </b>
        émanant de la personne qui l’hébergeait.
      </li>
    </ul>
    <h3 class="fr-h3">Le contrat de travail et/ou les documents alternatifs</h3>
    <p>
      Enfin un
      <b>contrat de travail ou une attestation équivalente</b>
      (attestation d’emploi, attestation d’ouverture de droits ARE, extrait de Kbis, arrêté de
      nomination...) sont demandés. Ils ont pour but de rassurer le propriétaire quant au fait que
      son futur locataire a bien un emploi.
    </p>
    <p>
      Les <b>trois dernières fiches de paie </b> sont aussi demandées de manière presque
      systématiques à cette même fin.
    </p>
    <h3 class="fr-h3">
      Cette liste est-elle exhaustive ou le propriétaire peut-il demander tous les documents qu’il
      veut dans le dossier de location ?
    </h3>
    <p>
      Cependant, afin de protéger la vie personnelle du locataire,<b>
        le propriétaire a interdiction de lui demander certains documents :</b
      >
      la photo d’identité, une copie de relevé de compte bancaire ou postal, une autorisation de
      prélèvement automatique, une attestation d’absence de crédit en cours, un dossier médical
      personnel, un extrait de casier judiciaire, un contrat de mariage, un jugement de divorce
      ainsi qu’une carte d’assuré social.
    </p>
    <blockquote>
      « Afin de protéger la vie personnelle du locataire, le propriétaire a interdiction de lui
      demander certains documents. »
    </blockquote>
    <p>
      Auparavant seuls les documents qu’un propriétaire ne pouvait pas demander à un locataire
      étaient définis par la loi. Mais aujourd’hui,<b>la loi Alur</b>
      a clarifié les documents nécessaires à la constitution d’un dossier. Entrée en vigueur le 8
      novembre 2015, elle
      <b> vise à simplifier la relation entre propriétaires et locataires.</b>
    </p>
    <p>
      L’objectif en est également de simplifier les procédures et d’éviter de constituer un dossier
      de location cumulant les pièces inutiles. DossierFacile cherche à offrir
      <router-link to="/blog/constituer-votre-dossierFacile"
        >la démarche la plus simple et la plus intuitive possible au locataire
      </router-link>
      pour qu’il obtienne la location de son choix. Derrière cet enjeu, le défi est de réussir à
      protéger la vie privée et les données personnelles des locataires, ce que nous faisons à
      travers l’observation stricte des clauses RGPD.
      <b> DossierFacile,</b> au cœur de ces enjeux,
      <b>se met ainsi au service des locataires.</b>
    </p>
  </BlogArticle>
</template>

<script setup lang="ts">
import BlogArticle from './BlogArticle.vue'
import { useHead } from '@unhead/vue'
import image from '../../assets/images/blog-article.webp'

const title =
  'Quelles pièces justificatives fournir pour mon dossier de location - Blog - DossierFacile'
const description =
  'A cause de l’augmentation de la demande immobilière, il devient de plus en plus difficile de trouver un bon appartement à louer.'
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
<style scoped lang="scss">
.img-center {
  max-width: 731px;
  max-height: 412px;
  width: 100%;
  height: auto;
}
</style>
