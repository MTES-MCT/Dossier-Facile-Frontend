<template>
  <BlogArticle title="DossierFacile fait peau neuve !" date="6 Avril 2021">
    <p>
      Afin de mieux répondre aux besoins de nos locataires et propriétaires, le service
      <a href="/">DossierFacile</a> fait peau neuve avec un nouveau site ! Un parcours utilisateur
      plus simple, un design plus recherché, une visualisation plus claire… Le tout pour un service
      toujours plus efficace ! On est très fiers de vous présenter le nouveau DossierFacile ! Notre
      objectif ? Faciliter le téléchargement de vos pièces justificatives : un gain de temps pour
      vous, pour nous, et pour votre futur propriétaire !
    </p>
    <img alt="" class="img-center" src="../../assets/images/blog-article6.webp" />
    <h2>1. Le parcours utilisateur</h2>
    <p>
      Le parcours utilisateur, qui permet de constituer son dossier de location, a été entièrement
      repensé. Là où auparavant il fallait ajouter ses pièces justificatives les unes à la suite des
      autres dans un ordre imposé, il est désormais possible de joindre ses pièces dans n’importe
      quel ordre. Concrètement ? Le site présente cinq accordéons indépendants, correspondant aux
      cinq étapes spécifiques du parcours (pièce d’identité, justificatif de domicile, justificatif
      d’activité professionnelle, justificatif de ressources, avis d’imposition). <br />
      L’accès à chacune de ces étapes pourra se faire dans l’ordre souhaité par le locataire, qui
      pourra facilement revenir en arrière si besoin. <br />
      Petit plus : nous avons ajouté sur la droite un panneau récapitulatif vous permettant de
      visualiser ou modifier vos pièces d’un simple clic, et de suivre quelles pièces justificatives
      il vous manque encore pour finaliser votre dossier.
    </p>
    <h2>2. Les nouvelles fonctionnalités</h2>
    <p>
      Deux nouvelles fonctionnalités ont été ajoutées pour vous garantir un meilleur service. <br />
      Premièrement, il est vous est désormais possible d’ajouter plusieurs garants à votre dossier
      location. Vous êtes étudiant et vous souhaitez que vos deux parents se portent garants pour
      vous ? Ce n’est plus un problème : en choisissant l’option “garant physique”, vous pourrez
      cumuler plusieurs garants physiques différents. À l’inverse, vous pourrez tout aussi
      facilement supprimer un garant de votre dossier. <br />
      Deuxièmement, il est maintenant possible d’ajouter plusieurs types de revenus pour un même
      dossier : salaires, prestations sociales, rentes, pensions… Vous cumulez plusieurs types de
      revenus ? Ce n’est plus un problème, puisque vous pouvez ajouter autant de sources de revenus
      que nécessaires.
    </p>
    <h2>3. Le choix du design</h2>
    <p>
      Matthieu (notre dev front) et Michael (notre designer UI) ont travaillé d’arrache pied pour
      créer une nouvelle interface plus ergonomique et plus intuitive, s’intégrant au design system
      de l’Etat. Choix des couleurs, position des boutons ou contenu du texte, tout est fait pour
      rendre le parcours simple et clair.
      <br />
      En cas de difficulté, une rubrique “aide” sera là pour vous guider. Si celle-ci ne répond pas
      à votre problème, vous pourrez toujours nous contacter pour des conseils personnalisés !
    </p>
    <h2>4. Un service plus efficace</h2>
    <p>
      L’objectif de cette refonte est également de faciliter la validation de votre dossier par nos
      opérateurs. <br />

      Par exemple, les pièces justificatives sont désormais mieux qualifiées : il faudra notamment
      préciser quel type de pièce d’identité vous joignez (une CNI, un passeport, un titre de
      séjour…?). Cette qualification plus précise permet un gain de temps important au moment de
      vérifier votre dossier. Celui-ci sera alors validé beaucoup plus rapidement ! <br />

      Notre objectif ? Valider votre dossier en moins de 6h. Être réactif, c’est ce qui permettra
      d’envoyer votre dossier complet au plus vite au propriétaire et donc d’être plus susceptible
      de trouver un logement !
    </p>
    <p>
      N’hésitez pas à nous donner votre avis sur notre service via l’adresse
      <a href="mailto:contact@dossierfacile.logement.gouv.fr"
        >contact@dossierfacile.logement.gouv.fr</a
      >
      ! Nous serons ravis d’échanger avec vous sur votre expérience, et d’écouter vos
      recommandations !
    </p>
  </BlogArticle>
</template>

<script setup lang="ts">
import BlogArticle from '@/views/blog/BlogArticle.vue'
import { useHead } from '@unhead/vue'
import image from '../../assets/images/blog-article6.webp'

const title = 'DossierFacile fait peau neuve ! - DossierFacile'
const description =
  'Afin de mieux répondre aux besoins de nos locataires et propriétaires, le service DossierFacile fait peau neuve avec un nouveau site'
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
  max-width: 768px;
  max-height: 513px;
  width: 100%;
  height: auto;
}
</style>
