<template>
  <BlogArticle
    title="DossierFacile : un service numérique de l’État sans .gouv.fr ?"
    date="14 Mars 2023"
    hashtags="DossierFacile"
  >
    <p>
      Vous êtes peut-être surpris de constater que DossierFacile, un site proposé par l'État pour
      faciliter la création de dossiers de location de logement, n'a pas l'extension .gouv.fr. En
      effet, contrairement à la plupart des sites gouvernementaux, DossierFacile a un nom de domaine
      en .fr.
    </p>
    <img alt="" class="img-center" src="../../assets/images/blog-article16.webp" />
    <br />

    <h2>Mais pourquoi ce choix ?</h2>
    <p>
      Tout d'abord, il convient de préciser que l'extension .gouv.fr est réservée aux sites
      institutionnels des services de l'État. Or, DossierFacile est un service qui vise à simplifier
      les démarches administratives pour les particuliers et les professionnels, sans être
      directement lié à une administration ou un ministère en particulier. Initialement, le choix
      d'un nom de domaine en .fr permettait ainsi de mieux refléter la vocation de ce service, qui
      s'adresse à l'ensemble de la population (comme par exemple
      <a href="https://www.service-public.fr">www.service-public.fr</a>).
    </p>
    <p>
      De plus, l'utilisation d'un nom de domaine en .fr permettait de renforcer l'image de modernité
      et d'innovation de DossierFacile, en démarquant ce service des sites gouvernementaux plus
      traditionnels. Ce choix de nom de domaine témoignait également de la volonté de l'État de
      proposer des services numériques innovants et de qualité, en s'inscrivant dans une logique
      d'amélioration constante de l'expérience utilisateur.
    </p>

    <h2>Un choix remis en question</h2>
    <p>
      Néanmoins, DossierFacile est un site sur lequel les utilisateurs partagent de nombreuses
      données personnelles, et beaucoup d’entre eux nous ont fait remarquer qu’il ferait davantage
      confiance à un site en .gouv.fr. D’autres témoignages ont montré que certains pensaient
      carrément que nous étions une arnaque. Pourtant pas de doute, nous sommes référencés sur
      <a href="https://www.service-public.fr/particuliers/vosdroits/R51424"
        >le site officiel du Service Public</a
      >
      et celui de l’<a href="https://observatoire.numerique.gouv.fr/observatoire/"
        >Observatoire Numérique de la qualité des démarches en ligne</a
      >.
    </p>
    <p>Pour régler ce problème, nous avons donc décidé d’adopter le fameux .gouv !</p>
    <p>
      Le .gouv devrait en outre permettre à DossierFacile de mieux se positionner sur les moteurs de
      recherche, en améliorant son référencement naturel, pour attirer un maximum d'utilisateurs.
    </p>
    <p>
      Le .gouv.fr est ce qu’on appelle un TLD ou “top-level domain” (en français : domaine de
      premier niveau) que l’on ajoute aux URL des sites du gouvernement afin de les reconnaître plus
      facilement. Cela permet aussi aux utilisateurs des services numériques d'être sûr qu’il
      s’agisse bien d’un site internet étatique. Le .gouv.fr a donc pour but de rassurer les
      utilisateurs et de leur garantir qu’ils ne fournissent pas leurs informations personnelles à
      de faux sites gouvernementaux.
    </p>
    <p>
      Le .gouv est propriété de l’État français, et il existe un service, le
      <a href="https://www.gouvernement.fr/service-d-information-du-gouvernement-sig"
        >Service d’information du Gouvernement</a
      >
      (SIG) chargé d’accorder aux sites web étatiques le droit de l’utiliser.
    </p>

    <h2>Bientôt un .gouv pour DossierFacile !</h2>
    <p>
      Un très grand nombre de conditions doivent être remplies pour obtenir le .gouv : respect de
      nombreux référentiels et réglementations sur le protection des données, la sécurité,
      l’accessibilité numérique pour les personnes en situation de handicap, respect de la
      réglementation sur les cookies, ouverture des données, suivi d’objectifs, outil de mesure
      d’audience respectant le RGPD, respect du design system de l’État… et ceci afin de garantir
      l’image de l’État, le bon fonctionnement du service et son respect de vos droits et de votre
      sécurité.
    </p>
    <p>
      Après plusieurs mois d’efforts, DossierFacile remplit quasiment toutes les conditions requises
      pour l’obtention du précieux sésame. Nous finalisons notre conformité sur l’accessibilité
      numérique pour atteindre les 75% d’accessibilité requis.
    </p>
    <p>D’ici l’été 2023, dossierfacile.fr devrait devenir dossierfacile.logement.gouv.fr !</p>
  </BlogArticle>
</template>

<style scoped lang="scss">
.img-center {
  max-width: 714px;
  max-height: 460px;
  width: 100%;
  height: auto;
}
</style>
<script setup lang="ts">
import BlogArticle from '@/views/blog/BlogArticle.vue'
import { useHead } from '@unhead/vue'
import image from '../../assets/images/blog-article16.webp'

const title = 'DossierFacile : un service numérique de l’État sans .gouv.fr ?'
const description =
  "Vous êtes peut-être  surpris de constater que DossierFacile, un site proposé par l'Etat pour faciliter la création de dossiers de location de logement, n'a pas l'extension .gouv.fr."
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
