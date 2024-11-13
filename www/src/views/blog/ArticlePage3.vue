<template>
  <BlogArticle
    title="Pourquoi Dossier Facile est-il gratuit ?"
    date="21 Juillet 2020"
    hashtags="DossierFacile"
  >
    <p>
      Dossier facile est une start-up qui propose une
      <b>solution simple et gratuite</b> pour remettre la confiance au cœur du processus de location
      : un dossier labélisé, propre et clair, transmis sous la forme efficace d’un lien numérique.
      Cependant, efficacité et gratuité vont rarement de pair. Alors pourquoi votre dossier de
      location est-il gratuit ?
    </p>
    <img class="img-center" alt="" src="../../assets/images/blog-article3.webp" />
    <br />
    <h3 class="fr-h3">Pourquoi ce dossier de location est-il gratuit contrairement aux autres ?</h3>
    <p>
      Si DossierFacile est gratuit, c’est notamment grâce à son statut :
      <router-link to="/information">DossierFacile est une start-up d’Etat </router-link>
      . C’est-à-dire que c’est un service public, une aide que l’Etat vous propose dans la
      constitution de votre dossier de location.
    </p>
    <p>
      Le but que vise l’Etat en finançant un tel service est de
      <b> remettre la confiance au centre </b> de la relation bailleur-locataire et de
      <b> promouvoir une égalité des chances</b> face à la location.
    </p>
    <h3 class="fr-h3">Quel rapport entre un dossier de location gratuit et la confiance ?</h3>
    <p>
      Le principal problème du marché locatif est qu’il est
      <b>surchargé.</b> Les bailleurs croulent rapidement sous les dossiers, ce qui les conduit à
      écarter systématiquement les dossiers mal présentés ou sur lesquels ils ont des doutes. En
      proposant un format standard et
    </p>
    <p>
      <b>En proposant un dossier de location « 3C » (clair, complet et cohérent),</b>
      l’Etat encourage les candidats locataires à être transparents et les bailleurs à étudier
      sérieusement chaque dossier tout en continuant à
      <router-link to="/blog/quelles-pieces-justificatives-fournir-pour-mon-dossier-de-location">
        réguler la location du côté des bailleurs
      </router-link>
    </p>
    <p>
      On peut donc dire qu’à travers DossierFacile,
      <b> l’Etat s’implique dans la promotion de la confiance </b>
      entre bailleurs et locataires&nbsp;!
    </p>
    <h3 class="fr-h3">Quel rapport entre un dossier de location gratuit et l’égalité ?</h3>
    <p>
      La majorité des bailleurs demandent aujourd’hui un dossier numérique à leurs futurs locataires
      avant même la première visite. Or, en France, ce ne sont pas moins de
      <b>13 millions d’habitants </b> qui sont éloignés du numérique, soit un habitant sur cinq. Ces
      personnes-là sont de facto <b>exclues du marché de la location, </b> ou au moins fortement
      pénalisées. Cette inégalité est insupportable.
    </p>
    <p>
      DossierFacile y répond en proposant
      <b> un dossier simple, intuitif et gratuit. </b> De plus, grâce à
      <b> l’accompagnement rapide et personnalisé </b> que nous proposons, nous sommes à même de
      guider les personnes qui tâtonnent avec internet et l’informatique.
    </p>
    <p>
      D’autre part, il est très compliqué pour certaines personnes s’inscrivant dans des situations
      inhabituelles (personnes handicapées, nouvellement arrivées en France…) de trouver un bailleur
      qui veuille bien prendre le risque de leur louer son bien.
    </p>
    <p>
      <b>En proposant un dossier standardisé à ces situations hors normes,</b>
      DossierFacile rassure les propriétaires leur ouvre la porte de leur nouvel appartement.
    </p>
  </BlogArticle>
</template>

<style scoped lang="scss">
.img-center {
  max-width: 793px;
  max-height: 449px;
  width: 100%;
  height: auto;
}
</style>
<script setup lang="ts">
import BlogArticle from '@/views/blog/BlogArticle.vue'
import { useHead } from '@unhead/vue'
import image from '../../assets/images/blog-article3.webp'

const title = 'Pourquoi Dossier Facile est-il gratuit - Blog - DossierFacile'
const description =
  'DossierFacile propose une solution numérique simple et gratuite pour remettre la confiance au cœur du processus de location'
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
