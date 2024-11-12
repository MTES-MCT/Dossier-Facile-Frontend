<template>
  <BlogArticle
    title="Tout comprendre à la vie en colocation"
    date="3 Mai 2021"
    hashtags="Colocation"
  >
    <p>
      Devant la hausse des loyers, de nombreux locataires choisissent aujourd'hui de partager un
      logement afin de diviser le coût de la location. Pour le bailleur, la colocation permet de
      louer plus facilement un grand logement et de bénéficier d’une solidarité entre les
      locataires.
      <br />
      Que ce soit entre amis, en famille ou bien avec des inconnus, la colocation obéit toutefois à
      de nombreuses règles que nous allons vous présenter.
    </p>
    <p>
      <img alt="" class="img-center" src="../../assets/images/blog-article7.webp" />
    </p>
    <h2>1. Comment définir la colocation</h2>
    <p>
      La loi pour l’accès au logement et un urbanisme rénové (Alur) met en place la pratique de la
      colocation
      <a
        target="_blank"
        rel="noreferrer"
        href="https://www.legifrance.gouv.fr/loda/article_lc/LEGIARTI000038834725/2019-09-01"
        >par ces termes</a
      >
      : « La colocation est définie comme la location d’un même logement par plusieurs locataires,
      constituant leur résidence principale et formalisée par la conclusion d’un contrat unique ou
      de plusieurs contrats entre les locataires et les bailleurs. »
    </p>
    <h2>2. Qu’est ce que la clause de solidarité&nbsp;?</h2>
    <p>
      Elle est souvent exigée par le propriétaire afin qu’il se prémunisse contre les impayés.
      Ainsi, si un colocataire ne paie pas sa part de loyer, le propriétaire peut se retourner
      contre les autres pour exiger la somme due. En l’absence de cette clause, chaque locataire
      n’est redevable que de sa quote-part du loyer.
    </p>
    <h2>3. Qu’est-ce que le dépôt de garantie&nbsp;?</h2>
    <p>
      Le dépôt de garantie est partagé entre les colocataires signataires du bail et versé à
      l’entrée des lieux. Il ne peut être demandé que s’il est mentionné dans le contrat et que son
      montant correspond à un mois de loyer hors taxe. Le propriétaire n’est pas obligé de restituer
      le dépôt de garantie au colocataire qui part seul en cours de bail. Le colocataire devra
      attendre la fin du bail pour récupérer son dépôt de garantie sinon, il peut toujours
      s’arranger avec le propriétaire pour que son dépôt de garantie lui soit remboursé par celui
      qui le remplace.
    </p>
    <h2>4. Peut-on percevoir des aides lors d’une colocation&nbsp;?</h2>
    <p>
      Chaque colocataire peut obtenir une aide au logement pour la part de loyer dont il est
      redevable, s'il remplit les conditions pour y avoir droit. Chaque colocataire doit faire sa
      propre demande, par exemple
      <a target="_blank" href="https://www.caf.fr/" rel="noreferrer">auprès de la Caf</a>
      (Caisse d’allocations familiales).
    </p>
    <h2>5. Comment réagir au départ d’un colocataire&nbsp;?</h2>
    <p>
      Le colocataire souhaitant quitter le logement doit adresser au propriétaire un congé par
      lettre recommandée avec accusé de réception en respectant le délai de préavis prévu dans le
      contrat de location. En général, ce préavis est de trois mois pour les locations vides et de
      un mois pour les locations meublées (la durée du préavis varie selon que votre logement se
      trouve en zone tendue ou non,
      <a
        target="_blank"
        rel="noreferrer"
        href="https://www.service-public.fr/particuliers/vosdroits/F1168#:~:text=perte%20d'emploi-,D%C3%A9lai%20de%20pr%C3%A9avis%20%3A%201%20mois.,au%20cours%20du%20m%C3%AAme%20bail"
        >en savoir plus</a
      >). <br />
    </p>
    <p>
      Un avenant au bail doit être rédigé entre les colocataires qui restent et celui qui arrive,
      afin de libérer l’ancien de ses obligations et faire apparaître le nom du nouveau colocataire.
    </p>
    <p>
      Attention, si le bail contient une clause solidarité (voir 2.) le colocataire quittant le
      logement reste tenu de payer les loyers et charges dus jusqu'à la fin de son préavis si un
      nouveau colocataire le remplace. S'il n'a pas de remplaçant, le colocataire reste tenu du
      paiement des loyers et charges dus jusqu'à 6 mois après la fin de son préavis. Les obligations
      de la personne qui s'est portée caution pour le colocataire sortant cesse dans les mêmes
      conditions.
    </p>
  </BlogArticle>
</template>

<style scoped lang="scss">
.img-center {
  max-width: 750px;
  max-height: 500px;
  width: 100%;
  height: auto;
}
</style>
<script setup lang="ts">
import BlogArticle from '@/views/blog/BlogArticle.vue'
import { useHead } from '@unhead/vue'
import image from '../../assets/images/blog-article7.webp'

const title = 'Tout comprendre à la vie en colocation - DossierFacile'
const description =
  'Quelles sont les règles à respecter avant de se mettre en colocation ? DossierFacile vous aide à y voir plus clair !'
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
