<template>
  <BlogArticle
    title="Constituer votre DossierFacile"
    date="12 Décembre 2019"
    hashtags="DossierFacile"
  >
    <p>
      Dans un contexte de pénurie de logements,
      <router-link to="/blog/quelles-pieces-justificatives-fournir-pour-mon-dossier-de-location"
        >le dossier est devenu un facteur démarquant.
      </router-link>
      Mais comment constituer un dossier de location qui regroupe tous les documents nécessaires
      sans tomber dans le désordre d’un pdf de cinquante pages ? Existe-t-il un outil facile et
      gratuit ?
    </p>
    <BlogPostImage :src="image" />
    <p>
      Toute la difficulté est ici de rester le plus simple possible.
      <b> Présenter un dossier cohérent et complet de manière claire </b>
      relève aujourd’hui de l’exploit et peut prendre des heures si l’on s’y prend mal ou que l’on
      n’est pas un professionnel de l’informatique. Avec DossierFacile, si vous avez déjà tous vos
      documents, cela
      <b>peut prendre moins de 5 minutes</b> quelle que soit votre situation.
    </p>
    <h3 class="fr-h3">Pourquoi constituer un Dossier Facile ?</h3>
    <p>
      Parce que nous avons déjà fait nos preuves ! Sur quasiment 80 000 locataires qui ont utilisé
      nos services, 91,2% d’eux se sont déclarés satisfaits !
    </p>
    <p>
      D’une part, grâce à la clarté, la complétude et la cohérence de votre dossier que garantit le
      label DossierFacile,<b>
        vous gagnez 24% de chances que le propriétaire de l’appartement que vous désirez vous
        réponde.</b
      >
    </p>
    <p>
      D’autre part,<b> nous sommes respectueux de vos données.</b>
      Votre compte est automatiquement supprimé au bout de trois semaines d’inactivité, et toutes
      vos données avec lui. Vous pouvez aussi supprimer un document à tout bout de champ :
      <b>nous ne gardons ni ne divulguons rien&nbsp;!</b> Un accompagnement vous est aussi proposé
      pour vous aider à ne communiquer que les documents nécessaires aux propriétaires.
    </p>
    <p>
      Mais ce n’est pas tout&nbsp;! <b>Votre service est</b> aussi <b> personnalisé&nbsp;!</b> En
      effet, l’étude de vos documents n’est pas faite par un robot mais par un être humain. Ce sont
      nos équipes qui s’attellent à vérifier vos documents et à vous faire
      <b>des retours adaptés</b> le cas échéant&nbsp;! Chez DossierFacile,<b>
        vous n’êtes pas enfermés dans des cases et ne sortez jamais des clous&nbsp;!</b
      >
      Quelle que soit votre situation, nous nous engageons à toujours trouver une solution pour vous
      aider à constituer votre dossier.
    </p>
    <h3 class="fr-h3">Est-ce gratuit ?</h3>
    <p>
      Assurément&nbsp;! DossierFacile est entièrement gratuit&nbsp;! Voir là-dessus notre article :
      <router-link to="/blog/quelles-pieces-justificatives-fournir-pour-mon-dossier-de-location"
        >Pourquoi DossierFacile est-il gratuit ?
      </router-link>
    </p>
    <h3 class="fr-h3">Comment constituer un Dossier Facile ?</h3>
    <p>
      Pour constituer votre DossierFacile, vous devrez d’abord vous inscrire en rentrant votre nom,
      votre prénom, votre adresse-mail et un mot de passe pour protéger l’accès à vos documents.
    </p>
    <p>
      Ensuite, après avoir choisi si vous louez seul, en colocation ou en couple, vous devrez
      indiquer votre situation professionnelle et votre salaire
    </p>
    <p>Tour à tour, vous rentrerez :</p>
    <ul>
      <li>votre pièce d’identité</li>
      <li>
        vos trois dernières quittances de loyer (locataires), un avis de taxes foncières
        (propriétaires) ou une attestation d’hébergement à titre gratuit
      </li>
      <li>votre contrat de travail</li>
      <li>votre avis d’imposition</li>
      <li>et vos justificatifs de ressource des trois derniers mois.</li>
    </ul>
    <p>
      Recommencez les mêmes opérations pour votre garant si vous en avez un, cochez la case de
      prévention des risques pour production de faux et c’est bon&nbsp;!
    </p>
    <p>
      Nous vérifions ensuite rapidement vos pièces (moins de 24h) et, si tout est bon, nous validons
      votre dossier. Vous recevez alors un lien vers votre
      <b>dossier « 3C » (Complet, Clair et Cohérent) </b>que vous pouvez dès lors envoyer à votre
      futur propriétaire.
    </p>
  </BlogArticle>
</template>

<script setup lang="ts">
import BlogArticle from '@/views/blog/BlogArticle.vue'
import { useSeoMeta } from '@unhead/vue'
import image from '@images/blog-article2.webp'
import BlogPostImage from '@/components/BlogPostImage.vue'

const title = 'Constituer votre DossierFacile - Blog'
const description =
  'Mais coconstituer un dos sier de location qui regroupe tous les documents nécessaires sans tomber dans le désordre d’un pdf de cinquante pages ? Existe-t-il un outil facile et gratuit ?'

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
